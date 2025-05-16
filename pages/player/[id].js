// pages/player/[id].js
import React from 'react';
import Head from 'next/head';
import mysql from 'mysql2/promise';
import Image from 'next/image';

export async function getServerSideProps({ params }) {
  const playerId = params.id;

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  const [dbCheck] = await connection.query('SELECT DATABASE() AS db');
  console.log('✅ Connected to DB:', dbCheck[0].db);

  const [playerRows] = await connection.execute(`
    SELECT p.player_id, p.player_name, p.position, p.team_id,
           r.jersey_number, r.status, r.headshot_url, r.years_exp, r.college,
           r.height, r.weight, r.draft_club, r.draft_number, r.rookie_year,
           c.contract_type, c.year AS contract_year, c.team_abbr AS contract_team, c.avg_annual_value
    FROM Players p
    LEFT JOIN Rosters_2024 r ON p.player_name = r.full_name
    LEFT JOIN Contracts c ON p.player_name = c.player_name
    WHERE p.player_id = ?
    LIMIT 1
  `, [playerId]);

  const [gameLogs] = await connection.execute(`
    SELECT game_id, passing_yards, passing_touchdowns, rushing_yards, rushing_touchdowns, fumbles
    FROM Player_Stats_Game
    WHERE player_id = ?
    ORDER BY game_id
  `, [playerId]);

  const [injuries] = await connection.execute(`
    SELECT report_date, injury_description, status
    FROM Injuries
    WHERE player_id = ?
    ORDER BY report_date DESC
  `, [playerId]);

  const [depth] = await connection.execute(`
    SELECT club_code, week, position, depth_position
    FROM Depth_Charts_2024
    WHERE full_name = (SELECT player_name FROM Players WHERE player_id = ?)
    ORDER BY week DESC
    LIMIT 1
  `, [playerId]);

  await connection.end();

  return {
    props: {
      player: playerRows[0] || null,
      gameLogs,
      injuries,
      depthChart: depth[0] || null
    }
  };
}

export default function PlayerProfile({ player, gameLogs, injuries, depthChart }) {
  if (!player) return <div className="p-6">Player not found.</div>;

  return (
    <>
      <Head><title>{player.player_name} - StatPulse</title></Head>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
          {player.headshot_url && (
            <Image src={player.headshot_url} alt={player.player_name} width={150} height={150} className="rounded-xl shadow-md" />
          )}
          <div>
            <h1 className="text-3xl font-bold mb-1">{player.player_name}</h1>
            <p className="text-gray-600">{player.position} | #{player.jersey_number} | {player.team_id}</p>
            <p className="text-sm text-gray-500">{player.college} | Drafted by {player.draft_club} (#{player.draft_number})</p>
            <p className="text-sm text-gray-500">{player.height}" / {player.weight} lbs | {player.years_exp} years experience</p>
            {depthChart && <p className="text-xs text-blue-600 mt-1">Depth Chart: {depthChart.depth_position} - Week {depthChart.week}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Contract Info</h2>
            {player.contract_type ? (
              <p>{player.contract_type} contract with {player.contract_team} ({player.contract_year}) - ${player.avg_annual_value?.toLocaleString()} AAV</p>
            ) : <p className="text-gray-500">No contract data available.</p>}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Injury History</h2>
            <ul className="text-sm space-y-1">
              {injuries.map((inj, i) => (
                <li key={i}>{inj.report_date}: {inj.injury_description || "Undisclosed"} ({inj.status})</li>
              ))}
              {injuries.length === 0 && <li className="text-gray-500">No recent injuries</li>}
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Game Logs (Fantasy Scoring)</h2>
          {gameLogs.length > 0 ? (
            <table className="w-full text-sm border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Game</th>
                  <th className="p-2">Pass Yds</th>
                  <th className="p-2">Pass TDs</th>
                  <th className="p-2">Rush Yds</th>
                  <th className="p-2">Rush TDs</th>
                  <th className="p-2">Fumbles</th>
                  <th className="p-2">Fantasy PPR</th>
                </tr>
              </thead>
              <tbody>
                {gameLogs.map((g, i) => {
                  const fantasy = (g.passing_touchdowns * 4 + g.passing_yards / 25 + g.rushing_touchdowns * 6 + g.rushing_yards / 10 + g.fumbles * -2).toFixed(2);
                  return (
                    <tr key={i} className="border-t">
                      <td className="p-2 text-center">{g.game_id}</td>
                      <td className="p-2 text-center">{g.passing_yards}</td>
                      <td className="p-2 text-center">{g.passing_touchdowns}</td>
                      <td className="p-2 text-center">{g.rushing_yards}</td>
                      <td className="p-2 text-center">{g.rushing_touchdowns}</td>
                      <td className="p-2 text-center">{g.fumbles}</td>
                      <td className="p-2 text-center font-semibold">{fantasy}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-500">No games recorded this season.</p>
          )}
        </div>
      </div>
    </>
  );
}
