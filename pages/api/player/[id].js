const seasonStatsQuery = `
  SELECT season, 
         SUM(receiving_yards) AS receiving_yards,
         SUM(receiving_tds) AS receiving_tds,
         SUM(rushing_yards) AS rushing_yards,
         SUM(rushing_tds) AS rushing_tds,
         SUM(passing_yards) AS passing_yards,
         SUM(passing_tds) AS passing_tds,
         SUM(passing_interceptions) AS interceptions
  FROM (
    ${[...Array(15).keys()].map(i => {
      const year = 2010 + i;
      return `SELECT season, receiving_yards, receiving_tds, rushing_yards, rushing_tds, passing_yards, passing_tds, passing_interceptions
              FROM Player_Stats_${year}
              WHERE player_id = ?`;
    }).join('\nUNION ALL\n')}
  ) AS combined
  GROUP BY season
  ORDER BY season ASC
`;

import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const playerId = req.query.id;

    // Fetch player metadata from Active_Player_Profiles
    const [playerRows] = await connection.execute(
      `
      SELECT *
      FROM Active_Player_Profiles
      WHERE player_id = ?
      `,
      [playerId]
    );

    if (!playerRows || playerRows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const player = playerRows[0];

    const seasonStatsQuery = `
      SELECT season, 
             SUM(receiving_yards) AS receiving_yards,
             SUM(receiving_tds) AS receiving_tds,
             SUM(rushing_yards) AS rushing_yards,
             SUM(rushing_tds) AS rushing_tds,
             SUM(passing_yards) AS passing_yards,
             SUM(passing_tds) AS passing_tds,
             SUM(passing_interceptions) AS interceptions
      FROM (
        ${[...Array(15).keys()].map(i => {
          const year = 2010 + i;
          return `SELECT season, receiving_yards, receiving_tds, rushing_yards, rushing_tds, passing_yards, passing_tds, passing_interceptions
                  FROM Player_Stats_${year}
                  WHERE player_id = ?`;
        }).join('\nUNION ALL\n')}
      ) AS combined
      GROUP BY season
      ORDER BY season ASC
    `;

    const [seasonStats] = await connection.query(seasonStatsQuery, Array(15).fill(playerId));

    res.status(200).json({ player, seasonStats });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}