import mysql from 'mysql2/promise';
import fs from 'fs/promises';

export default async function PlayerPage({ params }) {
  const logMessage = (message, data) => {
    console.error(`PlayerPage: ${message}`, data);
    try {
      fs.appendFile('/tmp/player.log', `${new Date().toISOString()} ${message} ${JSON.stringify(data)}\n`);
    } catch (e) {
      console.error('PlayerPage: File log error', { message: e.message });
    }
  };

  try {
    logMessage('Starting execution', { playerId: params?.id });
    const playerId = params?.id;
    if (!playerId) {
      logMessage('Missing playerId', {});
      return <div>Missing player ID</div>;
    }

    let connection;
    let debug = {};

    logMessage('Environment variables', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD ? '[REDACTED]' : 'MISSING',
    });

    logMessage('Connecting to DB...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    logMessage('DB connected');

    const [playerRows] = await connection.execute(
      `SELECT R.gsis_id AS player_id, R.full_name AS player_name
       FROM Rosters_2024 R
       WHERE R.gsis_id = ?
       LIMIT 1`,
      [playerId]
    );
    logMessage('Player query executed', { rows: playerRows.length });

    const [careerStats] = await connection.execute(
      `SELECT season_override AS season, SUM(passing_yards) AS passing_yards
       FROM Player_Stats_Game_All
       WHERE player_id = ?
       GROUP BY season_override
       ORDER BY season_override DESC`,
      [playerId]
    );
    logMessage('Career stats query executed', { rows: careerStats.length });

    debug = {
      player: playerRows[0] || null,
      careerStats,
    };

    logMessage('Rendering', debug);
    return (
      <main style={{ padding: '2rem' }}>
        <h1 style={{ fontWeight: 'bold', color: 'darkred' }}>🧪 DEBUG</h1>
        <pre style={{ background: '#eee', padding: '1rem' }}>
          {JSON.stringify(debug, null, 2)}
        </pre>
      </main>
    );
  } catch (error) {
    logMessage('Error', { message: error.message, stack: error.stack });
    return (
      <main style={{ padding: '2rem' }}>
        <h1 style={{ fontWeight: 'bold', color: 'red' }}>Error</h1>
        <pre style={{ background: '#eee', padding: '1rem' }}>
          {JSON.stringify({ error: error.message, stack: error.stack }, null, 2)}
        </pre>
      </main>
    );
  } finally {
    if (connection) {
      try {
        await connection.end();
        logMessage('DB connection closed');
      } catch (endError) {
        logMessage('Connection close error', { message: endError.message, stack: endError.stack });
      }
    }
  }
}
