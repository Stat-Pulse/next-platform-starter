const mysql = require('mysql2/promise');

exports.handler = async function (event) {
  const season = event.queryStringParameters?.season || '2024'
  const player = event.queryStringParameters?.player

  const connection = await mysql.createConnection({
    host: 'stat-pulse-analytics-db.ci1uue2w2sxp.us-east-1.rds.amazonaws.com',
    user: 'StatadminPULS3',
    password: 'wyjGiz-justo6-gesmyh',
    database: 'nfl_analytics',
  });

  try {
    let query = `
     SELECT 
       G.game_id, G.week,
       DATE_FORMAT(G.game_date, '%Y-%m-%d') AS game_date,
       TIME_FORMAT(G.game_time, '%H:%i:%s') AS game_time,
        G.home_score, G.away_score,
        G.stadium_name, 
        H.team_abbr AS home_team_name,
        A.team_abbr AS away_team_name
      FROM Games G
      JOIN Teams H ON G.home_team_id = H.team_id
      JOIN Teams A ON G.away_team_id = A.team_id
    `
    let conditions = [`G.season_id = 19`]
    let params = []

    if (player) {
      query += `
        JOIN Player_Stats_Game PSG ON G.game_id = PSG.game_id
        WHERE PSG.player_id = ?
        AND ` + conditions.join(" AND ")
      params.push(player)
    } else {
      query += ` WHERE ` + conditions.join(" AND ")
    }

    query += ` ORDER BY G.week ASC, G.game_date ASC`

    const [rows] = await connection.execute(query, params)
    await connection.end()

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    }

  } catch (err) {
    console.error('DB error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch games.' }),
    }
  }
};
