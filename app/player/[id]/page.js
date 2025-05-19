import mysql from 'mysql2/promise';

export default async function PlayerPage({ params }) {
  const playerId = params.id;
  let connection;
  let debug = {};

  try {
    console.log('Connecting to DB...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log('DB connected.');

    const [playerRows] = await connection.execute(
      `SELECT R.gsis_id AS player_id, R.full_name AS player_name
       FROM Rosters_2024 R
       WHERE R.gsis_id = ?
       LIMIT 1`,
      [playerId]
    );

    const [careerStats] = await connection.execute(
      `SELECT season_override AS season, SUM(passing_yards) AS passing_yards
       FROM Player_Stats_Game_All
       WHERE player_id = ?
       GROUP BY season_override
       ORDER BY season_override DESC`,
      [playerId]
    );

    debug = {
      player: playerRows[0] || null,
      careerStats,
    };
  } catch (error) {
    console.error('Error in PlayerPage:', error.message);
    debug = { error: error.message };
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('DB connection closed.');
      } catch (endError) {
        console.error('Error closing connection:', endError.message);
      }
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ fontWeight: 'bold', color: 'darkred' }}>🧪 DEBUG</h1>
      <pre style={{ background: '#eee', padding: '1rem' }}>
        {JSON.stringify(debug, null, 2)}
      </pre>
    </main>
  );
}
