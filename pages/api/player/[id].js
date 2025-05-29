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

    // Step 1: Use the view instead of multiple joins
    const [playerRows] = await connection.execute(`
      SELECT *
      FROM Active_Player_Profiles
      WHERE player_id = ?
      LIMIT 1
    `, [playerId]);

    if (playerRows.length === 0) {
      console.log('❌ No player found with ID:', playerId);
      return res.status(404).json({ error: 'Player not found' });
    }

    const player = playerRows[0];
    console.log('✅ Player found in view:', player.player_name);

    // Step 2: Pull game logs
    const [gameLogs] = await connection.execute(`
      SELECT 
        G.week,
        G.season_id AS season,
        G.home_team_id,
        G.away_team_id,
        PSG.receptions,
        PSG.receiving_yards,
        PSG.receiving_tds,
        PSG.rushing_tds,
        PSG.passing_tds
      FROM Player_Stats_Game_All PSG
      JOIN Games G ON PSG.game_id = G.game_id
      WHERE PSG.player_id = ?
      ORDER BY G.season_id, G.week
    `, [playerId]);

    // Step 3: Aggregate basic career stats
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
    console.error('🔥 API error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
