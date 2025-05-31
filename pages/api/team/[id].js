import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const teamId = req.query.id.toUpperCase(); // ✅ Declare once here
  console.log('Requested teamId:', teamId);  // ✅ Log for debugging

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Fetch team metadata using team_abbr
    const [teamRows] = await connection.execute(
      `SELECT * FROM Teams WHERE team_abbr = ?`,
      [teamId]
    );

    console.log('Query result:', teamRows);  // ✅ Log the SQL result

    if (teamRows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const team = teamRows[0];

    // Dummy placeholders
    const seasonStats = { wins: 12, losses: 5, points_scored: 380, points_allowed: 320 };
    const lastGame = null;
    const upcomingGame = null;
    const news = [];
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
