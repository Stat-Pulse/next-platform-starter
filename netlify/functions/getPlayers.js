const mysql = require('mysql2/promise');

exports.handler = async function () {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: 'stat-pulse-analytics-db.ci1uue2w2sxp.us-east-1.rds.amazonaws.com',
      user: 'StatadminPULS3',
      password: 'wyjGiz-justo6-gesmyh',
      database: 'stat_pulse_analytics_db',
    });

    const [rows] = await connection.execute(`
      SELECT player_id, player_name, position
      FROM Players
      ORDER BY player_name
      LIMIT 10
    `);

    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };

  } catch (error) {
    console.error('Query error:', error);

    if (connection) await connection.end();

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Query failed', details: error.message }),
    };
  }
};