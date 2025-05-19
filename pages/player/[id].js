// pages/player/[id].js

import React from 'react';
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

    if (playerRows.length === 0) {
      return { notFound: true };
    }

    return {
      props: {
        player: playerRows[0],
        careerStats,
      }
    };

  } catch (error) {
    return {
      props: {
        error: error.message || 'Unknown error occurred',
      }
    };
  }
}

export default function DebugPlayerPage({ player, careerStats, error }) {
  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1 style={{ color: 'red' }}>🧪 DEBUG MODE</h1>

      {error && (
        <pre style={{ background: '#fee', padding: '1rem', border: '1px solid red' }}>
          Error: {error}
        </pre>
      )}

      <h2>Player</h2>
      <pre>{JSON.stringify(player, null, 2)}</pre>

      <h2>Career Stats</h2>
      <pre>{JSON.stringify(careerStats, null, 2)}</pre>
    </main>
  );
}
