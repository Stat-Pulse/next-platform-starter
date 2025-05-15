const mysql = require('mysql2/promise');

exports.handler = async function () {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: 'stat-pulse-analytics-db.ci1uue2w2sxp.us-east-1.rds.amazonaws.com',
      user: 'StatadminPULS3',
      password: 'wyjGiz-justo6-gesmyh',
      database: 'nfl_analytics',
    });

    const [rows] = await connection.execute(`
      SELECT DISTINCT
        P.player_id,
        P.player_name,
        P.position,
        P.team,
        P.age
      FROM Players P
      ORDER BY P.player_name
    `);

    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (error) {
    console.error('❌ DATABASE ERROR:', error); // This will appear in Netlify logs
    if (connection) await connection.end();

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch player data.', details: error.message }),
    };
  }
};
