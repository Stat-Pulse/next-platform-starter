// pages/player/[id].js

import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import mysql from 'mysql2/promise';

export async function getServerSideProps({ params }) {
  const playerId = params.id;
  let connection;

  try {
    console.log('⚠️ playerId requested:', playerId);

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

    console.log('📦 playerRows result:', playerRows);

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
    console.error('Error loading player profile:', error);
    return { notFound: true };
  }
}

export default function PlayerProfile({ player, careerStats, error }) {
  if (error) {
    return <div className="p-6 text-red-500 font-semibold">Error: {error}</div>;
  }

  if (!player) {
    return <div className="p-6 text-gray-500 font-medium">No player data found.</div>;
  }

  return (
    <>
      <Head>
        <title>{player.player_name} | StatPulse</title>
      </Head>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Player Bio */}
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

        {/* Career Stats Table */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Career Stats by Season</h2>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Season</th>
                <th className="p-2 text-right">Pass Yards</th>
                <th className="p-2 text-right">Rush Yards</th>
                <th className="p-2 text-right">Recv Yards</th>
                <th className="p-2 text-right">Total TDs</th>
                <th className="p-2 text-right">PPR Points</th>
              </tr>
            </thead>
            <tbody>
              {careerStats.map((season) => (
                <tr key={season.season} className="border-t">
                  <td className="p-2">{season.season}</td>
                  <td className="p-2 text-right">{season.passing_yards}</td>
                  <td className="p-2 text-right">{season.rushing_yards}</td>
                  <td className="p-2 text-right">{season.receiving_yards}</td>
                  <td className="p-2 text-right">{season.total_tds}</td>
                  <td className="p-2 text-right">{season.fantasy_points_ppr?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
