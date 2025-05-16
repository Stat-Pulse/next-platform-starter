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

    const [rows] = await conn.execute(
      'SELECT * FROM Players WHERE player_id = ?',
      [params.id]
    );
    await conn.end();

    if (rows.length === 0) {
      return { notFound: true };
    }

    return { props: { player: rows[0], gameLogs: [], injuries: [] } };
  } catch (err) {
    return { props: { error: err.message } };
  }
}

export default function PlayerPage({ player, error }) {
  if (error) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <Head><title>Server Error</title></Head>
        <h1>⚠️ Server Error</h1>
        <pre>{error}</pre>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Head><title>{player.player_name}</title></Head>
      <h1>{player.player_name} ({player.position})</h1>
      <p>ID: {player.player_id}</p>
      {/* etc. */}
    </div>
  );
}
