import mysql from 'mysql2/promise';

export default async function PlayerPage({ params }) {
  const playerId = params?.id;
  if (!playerId) {
    return <div>Missing player ID</div>;
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 5000,
    });

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

    const player = playerRows[0] || null;
    return (
      <main style={{ padding: '2rem' }}>
        <h1>{player?.player_name || 'Player Not Found'}</h1>
        <h2>Career Stats</h2>
        <ul>
          {careerStats.map((stat) => (
            <li key={stat.season}>
              {stat.season}: {stat.passing_yards} passing yards
            </li>
          ))}
        </ul>
      </main>
    );
  } catch (error) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Error</h1>
        <p>{error.message}</p>
      </main>
    );
  } finally {
    if (connection) await connection.end();
  }
}
