// app/player/[id]/page.js
import mysql from 'mysql2/promise';
import dynamic from 'next/dynamic';
import SeasonSelector from './SeasonSelector';

// Dynamic client-side component
const ReceivingMetricsTable = dynamic(() => import('@/components/player/ReceivingMetricsTable'), { ssr: false });

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
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>{player?.player_name || 'Player Not Found'}</h1>
        <p>{player?.position} | {player?.team}</p>
        <p>College: {player?.college}</p>
        <p>Drafted: {player?.draft_club} #{player?.draft_number} ({player?.rookie_year})</p>

        <h2 style={{ marginTop: '2rem' }}>Career Stats</h2>
        {careerStats.length > 0 ? (
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Season</th>
                <th>Pass Yards</th>
                <th>Rush Yards</th>
                <th>Recv Yards</th>
                <th>PPR Points</th>
              </tr>
            </thead>
            <tbody>
              {careerStats.map((row) => (
                <tr key={row.season}>
                  <td>{row.season}</td>
                  <td>{row.passing_yards}</td>
                  <td>{row.rushing_yards}</td>
                  <td>{row.receiving_yards}</td>
                  <td>{parseFloat(row.fantasy_points_ppr).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No career stats available.</p>
        )}

        {/* ✅ Receiving Metrics Section */}
        <ReceivingMetricsTable playerId={playerId} />

        {/* ✅ Weekly Game Logs Section */}
        <SeasonSelector gameLogs={gameLogs} />
      </main>
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
