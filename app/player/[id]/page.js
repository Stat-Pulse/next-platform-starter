// app/player/[id]/page.js
import mysql from 'mysql2/promise';

export async function getServerSideProps({ params }) {
  const playerId = params.id;
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [playerRows] = await connection.execute(`
      SELECT 
        R.gsis_id AS player_id,
        R.full_name AS player_name
      FROM Rosters_2024 R
      WHERE R.gsis_id = ?
      LIMIT 1
    `, [playerId]);

    const [careerStats] = await connection.execute(`
      SELECT
        season_override AS season,
        SUM(passing_yards) AS passing_yards
      FROM Player_Stats_Game_All
      WHERE player_id = ?
      GROUP BY season_override
      ORDER BY season_override DESC
    `, [playerId]);

    await connection.end();

    return {
      props: {
        debug: {
          player: playerRows[0],
          careerStats,
        }
      }
    };
  } catch (error) {
    return {
      props: {
        debug: {
          error: error.message,
        }
      }
    };
  }
}

export default function Page({ debug }) {
  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ fontWeight: 'bold', color: 'darkred' }}>🧪 DEBUG</h1>
      <pre style={{ background: '#eee', padding: '1rem' }}>
        {JSON.stringify(debug, null, 2)}
      </pre>
    </main>
  );
}
