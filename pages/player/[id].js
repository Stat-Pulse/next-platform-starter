// pages/player/[id].js
import React from 'react';
import Head from 'next/head';

export async function getServerSideProps({ params }) {
  try {
    const mysql = require('mysql2/promise');
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // test a simple SELECT
    const [rows] = await conn.execute(
      'SELECT player_id, player_name, position FROM Players WHERE player_id = ?',
      [params.id]
    );
    await conn.end();

    if (!rows.length) {
      return { notFound: true };
    }

    return { props: { player: rows[0] } };
  } catch (err) {
    // surface the raw error
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
      <h1>{player.player_name} {player.position && `(${player.position})`}</h1>
      <p>ID: {player.player_id}</p>
    </div>
  );
}
