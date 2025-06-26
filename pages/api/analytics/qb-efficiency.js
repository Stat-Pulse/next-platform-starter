import mysql from 'mysql2/promise'

export default async function handler(req, res) {
  // ➡️ Accept season & seasonType in the querystring, fallback to 2024 / REG
  const season      = req.query.season      || '2024'
  const seasonType  = req.query.seasonType  || 'REG'   // REG | POST
  let   conn

  try {
    conn = await mysql.createConnection({
      host:     process.env.DB_HOST,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    /* ----------------------------------------------
       QB completion % by week
       ----------------------------------------------
       • position       = 'QB' (offense only)
       • season_type    = 'REG' or 'POST'
       • season         = numeric season column in your view
    ------------------------------------------------*/
    const [rows] = await conn.execute(
      `
      SELECT
        week,
        ROUND(
          SUM(completions) / NULLIF(SUM(attempts), 0) * 100,
          1
        ) AS efficiency
      FROM offense_weekly_stats
      WHERE
        position     = 'QB'
        AND season   = ?
        AND season_type = ?
      GROUP BY week
      ORDER BY week
      `,
      [season, seasonType]
    )

    res.status(200).json(rows)           // [{ week: 1, efficiency: 67.4 }, …]
  } catch (err) {
    console.error('qb-efficiency API error:', err)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    if (conn) await conn.end()
  }
}