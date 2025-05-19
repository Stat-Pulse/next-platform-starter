import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing player ID' });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 5000,
    });

    const [rows] = await connection.execute(
      `
      SELECT
        PSG.season,
        PSG.season_type,
        SUM(PSG.targets) AS targets,
        SUM(PSG.receptions) AS receptions,
        SUM(PSG.receiving_yards) AS receiving_yards,
        SUM(PSG.receiving_tds) AS receiving_tds,
        SUM(PSG.receiving_fumbles) AS receiving_fumbles,
        SUM(PSG.receiving_first_downs) AS receiving_first_downs,
        SUM(PSG.receiving_air_yards) AS receiving_air_yards,
        SUM(PSG.receiving_yards_after_catch) AS receiving_yac,
        SUM(PSG.receiving_epa) AS receiving_epa,
        SUM(PSG.wopr) AS wopr,

        AVG(NGSR.avg_cushion) AS avg_cushion,
        AVG(NGSR.avg_separation) AS avg_separation,
        AVG(NGSR.avg_intended_air_yards) AS avg_intended_air_yards,
        AVG(NGSR.percent_share_of_intended_air_yards) AS air_yards_share,
        AVG(NGSR.avg_expected_yac) AS avg_expected_yac,
        AVG(NGSR.avg_yac_above_expectation) AS avg_yac_above_expectation,
        AVG(NGSR.target_share) AS target_share

      FROM Player_Stats_Game_2024 PSG
      LEFT JOIN NextGen_Stats_Receiving_2024 NGSR
        ON PSG.player_id = NGSR.player_gsis_id
        AND PSG.season = NGSR.season

      WHERE PSG.player_id = ?
      GROUP BY PSG.season, PSG.season_type
      ORDER BY PSG.season DESC, PSG.season_type DESC
      `,
      [id]
    );

    await connection.end();
    return res.status(200).json({ data: rows });
  } catch (error) {
    console.error('🔥 Error in receiving API:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
