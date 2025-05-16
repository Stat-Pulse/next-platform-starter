// pages/player/[id].js
import React from 'react';
import Head from 'next/head';

export async function getServerSideProps({ params }) {
  const mysql = require('mysql2/promise');
  let conn;

  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  } catch (err) {
    return { props: { fatalError: `DB connection failed: ${err.message}` } };
  }

  // 1) Fetch player
  let player;
  try {
    const [rows] = await conn.execute(
      'SELECT player_id, player_name, position FROM Players WHERE player_id = ?',
      [params.id]
    );
    if (!rows.length) {
      await conn.end();
      return { notFound: true };
    }
    player = rows[0];
  } catch (err) {
    await conn.end();
    return { props: { fatalError: `Player query failed: ${err.message}` } };
  }

  // 2) Fetch gameLogs
  let gameLogs = [];
  let gameLogsError = null;
  try {
    const [rows] = await conn.execute(
      `SELECT game_id, passing_yards, passing_touchdowns,
              rushing_yards, rushing_touchdowns, fumbles
       FROM Player_Stats_Game
       WHERE player_id = ?
       ORDER BY game_id`,
      [params.id]
    );
    gameLogs = rows;
  } catch (err) {
    gameLogsError = err.message;
  }

  // 3) Fetch injuries
  let injuries = [];
  let injuriesError = null;
  try {
    const [rows] = await conn.execute(
      `SELECT report_date, injury_description, status
       FROM Injuries
       WHERE player_id = ?
       ORDER BY report_date DESC`,
      [params.id]
    );
    injuries = rows;
  } catch (err) {
    injuriesError = err.message;
  }

  await conn.end();
  return {
    props: { player, gameLogs, gameLogsError, injuries, injuriesError },
  };
}

export default function PlayerPage({
  player,
  gameLogs,
  gameLogsError,
  injuries,
  injuriesError,
  fatalError,
}) {
  if (fatalError) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <Head><title>Fatal Error</title></Head>
        <h1>💥 Fatal Error</h1>
        <pre>{fatalError}</pre>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Head><title>{player.player_name}</title></Head>

      <h1>
        {player.player_name}
        {player.position && ` (${player.position})`}
      </h1>
      <p><strong>ID:</strong> {player.player_id}</p>

      <section>
        <h2>Game Logs</h2>
        {gameLogsError ? (
          <p style={{ color: 'red' }}>Error loading game logs: {gameLogsError}</p>
        ) : gameLogs.length ? (
          <pre>{JSON.stringify(gameLogs, null, 2)}</pre>
        ) : (
          <p>No game logs available.</p>
        )}
      </section>

      <section>
        <h2>Injuries</h2>
        {injuriesError ? (
          <p style={{ color: 'red' }}>Error loading injuries: {injuriesError}</p>
        ) : injuries.length ? (
          <pre>{JSON.stringify(injuries, null, 2)}</pre>
        ) : (
          <p>No injury records found.</p>
        )}
      </section>
    </div>
  );
}
