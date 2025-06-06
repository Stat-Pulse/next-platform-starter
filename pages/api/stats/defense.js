// pages/api/stats/defense.js
import mysql from 'mysql2/promise'

export default async function handler(req, res) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    const [rows] = await connection.execute('SELECT * FROM Defensive_Stats_2024')
    res.status(200).json(rows)
  } catch (error) {
    console.error('Error fetching defensive stats:', error)
    res.status(500).json({ error: 'Failed to fetch defensive stats' })
  }
}