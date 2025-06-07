import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  console.log("API HIT:", req.query.id);

  try {
    console.log("Connecting to DB...");
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000  // 10 second timeout
    });

    console.log("Running player query...");
    const [player] = await connection.execute(
      'SELECT * FROM Players WHERE player_id = ?',
      [req.query.id]
    );

    console.log("Query complete. Sending response...");
    res.status(200).json({ player: player[0] });

  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}