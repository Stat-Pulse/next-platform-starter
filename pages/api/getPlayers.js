// pages/api/getPlayers.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  let conn;

  try {
    conn = await mysql.createConnection({
      host:     process.env.DB_HOST,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await conn.execute(
      `SELECT player_id AS id, player_name
         FROM Active_Player_Profiles
        ORDER BY player_name
        LIMIT 100`
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: 'Failed to fetch players' });
  } finally {
    if (conn) await conn.end();
  }
}