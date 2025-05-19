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

    await connection.ping(); // 🔍 Simple connectivity test
    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: '✅ Connected successfully to the DB' }),
    };

  } catch (error) {
    console.error('❌ Connection error:', error);

    if (connection) await connection.end();

    return {
      statusCode: 500,
      body: JSON.stringify({ error: '❌ DB connection failed', details: error.message }),
    };
  }
};