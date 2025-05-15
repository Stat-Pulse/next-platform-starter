// pages/player/[id].js
import React from 'react'
import Head from 'next/head'
import mysql from 'mysql2/promise'

export async function getServerSideProps({ params }) {
  const playerId = params.id

  const connection = await mysql.createConnection({
    host: process.env.stat-pulse-analytics-db.ci1uue2w2sxp.us-east-1.rds.amazonaws.com,
    database: process.env.nfl_analytics,
    user: process.env.StatadminPULS3,
    password: process.env.wyjGiz-justo6-gesmyh
  })
  
  const [playerRows] = await connection.execute(`
    SELECT p.*, c.contract_type, c.team_abbr AS contract_team, c.year AS contract_year, c.avg_annual_value
    FROM Players p
    LEFT JOIN Contracts c ON p.player_id = c.player_id
    WHERE p.player_id = ?
    LIMIT 1
  `, [playerId])

  const [gameLogs] = await connection.execute(`
    SELECT * FROM Player_Stats_Game_2024
    WHERE player_id = ?
    ORDER BY week ASC
  `, [playerId])

  const [snapCounts] = await connection.execute(`
    SELECT * FROM Player_Snaps
    WHERE player_id = ?
    ORDER BY season DESC, week ASC
  `, [playerId])

  const [injuries] = await connection.execute(`
    SELECT * FROM Injuries
    WHERE player_id = ?
    ORDER BY report_date DESC
  `, [playerId])

  connection.end()

  return {
    props: {
      player: playerRows[0] || null,
      gameLogs,
      snapCounts,
      injuries
    }
  }
}

export default function PlayerProfile({ player, gameLogs, snapCounts, injuries }) {
  if (!player) return <div className="p-6">Player not found.</div>

  return (
    <>
      <Head><title>{player.player_name} - StatPulse</title></Head>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{player.player_name}</h1>
        <p className="text-gray-600">{player.position} | {player.team_id}</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Contract</h2>
            {player.contract_type ? (
              <p>{player.contract_type} - ${player.avg_annual_value?.toLocaleString()} AAV with {player.contract_team} ({player.contract_year})</p>
            ) : <p>No contract data</p>}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Injury History</h2>
            <ul className="text-sm space-y-1">
              {injuries.map((inj, i) => (
                <li key={i}>
                  {inj.report_date}: {inj.injury_description} ({inj.status})
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">2024 Game Logs</h2>
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Week</th>
                <th className="p-2">Pass Yds</th>
                <th className="p-2">Rush Yds</th>
                <th className="p-2">Rec Yds</th>
                <th className="p-2">Fantasy PPR</th>
              </tr>
            </thead>
            <tbody>
              {gameLogs.map((g, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 text-center">{g.week}</td>
                  <td className="p-2 text-center">{g.passing_yards}</td>
                  <td className="p-2 text-center">{g.rushing_yards}</td>
                  <td className="p-2 text-center">{g.receiving_yards}</td>
                  <td className="p-2 text-center">{g.fantasy_points_ppr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Snap Counts</h2>
          <ul className="text-sm space-y-1">
            {snapCounts.map((snap, i) => (
              <li key={i}>
                {snap.season} W{snap.week}: Off {snap.offense_pct}% | Def {snap.defense_pct}% | ST {snap.special_teams_pct}%
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
