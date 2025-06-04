// pages/api/team-stats/rush-defense.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [rows] = await connection.execute(`
      SELECT * FROM Team_Rush_Def_2024
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to fetch rush defense stats' });
  }
}