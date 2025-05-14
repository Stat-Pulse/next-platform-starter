const mysql = require('mysql2/promise')

exports.handler = async function () {
  const connection = await mysql.createConnection({
    host: 'stat-pulse-analytics-db.ci1uue2w2sxp.us-east-1.rds.amazonaws.com',
    user: 'StatadminPULS3',
    password: 'wyjGiz-justo6-gesmyh',
    database: 'nfl_analytics',
  })

  try {
    const [rows] = await connection.execute(`
      SELECT DISTINCT P.player_id, P.player_name
      FROM Player_Stats_Game PSG
      JOIN Players P ON PSG.player_id = P.player_id
      ORDER BY P.player_name
    `)

    await connection.end()

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load players.' }),
    }
  }
}
