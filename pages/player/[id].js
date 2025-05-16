// pages/player/[id].js
import React from 'react';
import Head from 'next/head';
import mysql from 'mysql2/promise';

export async function getServerSideProps({ params }) {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // 1) Fetch the core player row
    const [playerRows] = await conn.execute(
      'SELECT * FROM Players WHERE player_id = ?',
      [params.id]
    );
    if (playerRows.length === 0) {
      await conn.end();
      return { notFound: true };
    }
    const player = playerRows[0];

    // 2) Fetch game logs
    const [gameLogs] = await conn.execute(
      `SELECT 
         game_id, 
         passing_yards, 
         passing_touchdowns,
         rushing_yards, 
         rushing_touchdowns, 
         fumbles
       FROM Player_Stats_Game
       WHERE player_id = ?
       ORDER BY game_id`,
      [params.id]
    );

    // 3) Fetch injuries
    const [injuries] = await conn.execute(
      `SELECT 
         report_date, 
         injury_description, 
         status
       FROM Injuries
       WHERE player_id = ?
       ORDER BY report_date DESC`,
      [params.id]
    );

    await conn.end();

    return {
      props: { player, gameLogs, injuries },
    };
  } catch (err) {
    return {
      props: { error: err.message },
    };
  }
}

export default function PlayerPage({ player, gameLogs, injuries, error }) {
  if (error) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <Head><title>Server Error</title></Head>
        <h1>⚠️ Server Error</h1>
        <pre>{error}</pre>
      </div>
    );
  }

  if (!player) {
    return (
      <div style={{ padding: '2rem' }}>
        <Head><title>Player Not Found</title></Head>
        <h1>🚨 Player not found</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Head>
        <title>{player.player_name}</title>
      </Head>

      <h1>
        {player.player_name}
        {player.position && ` (${player.position})`}
      </h1>

      <section>
        <h2>Profile Details</h2>
        <ul>
          <li><strong>ID:</strong> {player.player_id}</li>
          <li><strong>Position:</strong> {player.position || '—'}</li>
          <li><strong>College:</strong> {player.college || '—'}</li>
          <li><strong>Draft Year:</strong> {player.draft_year ?? '—'}</li>
          <li><strong>DOB:</strong> {player.date_of_birth || '—'}</li>
          <li><strong>Height (in):</strong> {player.height_inches ?? '—'}</li>
          <li><strong>Weight (lb):</strong> {player.weight ?? '—'}</li>
          <li><strong>Active:</strong> {player.is_active ? 'Yes' : 'No'}</li>
          <li><strong>Team:</strong> {player.team_id || '—'}</li>
        </ul>
      </section>

      <section>
        <h2>Game Logs</h2>
        {gameLogs.length > 0 ? (
          <pre>{JSON.stringify(gameLogs, null, 2)}</pre>
        ) : (
          <p>No game logs available.</p>
        )}
      </section>

      <section>
        <h2>Injuries</h2>
        {injuries.length > 0 ? (
          <pre>{JSON.stringify(injuries, null, 2)}</pre>
        ) : (
          <p>No injury records found.</p>
        )}
      </section>
    </div>
  );
}
