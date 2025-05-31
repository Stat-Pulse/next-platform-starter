import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const teamId = req.query.id.toUpperCase(); // Normalize to uppercase

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Fetch team metadata
    const [teamRows] = await connection.execute(
      `SELECT * FROM Teams WHERE team_abbr = ?`,
      [teamId]
    );

    if (teamRows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const team = teamRows[0];

    // Dummy placeholders for stats (replace with real queries later)
    const seasonStats = { wins: 12, losses: 5, points_scored: 380, points_allowed: 320 };
    const lastGame = null;        // You can populate later
    const upcomingGame = null;    // You can populate later
    const news = [];              // You can pull from news APIs
    const topPlayers = {
      topPasser: { name: 'Example QB', yards: 4200 },
      topRusher: { name: 'Example RB', yards: 1200 },
      topReceiver: { name: 'Example WR', yards: 1350 },
    };

    res.status(200).json({
      team,
      seasonStats,
      lastGame,
      upcomingGame,
      news,
      topPlayers,
    });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
