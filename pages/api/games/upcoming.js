import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(`
      SELECT game_id AS id, home_team, away_team, scheduled_time
      FROM Schedule_2025
      WHERE scheduled_time > NOW()
      ORDER BY scheduled_time ASC
      LIMIT 9
    `);

    const games = rows.map((game) => ({
      ...game,
      date_time: new Date(game.scheduled_time).toLocaleString('en-US', {
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      status: 'upcoming',
    }));

    res.status(200).json(games);
  } catch (error) {
    console.error('API error fetching upcoming games:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
