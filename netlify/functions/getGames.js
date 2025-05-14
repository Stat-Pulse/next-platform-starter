const mysql = require('mysql2/promise');

exports.handler = async function (event, context) {
  // Set your MySQL credentials
  const connection = await mysql.createConnection({
    host: 'stat-pulse-analytics-db.ci1uue2w2sxp.us-east-1.rds.amazonaws.com',
    user: 'StatadminPULS3',
    password: 'wyjGiz-justo6-gesmyh',
    database: 'nfl_analytics',
  });

  try {
    const [rows] = await connection.execute(`
      SELECT game_id, week, game_date, home_team_id, away_team_id, home_score, away_score, stadium_name
      FROM Games
      WHERE season_id = 19
      ORDER BY week ASC
    `);

    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (err) {
    console.error('MySQL query error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch games.' }),
    };
  }
};
