// app/player/[id]/page.js
import mysql from 'mysql2/promise';
import PlayerProfileShell from './PlayerProfileShell';

export default async function PlayerPage({ params }) {
  const playerId = params?.id;
  if (!playerId) return <div>Missing player ID</div>;

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 5000,
    });

    const [playerRows] = await connection.execute(
      `SELECT 
        R.gsis_id AS player_id,
        R.full_name AS player_name,
        R.position,
        R.team,
        R.jersey_number,
        R.status,
        R.headshot_url,
        R.years_exp,
        R.college,
        R.draft_club,
        R.draft_number,
        R.rookie_year
       FROM Rosters_2024 R
       WHERE R.gsis_id = ?
       LIMIT 1`,
      [playerId]
    );

    const [careerStats] = await connection.execute(
      `SELECT
         season_override AS season,
         SUM(passing_yards) AS passing_yards,
         SUM(rushing_yards) AS rushing_yards,
         SUM(receiving_yards) AS receiving_yards,
         SUM(fantasy_points_ppr) AS fantasy_points_ppr
       FROM Player_Stats_Game_All
       WHERE player_id = ?
       GROUP BY season_override
       ORDER BY season_override DESC`,
      [playerId]
    );

    const [gameLogs] = await connection.execute(
      `SELECT
        season,
        week,
        opponent_team_id,
        passing_yards,
        rushing_yards,
        receiving_yards,
        passing_tds,
        rushing_tds,
        receiving_tds,
        fantasy_points_ppr
      FROM Player_Stats_Game_2024
      WHERE player_id = ?
      ORDER BY season DESC, week ASC`,
      [playerId]
    );

    await connection.end();

    const player = playerRows[0] || null;

    return (
      <PlayerProfileShell
        player={player}
        careerStats={careerStats}
        gameLogs={gameLogs}
      />
    );
  } catch (error) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Error</h1>
        <p>{error.message}</p>
      </main>
    );
  }
}
