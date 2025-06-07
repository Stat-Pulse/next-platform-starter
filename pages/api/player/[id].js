// pages/api/player/[id].js

import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const playerId = req.query.id;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Fetch basic player info
    const [playerRows] = await connection.execute(
      `SELECT * FROM Active_Player_Profiles WHERE player_id = ? LIMIT 1`,
      [playerId]
    );

    if (playerRows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const player = playerRows[0];

    // Fetch season stats
    const [seasonStats] = await connection.execute(
      `SELECT * FROM Player_Season_Stats WHERE player_id = ? ORDER BY season DESC`,
      [playerId]
    );

    // Fetch receiving metrics
    const [receivingMetrics] = await connection.execute(
      `SELECT * FROM NextGen_Stats_Receiving WHERE player_id = ? ORDER BY season DESC`,
      [playerId]
    );

    res.status(200).json({
      player,
      seasonStats,
      receivingMetrics,
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}