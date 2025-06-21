// pages/api/predict.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { team, gameId } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Example: Store user prediction
    await connection.execute(
      `INSERT INTO Predictions (game_id, predicted_team, user_id) VALUES (?, ?, ?)`,
      [gameId, team, 'anonymous'] // Replace with real user ID
    );

    // Calculate win probability (placeholder)
    const [stats] = await connection.execute(`
      SELECT AVG(s.points_scored) as avg_points
      FROM Stats s
      WHERE s.team = ? AND s.season = '2025'
    `, [team]);
    const winProbability = stats[0].avg_points > 20 ? 0.6 : 0.4; // Simplified

    await connection.end();
    res.status(200).json({ message: 'Prediction saved', winProbability });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}