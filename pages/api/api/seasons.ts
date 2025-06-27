import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Fetch distinct seasons from your games table
    const [rows] = await conn.execute(`SELECT DISTINCT season FROM nfl_game_results ORDER BY season DESC`);

    // Extract just the season values (e.g., [2024, 2023, 2022])
    const seasons = rows.map(row => row.season);

    res.status(200).json(seasons);
  } catch (error) {
    console.error('Error fetching seasons:', error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) await conn.end();
  }
}