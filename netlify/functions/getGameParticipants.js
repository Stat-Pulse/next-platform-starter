const mysql = require('mysql2/promise');

exports.handler = async function (event) {
  const gameId = event.queryStringParameters?.game_id;
  if (!gameId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing game_id' }),
    };
  }

  const connection = await mysql.createConnection({
    host: 'stat-pulse-analytics-db.ci1uue2w2sxp.us-east-1.rds.amazonaws.com',
    user: 'StatadminPULS3',
    password: 'wyjGiz-justo6-gesmyh',
    database: 'nfl_analytics',
  });

  try {
    const [rows] = await connection.execute(`
      SELECT 
        PSG.player_id, P.player_name, P.position, P.team_id,
        PSG.fantasy_points_ppr, PSG.receptions, PSG.receiving_yards, PSG.receiving_tds
      FROM Player_Stats_Game PSG
      JOIN Players P ON PSG.player_id = P.player_id
      WHERE PSG.game_id = ?
      ORDER BY P.team_id, P.position
    `, [gameId]);

    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (err) {
    console.error('DB Error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Database error' }),
    };
  }
};
