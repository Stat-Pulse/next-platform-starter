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
    const [rows] = await connection.execute(`
      SELECT week, recent_team AS team, opponent_team AS opponent,
        fantasy_points_ppr, receptions, receiving_yards AS yards, receiving_tds AS tds
      FROM Player_Stats_Game
      WHERE player_id = ?
      ORDER BY week DESC
      LIMIT 10
    `, [playerId])

    await connection.end()
    return { statusCode: 200, body: JSON.stringify(rows) }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch game logs' }) }
  }
}
