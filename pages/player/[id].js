// File: pages/player/[id].js

import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
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

    const [rows] = await connection.execute(`
      SELECT 
        P.player_id,
        P.player_name,
        P.position,
        R.team,
        R.jersey_number,
        R.status,
        R.headshot_url,
        R.years_exp,
        R.college,
        R.draft_club,
        R.draft_number,
        R.rookie_year
      FROM Players P
      LEFT JOIN Rosters_2024 R ON P.player_id = R.gsis_id
      WHERE P.player_id = ?
      LIMIT 1
    `, [playerId]);

    await connection.end();

    if (rows.length === 0) {
      return {
        notFound: true
      };
    }

    return {
      props: {
        player: rows[0]
      }
    };

  } catch (error) {
    console.error('Error loading player profile:', error);
    return {
      notFound: true
    };
  }
}

export default function PlayerProfile({ player }) {
  return (
    <>
      <Head>
        <title>{player.player_name} | StatPulse</title>
      </Head>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 flex gap-6">
          {player.headshot_url && (
            <Image
              src={player.headshot_url}
              alt={player.player_name}
              width={160}
              height={160}
              className="rounded-xl"
            />
          )}

          <div>
            <h1 className="text-3xl font-bold">{player.player_name}</h1>
            <p className="text-gray-600">{player.position} | {player.team}</p>
            <p className="mt-2 text-sm">Jersey #{player.jersey_number}</p>
            <p className="text-sm">Status: {player.status}</p>
            <p className="text-sm">Experience: {player.years_exp} years</p>
            <p className="text-sm">College: {player.college}</p>
            <p className="text-sm">Drafted by {player.draft_club} — Pick #{player.draft_number} in {player.rookie_year}</p>
          </div>
        </div>
      </main>
    </>
  );
}
