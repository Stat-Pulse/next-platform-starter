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
      SELECT 
        P.player_id,
        P.player_name,
        P.position,
        TIMESTAMPDIFF(YEAR, P.birth_date, CURDATE()) AS age,
        PSG.team_id AS team
      FROM Players P
      LEFT JOIN Player_Stats_Game PSG
        ON P.player_id = PSG.player_id
      WHERE PSG.game_id = (
        SELECT MAX(game_id)
        FROM Player_Stats_Game psg2
        WHERE psg2.player_id = P.player_id
      )
      ORDER BY P.player_name
    `);

    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (error) {
    console.error('❌ DATABASE ERROR:', error);
    if (connection) await connection.end();

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch player data.', details: error.message }),
    };
  }
};
