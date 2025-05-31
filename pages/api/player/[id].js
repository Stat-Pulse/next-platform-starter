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

    // Step 1: Use the Active_Player_Profiles view
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

    // Step 2: Receiving metrics from NextGen_Stats_Receiving
    const [receivingMetrics] = await connection.execute(`
      SELECT
        season,
        season_type,
        week,
        team_abbr,
        targets,
        receptions,
        yards,
        rec_touchdowns,
        catch_percentage,
        avg_yac,
        avg_cushion,
        avg_separation,
        avg_intended_air_yards,
        percent_share_of_intended_air_yards,
        avg_expected_yac,
        avg_yac_above_expectation
      FROM NextGen_Stats_Receiving
      WHERE player_gsis_id = ?
      ORDER BY season, week
    `, [playerId]);

    // Step 3: Aggregate basic career totals
    const career = receivingMetrics.length > 0 ? {
      games: receivingMetrics.length,
      targets: receivingMetrics.reduce((sum, g) => sum + (g.targets || 0), 0),
      receptions: receivingMetrics.reduce((sum, g) => sum + (g.receptions || 0), 0),
      yards: receivingMetrics.reduce((sum, g) => sum + (g.yards || 0), 0),
      tds: receivingMetrics.reduce((sum, g) => sum + (g.rec_touchdowns || 0), 0),
    } : null;

    await connection.end();

    return res.status(200).json({
      player: { ...player, career },
      receivingMetrics
    });
  } catch (err) {
    console.error('🔥 API error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
