import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    console.log('Missing player ID in request');
    return res.status(400).json({ error: 'Missing player ID' });
  }

  try {
    console.log('Connecting to MySQL database for player_id:', id);
    const connectionConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'nfl_analytics',
      connectTimeout: 15000,
    };

    // Only add SSL if DB_SSL_CA is provided
    if (process.env.DB_SSL_CA) {
      console.log('Using SSL for database connection');
      connectionConfig.ssl = {
        ca: process.env.DB_SSL_CA,
        rejectUnauthorized: true,
      };
    } else {
      console.log('No SSL certificate provided, connecting without SSL');
    }

    const connection = await mysql.createConnection(connectionConfig);

    console.log('Executing query for player_id:', id);
    const [rows] = await connection.execute(
      `
      SELECT 
        PSG.season,
        SUM(PSG.targets) AS TGTS,
        SUM(PSG.receptions) AS REC,
        SUM(PSG.receiving_yards) AS YDS,
        SUM(PSG.receiving_tds) AS TD,
        SUM(PSG.receiving_fumbles) AS FUM,
        SUM(PSG.receiving_first_downs) AS FD,
        AVG(NGS.avg_cushion) AS avg_cushion,
        AVG(NGS.avg_separation) AS avg_separation,
        AVG(NGS.avg_intended_air_yards) AS avg_intended_air_yards,
        SUM(NGS.yards) AS receiving_air_yards,
        AVG(NGS.percent_share_of_intended_air_yards) AS percent_share_air_yards,
        SUM(NGS.avg_expected_yac) AS xYAC,
        SUM(NGS.avg_yac) AS YAC,
        SUM(NGS.avg_yac_above_expectation) AS plus_yac,
        AVG(NGS.target_share) AS target_share,
        AVG(NGS.wopr) AS WOPR
      FROM Player_Stats_Game_2024 PSG
      LEFT JOIN NextGen_Stats_Receiving_2024 NGS
        ON PSG.player_id = NGS.player_gsis_id AND PSG.season = NGS.season AND PSG.week = NGS.week
      WHERE PSG.player_id = ?
      GROUP BY PSG.season
      `,
      [id]
    );

    console.log('Query completed. Rows returned:', rows.length);
    await connection.end();

    if (!rows.length) {
      console.log('No stats found for player_id:', id);
      return res.status(200).json({ data: [], message: 'No receiving stats found for this player' });
    }

    return res.status(200).json({ data: rows });
  } catch (error) {
    console.error('🔥 API Error:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      stack: error.stack,
    });
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message || 'Unknown error',
      code: error.code || 'N/A',
    });
  }
}
