// pages/api/player/[id].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const playerId = req.query.id;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [playerRows] = await connection.execute(
      `
      SELECT
        full_name AS player_name,
        position,
        team AS team_abbr,
        jersey_number,
        status,
        college,
        draft_club,
        draft_number,
        rookie_year,
        years_exp,
        headshot_url,
        height,
        weight
      FROM Rosters_2024
      WHERE gsis_id = ?
      LIMIT 1
      `,
      [playerId]
    );

    if (playerRows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const player = playerRows[0];

    const [gameLogs] = await connection.execute(
      `
      SELECT
        week,
        opponent_team_abbr,
        receptions,
        receiving_yards,
        receiving_tds,
        rushing_tds,
        passing_tds
      FROM Player_Stats_Game_2024
      WHERE player_id = ?
      ORDER BY week ASC
      `,
      [playerId]
    );

    const career = gameLogs.length > 0
      ? {
          games: gameLogs.length,
          receptions: gameLogs.reduce((acc, g) => acc + (g.receptions || 0), 0),
          yards: gameLogs.reduce((acc, g) => acc + (g.receiving_yards || 0), 0),
          tds: gameLogs.reduce((acc, g) => acc + (g.receiving_tds || 0), 0),
        }
      : null;

    await connection.end();

    return res.status(200).json({
      player: { ...player, career },
      gameLogs,
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}