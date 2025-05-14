const mysql = require('mysql2/promise');

exports.handler = async function () {
  try {
    const connection = await mysql.createConnection({
      host: 'stat-pulse-analytics-db.ci1uue2w2sxp.us-east-1.rds.amazonaws.com',
      user: 'StatadminPULS3',
      password: 'wyjGiz-justo6-gesmyh',
      database: 'nfl_analytics',
    });

    const [rows] = await connection.execute(`
      SELECT game_id, player_id, passing_yards, rushing_yards, receiving_yards
      FROM Player_Stats_Game
      LIMIT 5
    `);

    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
