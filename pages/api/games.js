// pages/api/games.ts (or games.js if you want plain JS)
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  // Optionally get the season from the query string
  const { season } = req.query;
  if (!season) {
    return res.status(400).json({ error: "Missing season parameter" });
  }

  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Fetch games for the given season
    const [rows] = await conn.execute(
      `SELECT * FROM nfl_game_results WHERE season = ?`,
      [season]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) await conn.end();
  }
}