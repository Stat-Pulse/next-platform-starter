// pages/player/[id].js
import React from 'react';
import Head from 'next/head';

export async function getServerSideProps({ params }) {
  const mysql = require('mysql2/promise');
  let conn;

  // 1) Connect
  try {
    conn = await mysql.createConnection({
      host:     process.env.DB_HOST,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  } catch (err) {
    return { props: { fatalError: `DB connection failed: ${err.message}` } };
  }

  // 2) Fetch player + roster data
  let player;
  try {
    const [rows] = await conn.execute(
      `
      SELECT
        p.player_id,
        p.player_name,
        p.position,
        p.college,
        p.draft_year,
        p.date_of_birth,
        p.height_inches,
        p.weight,
        p.is_active,
        p.team_id,
        r.jersey_number,
        r.years_exp,
        r.headshot_url
      FROM Players p
      LEFT JOIN Rosters_2024 r
        ON p.player_id = r.gsis_id
      WHERE p.player_id = ?
      `,
      [params.id]
    );
    if (rows.length === 0) {
      await conn.end();
      return { notFound: true };
    }
    player = rows[0];
  } catch (err) {
    await conn.end();
    return { props: { fatalError: `Player query failed: ${err.message}` } };
  }

  // 3) Game logs
  let gameLogs = [], gameLogsError = null;
  try {
    const [gl] = await conn.execute(
      `
      SELECT
        game_id,
        passing_yards,
        passing_touchdowns,
        rushing_yards,
        rushing_touchdowns,
        fumbles
      FROM Player_Stats_Game
      WHERE player_id = ?
      ORDER BY game_id
      `,
      [params.id]
    );
    gameLogs = gl;
  } catch (err) {
    gameLogsError = err.message;
  }

  // 4) Injuries
  let injuries = [], injuriesError = null;
  try {
    const [ir] = await conn.execute(
      `
      SELECT
        report_date,
        injury_description,
        status
      FROM Injuries
      WHERE player_id = ?
      ORDER BY report_date DESC
      `,
      [params.id]
    );
    injuries = ir;
  } catch (err) {
    injuriesError = err.message;
  }

  await conn.end();
  return { props: { player, gameLogs, gameLogsError, injuries, injuriesError } };
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
        <Head><title>Server Error</title></Head>
        <h1>💥 Fatal Error</h1>
        <pre>{fatalError}</pre>
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
      <Head><title>{player.player_name}</title></Head>

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
          <li><strong>Jersey #:</strong> {player.jersey_number ?? '—'}</li>
          <li><strong>Experience:</strong> {player.years_exp != null ? `${player.years_exp} yr` : '—'}</li>
          {player.headshot_url && (
            <li>
              <strong>Headshot:</strong><br/>
              <img
                src={player.headshot_url}
                alt={`${player.player_name} headshot`}
                width={100}
                height={100}
                style={{ borderRadius: '4px' }}
              />
            </li>
          )}
        </ul>
      </section>

      <section>
        <h2>Game Logs</h2>
        {gameLogsError ? (
          <p style={{ color: 'red' }}>Error loading game logs: {gameLogsError}</p>
        ) : gameLogs.length > 0 ? (
          <pre>{JSON.stringify(gameLogs, null, 2)}</pre>
        ) : (
          <p>No game logs available.</p>
        )}
      </section>

      <section>
        <h2>Injuries</h2>
        {injuriesError ? (
          <p style={{ color: 'red' }}>Error loading injuries: {injuriesError}</p>
        ) : injuries.length > 0 ? (
          <pre>{JSON.stringify(injuries, null, 2)}</pre>
        ) : (
          <p>No injury records found.</p>
        )}
      </section>
    </div>
  );
}