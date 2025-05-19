// File: netlify/functions/getPlayers.js

const mysql = require('mysql2/promise');

exports.handler = async function () {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: 'stat-pulse-analytics-db.ci1uue2w2sxp.us-east-1.rds.amazonaws.com',
      user: 'StatadminPULS3',
      password: 'wyjGiz-justo6-gesmyh',
      database: 'stat_pulse_analytics_db', // ✅ Corrected DB name
    });

    const [rows] = await connection.execute(`
      SELECT 
        P.player_id,
        P.player_name,
        P.position,
        R.team_id,
        R.jersey_number,
        R.status,
        R.headshot_url
      FROM Players P
      LEFT JOIN Rosters_2024 R ON P.player_id = R.player_id
      ORDER BY P.player_name
    `);

    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };

  } catch (error) {
    console.error('Database query error:', error);

    if (connection) await connection.end();

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch players' }),
    };
  }
};