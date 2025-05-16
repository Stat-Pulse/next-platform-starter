// pages/player/[id].js
import React from 'react';
import Head from 'next/head';
import mysql from 'mysql2/promise';
import Image from 'next/image';

export async function getServerSideProps({ params }) {
  const playerId = params.id;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // 1) fetch the core player row
    const [playerRows] = await connection.execute(
      `SELECT *
       FROM Players
       WHERE player_id = ?`,
      [playerId]
    );

    if (!playerRows.length) {
      // no match → return 404
      return { notFound: true };
    }
    const player = playerRows[0];

    // 2) fetch game logs
    const [gameLogs] = await connection.execute(
      `SELECT game_id, passing_yards, passing_touchdowns, rushing_yards, rushing_touchdowns, fumbles
       FROM Player_Stats_Game
       WHERE player_id = ?
       ORDER BY game_id`,
      [playerId]
    );

    // 3) fetch injuries
    const [injuries] = await connection.execute(
      `SELECT report_date, injury_description, status
       FROM Injuries
       WHERE player_id = ?
       ORDER BY report_date DESC`,
      [playerId]
    );

    await connection.end();

    return {
      props: { player, gameLogs, injuries },
    };
  } catch (err) {
    // send the error message back into the page for visibility
    return {
      props: { error: err.message },
    };
  }
}

export default function PlayerPage({ player, gameLogs, injuries, error }) {
  if (error) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h1>⚠️ Error loading player</h1>
        <pre>{error}</pre>
      </div>
    );
  }

  // if getServerSideProps returned notFound, Next will 404 before this render
  return (
    <div style={{ padding: '2rem' }}>
      <Head>
        <title>{player.player_name}</title>
      </Head>
      <h1>{player.player_name} ({player.position})</h1>
      <p>Team: {player.team_id}</p>
      {player.headshot_url && (
        <Image
          src={player.headshot_url}
          alt={`${player.player_name} headshot`}
          width={200}
          height={200}
        />
      )}

      <section>
        <h2>Profile Details</h2>
        <ul>
          <li>Jersey: {player.jersey_number}</li>
          <li>Experience: {player.years_exp} years</li>
          <li>College: {player.college}</li>
          {/* etc… */}
        </ul>
      </section>

      <section>
        <h2>Game Logs</h2>
        <pre>{JSON.stringify(gameLogs, null, 2)}</pre>
      </section>

      <section>
        <h2>Injuries</h2>
        <pre>{JSON.stringify(injuries, null, 2)}</pre>
      </section>
    </div>
  );
}
