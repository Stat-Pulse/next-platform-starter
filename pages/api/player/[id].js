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

    // Step 1: Basic player metadata
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

    // Step 2: Game logs (joined with Games table to get opponent)
    const [gameLogs] = await connection.execute(`
  SELECT 
    G.week,
        CASE
          WHEN PSG.team_id = G.home_team_id THEN G.away_team_id
          ELSE G.home_team_id
        END AS opponent_team_abbr,
        PSG.receptions,
        PSG.receiving_yards,
        PSG.receiving_tds,
        PSG.rushing_tds,
        PSG.passing_tds
      FROM Player_Stats_Game_2024 PSG
      JOIN Games G ON PSG.game_id = G.game_id
      WHERE PSG.gsis_id = ?
      ORDER BY G.week ASC
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
