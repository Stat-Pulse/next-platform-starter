// pages/player/[id].js
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export async function getServerSideProps({ params }) {
  const mysql = require('mysql2/promise');
  let conn;

  // 1) Connect
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

  // 2) Fetch player & roster
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
    if (!rows.length) {
      await conn.end();
      return { notFound: true };
    }
    player = JSON.parse(JSON.stringify(rows[0]));
  } catch (err) {
    await conn.end();
    return { props: { fatalError: `Player query failed: ${err.message}` } };
  }

  // 3) Recent Game Logs (last 10)
  let gameLogs = [];
  let gameLogsError = null;
  try {
    const [gl] = await conn.execute(
      `
      SELECT
        ps.game_id,
        g.season,
        g.week,
        (
          ps.receptions
          + ps.receiving_yards/10
          + ps.receiving_touchdowns*6
          + ps.rushing_yards/10
          + ps.rushing_touchdowns*6
          + ps.passing_yards/25
          + ps.passing_touchdowns*4
          - ps.interceptions*2
          - ps.fumbles*2
        ) AS fantasyPoints,
        ps.passing_yards,
        ps.passing_touchdowns,
        ps.rushing_yards,
        ps.rushing_touchdowns,
        ps.fumbles
      FROM Player_Stats_Game ps
      JOIN Games g ON ps.game_id = g.game_id
      WHERE ps.player_id = ?
      ORDER BY g.season DESC, g.week DESC
      LIMIT 10
      `,
      [params.id]
    );
    gameLogs = JSON.parse(JSON.stringify(gl));
  } catch (err) {
    gameLogsError = err.message;
  }

  // 4) Career Summary
  let careerSummary = [];
  let careerError = null;
  try {
    const [cs] = await conn.execute(
      `
      SELECT
        g.season,
        SUM(
          ps.receptions
          + ps.receiving_yards/10
          + ps.receiving_touchdowns*6
          + ps.rushing_yards/10
          + ps.rushing_touchdowns*6
          + ps.passing_yards/25
          + ps.passing_touchdowns*4
          - ps.interceptions*2
          - ps.fumbles*2
        ) AS totalFantasyPoints,
        SUM(ps.passing_yards)    AS totalPassingYards,
        SUM(ps.passing_touchdowns) AS totalPassingTDs,
        SUM(ps.rushing_yards)    AS totalRushingYards,
        SUM(ps.rushing_touchdowns) AS totalRushingTDs,
        SUM(ps.receiving_yards)  AS totalReceivingYards,
        SUM(ps.receiving_touchdowns) AS totalReceivingTDs
      FROM Player_Stats_Game ps
      JOIN Games g ON ps.game_id = g.game_id
      WHERE ps.player_id = ?
      GROUP BY g.season
      ORDER BY g.season DESC
      `,
      [params.id]
    );
    careerSummary = JSON.parse(JSON.stringify(cs));
  } catch (err) {
    careerError = err.message;
  }

  await conn.end();
  return { props: { player, gameLogs, gameLogsError, careerSummary, careerError } };
}

export default function PlayerPage({
  player,
  gameLogs,
  gameLogsError,
  careerSummary,
  careerError,
  fatalError,
}) {
  if (fatalError) {
    return (
      <div className="p-8 text-red-600">
        <Head><title>Server Error</title></Head>
        <h1 className="text-2xl font-bold">💥 Fatal Error</h1>
        <pre>{fatalError}</pre>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <Head><title>{player.player_name}</title></Head>

      {/* Header */}
      <header className="flex items-center space-x-6">
        {player.headshot_url && (
          <img
            src={player.headshot_url}
            alt="headshot"
            className="w-24 h-24 rounded-full"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">
            {player.player_name}{player.position && ` (${player.position})`}
          </h1>
          <p className="text-gray-600">Team: {player.team_id}</p>
        </div>
      </header>

      {/* Profile Details */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><strong>ID:</strong> {player.player_id}</div>
          <div><strong>College:</strong> {player.college || '—'}</div>
          <div><strong>Draft Year:</strong> {player.draft_year || '—'}</div>
          <div><strong>DOB:</strong> {player.date_of_birth || '—'}</div>
          <div><strong>Height:</strong> {player.height_inches ? `${player.height_inches}"` : '—'}</div>
          <div><strong>Weight:</strong> {player.weight ? `${player.weight} lb` : '—'}</div>
          <div><strong>Active:</strong> {player.is_active ? 'Yes' : 'No'}</div>
          <div><strong>Experience:</strong> {player.years_exp != null ? `${player.years_exp} yr` : '—'}</div>
          <div><strong>Jersey #:</strong> {player.jersey_number || '—'}</div>
        </div>
      </section>

      {/* Recent Game Logs */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Game Logs</h2>
