import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [playerRows] = await connection.execute(
      `SELECT * FROM Rosters_2024 WHERE gsis_id = ? LIMIT 1`,
      [id]
    );

    if (playerRows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const player = playerRows[0];

    const [receivingMetrics] = await connection.execute(
      `SELECT season, season_type, SUM(targets) AS targets, SUM(receptions) AS receptions,
              SUM(receiving_yards) AS receiving_yards, SUM(receiving_tds) AS receiving_tds
       FROM Player_Stats_Game_All
       WHERE player_id = ?
       AND receiving_yards IS NOT NULL
       GROUP BY season, season_type
       ORDER BY season DESC`,
      [id]
    );

    const [advancedMetrics] = await connection.execute(
      `SELECT season, season_type,
              ROUND(AVG(avg_cushion), 2) AS avg_cushion,
              ROUND(AVG(avg_separation), 2) AS avg_separation,
              ROUND(AVG(avg_expected_yac), 2) AS avg_expected_yac,
              ROUND(AVG(receiving_yards_after_catch), 2) AS yac,
              ROUND(AVG(avg_yac_above_expectation), 2) AS yac_above_exp,
              ROUND(AVG(receiving_epa), 3) AS receiving_epa
       FROM NextGen_Stats_Receiving
       WHERE player_id = ?
       GROUP BY season, season_type
       ORDER BY season DESC`,
      [id]
    );

    const [advancedRushing] = await connection.execute(
      `SELECT season, season_type,
              ROUND(AVG(rush_pct_over_expected), 2) AS rush_pct_over_expected,
              ROUND(AVG(avg_time_behind_los), 2) AS avg_time_behind_los,
              ROUND(AVG(avg_rush_distance), 2) AS avg_rush_distance,
              ROUND(AVG(rushing_epa), 3) AS rushing_epa
       FROM NextGen_Stats_Rushing
       WHERE player_id = ?
       GROUP BY season, season_type
       ORDER BY season DESC`,
      [id]
    );

    res.status(200).json({ player, receivingMetrics, advancedMetrics, advancedRushing });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}