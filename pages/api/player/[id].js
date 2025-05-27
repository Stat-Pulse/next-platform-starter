// pages/api/player/[id].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const playerId = req.query.id;
  console.log('🔍 API called for playerId:', playerId);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Step 1: Player metadata from Rosters_2024
    const [playerRows] = await connection.execute(`
      SELECT full_name AS player_name, position, team AS team_abbr, jersey_number, status, college,
             draft_club, draft_number, rookie_year, years_exp, headshot_url, height, weight
      FROM Rosters_2024
      WHERE gsis_id = ?
      LIMIT 1
    `, [playerId]);

    if (playerRows.length === 0) {
      console.log('❌ No player found with ID:', playerId);
      return res.status(404).json({ error: 'Player not found' });
    }

    const player = playerRows[0];
    console.log('✅ Player found:', player.player_name);

    // Step 2: Simplified Game Logs without JOIN
    const [gameLogs] = await connection.execute(`
      SELECT 
        week,
        receptions,
        receiving_yards,
        receiving_tds,
        rushing_tds,
        passing_tds
      FROM Player_Stats_Game_2024
      WHERE player_id = ?
      ORDER BY week ASC
    `, [playerId]);

    // Step 3: Career totals
    const career = gameLogs.length > 0 ? {
      games: gameLogs.length,
      receptions: gameLogs.reduce((acc, g) => acc + (g.receptions || 0), 0),
      yards: gameLogs.reduce((acc, g) => acc + (g.receiving_yards || 0), 0),
      tds: gameLogs.reduce((acc, g) => acc + (g.receiving_tds || 0), 0),
    } : null;

    await connection.end();

    return res.status(200).json({
      player: { ...player, career },
      gameLogs,
    });
  } catch (err) {
    console.error('🔥 API error message:', err.message);
    console.error('🔥 Stack:', err.stack);
    return res.status(500).json({ error: 'Internal server error' });
  }
}