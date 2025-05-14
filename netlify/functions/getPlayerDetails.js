const mysql = require('mysql2/promise')

exports.handler = async function (event) {
  const playerId = event.queryStringParameters?.player_id
  if (!playerId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing player_id' }),
    }
  }

  const connection = await mysql.createConnection({
    host: 'stat-pulse-analytics-db.ci1uue2w2sxp.us-east-1.rds.amazonaws.com',
    user: 'StatadminPULS3',
    password: 'wyjGiz-justo6-gesmyh',
    database: 'nfl_analytics',
  })

  try {
    const [rows] = await connection.execute(
      `SELECT * FROM Players WHERE player_id = ?`,
      [playerId]
    )

    await connection.end()

    if (rows.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Player not found' }) }
    }

    return { statusCode: 200, body: JSON.stringify(rows[0]) }
  } catch (err) {
    console.error('Error fetching player:', err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) }
  }
}
