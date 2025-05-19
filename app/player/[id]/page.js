import mysql from 'mysql2/promise';

export default async function PlayerPage({ params }) {
  console.log('PlayerPage: Starting execution at', new Date().toISOString(), { playerId: params?.id });
  const playerId = params?.id;
  if (!playerId) {
    console.error('PlayerPage: Missing playerId');
    return <div>Missing player ID</div>;
  }

  let connection;
  let debug = {};

  try {
    console.log('PlayerPage: Environment variables', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD ? '[REDACTED]' : 'MISSING',
    });

    console.log('PlayerPage: Connecting to DB...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log('PlayerPage: DB connected');

    const [playerRows] = await connection.execute(
      `SELECT R.gsis_id AS player_id, R.full_name AS player_name
       FROM Rosters_2024 R
       WHERE R.gsis_id = ?
       LIMIT 1`,
      [playerId]
    );
    console.log('PlayerPage: Player query executed', { rows: playerRows.length });

    const [careerStats] = await connection.execute(
      `SELECT season_override AS season, SUM(passing_yards) AS passing_yards
       FROM Player_Stats_Game_All
       WHERE player_id = ?
       GROUP BY season_override
       ORDER BY season_override DESC`,
      [playerId]
    );
    console.log('PlayerPage: Career stats query executed', { rows: careerStats.length });

    debug = {
      player: playerRows[0] || null,
      careerStats,
    };
  } catch (error) {
    console.error('PlayerPage: Error', {
      message: error.message,
      stack: error.stack,
    });
    debug = { error: error.message, stack: error.stack };
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('PlayerPage: DB connection closed');
      } catch (endError) {
        console.error('PlayerPage: Connection close error', {
          message: endError.message,
          stack: endError.stack,
        });
      }
    }
  }

  console.log('PlayerPage: Rendering', debug);
  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ fontWeight: 'bold', color: 'darkred' }}>🧪 DEBUG</h1>
      <pre style={{ background: '#eee', padding: '1rem' }}>
        {JSON.stringify(debug, null, 2)}
      </pre>
    </main>
  );
}
