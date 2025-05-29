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
        NGS.season,
        SUM(NGS.targets) AS TGTS,
        SUM(NGS.receptions) AS REC,
        SUM(NGS.rec_touchdowns) AS TD,
        AVG(NGS.avg_cushion) AS avg_cushion,
        AVG(NGS.avg_separation) AS avg_separation,
        AVG(NGS.avg_intended_air_yards) AS avg_intended_air_yards,
        SUM(NGS.yards) AS receiving_yards,
        AVG(NGS.percent_share_of_intended_air_yards) AS percent_share_air_yards,
        SUM(NGS.avg_expected_yac) AS xYAC,
        SUM(NGS.avg_yac) AS YAC,
        SUM(NGS.avg_yac_above_expectation) AS plus_yac
      FROM Player_Stats_Game_2024 PSG
      LEFT JOIN NextGen_Stats_Receiving NGS
        ON NGS.player_id AND NGS.season AND NGS.week
      WHERE NGS.player_id = ?
      GROUP BY NGS.season
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
