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
      SELECT 
        P.player_id,
        P.player_name,
        P.position,
        R.team,
        R.jersey_number,
        R.status,
        R.headshot_url,
        R.years_exp,
        R.college,
        R.draft_club,
        R.draft_number,
        R.rookie_year
      FROM Players P
      LEFT JOIN Rosters_2024 R
        ON P.player_id = R.gsis_id
      ORDER BY P.player_name
      LIMIT 100
    `);

    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };

  } catch (error) {
    console.error('LEFT JOIN error:', error);

    if (connection) await connection.end();

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'LEFT JOIN failed', details: error.message }),
    };
  }
};
