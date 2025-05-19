// pages/player/[id].js

export async function getServerSideProps({ params }) {
  const mysql = require('mysql2/promise');
  const playerId = params.id;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [playerRows] = await connection.execute(`
      SELECT 
        R.gsis_id AS player_id,
        R.full_name AS player_name,
        R.position,
        R.team,
        R.jersey_number,
        R.status,
        R.headshot_url,
        R.years_exp,
        R.college,
        R.draft_club,
        R.draft_number,
        R.rookie_year
      FROM Rosters_2024 R
      WHERE R.gsis_id = ?
      LIMIT 1
    `, [playerId]);

    const [careerStats] = await connection.execute(`
      SELECT
        season_override AS season,
        SUM(passing_yards) AS passing_yards,
        SUM(rushing_yards) AS rushing_yards,
        SUM(receiving_yards) AS receiving_yards,
        SUM(passing_tds + rushing_tds + receiving_tds) AS total_tds,
        SUM(fantasy_points_ppr) AS fantasy_points_ppr
      FROM Player_Stats_Game_All
      WHERE player_id = ?
      GROUP BY season_override
      ORDER BY season_override DESC
    `, [playerId]);

    await connection.end();

    return {
      props: {
        debug: {
          player: playerRows[0] || null,
          careerStats,
        }
      }
    };
  } catch (error) {
    return {
      props: {
        debug: {
          error: error.message
        }
      }
    };
  }
}

export default function Debug({ debug }) {
  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1 style={{ color: 'red', fontSize: '1.5rem' }}>🧪 DEBUG MODE</h1>
      <pre style={{ background: '#f5f5f5', padding: '1rem', border: '1px solid #ddd', overflowX: 'auto' }}>
        {JSON.stringify(debug, null, 2)}
      </pre>
    </main>
  );
}