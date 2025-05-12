// pages/players/[slug].js
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function PlayerProfilePage() {
  const router = useRouter()
  const { slug } = router.query
  const [player, setPlayer] = useState(null)

  const sampleData = [
    {
      name: 'Joe Burrow',
      slug: 'joe-burrow',
      position: 'QB',
      team: 'CIN',
      age: 28,
      games_played: 8,
      games_expected: 17,
      injury_note: 'Missed 9 games in 2024 with a partial hamstring tendon avulsion.',
      career_stats: {
        2024: { yards: 2301, tds: 18, ints: 6, games: 8 },
        2023: { yards: 4463, tds: 35, ints: 10, games: 17 },
        2022: { yards: 4475, tds: 34, ints: 12, games: 17 }
      },
      game_logs: [
        { week: 1, opponent: 'CLE', result: 'L 24-17', yards: 220, tds: 1 },
        { week: 2, opponent: 'BAL', result: 'W 31-27', yards: 312, tds: 3 }
      ],
      injuries: [
        { date: '2024-10-10', type: 'Hamstring (Partial Avulsion)', games_missed: 9 },
        { date: '2021-11-21', type: 'Knee Sprain', games_missed: 1 }
      ],
      contract: {
        length: '5 years (2021–2025)',
        base_salary: '$30M',
        cap_hit: '$55.9M',
        cap_pct: '17.2%',
        dead_money: '$55.9M',
        savings_if_cut: '$12.4M'
      },
      advanced_stats: {
        pressure_rating: 94.5,
        deep_ball_pct: '48.2%',
        pff_grade: '82.3',
        scrambles: 18
      },
      bio: {
        college: 'LSU',
        drafted: '2020, Round 1, Pick 1 by CIN',
        summary: '2020 Heisman Trophy winner, led LSU to undefeated title run.'
      },
      highlights: [
        { label: 'Clutch TD vs Chiefs', url: 'https://www.youtube.com/watch?v=example' }
      ]
    }
  ]

  useEffect(() => {
    if (!slug) return
    const found = sampleData.find(p => p.slug === slug)
    setPlayer(found || null)
  }, [slug])

  if (!player) return <div className="p-6 text-center text-gray-600">Player not found.</div>
  const missedGames = player.games_expected - player.games_played
  const statEntries = Object.entries(player.career_stats).sort((a, b) => b[0] - a[0])
  const formatKey = key => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link href="/players" className="text-red-600 hover:underline text-sm">&larr; Back to Player Search</Link>

        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{player.name}</h1>
          <p className="text-gray-600 text-sm">{player.position}, {player.team} &middot; Age {player.age}</p>
          {player.injury_note && (
            <div className="bg-yellow-100 border-l-4 border-yellow-400 p-3 mt-4 text-yellow-700 text-sm rounded">
              ⚠️ {player.injury_note}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Career Stats</h2>
          <div className="space-y-3">
            {statEntries.map(([year, stats]) => (
              <details key={year} className="border rounded">
                <summary className="cursor-pointer px-4 py-2 font-medium bg-gray-50 hover:bg-gray-100">
                  {year} – {stats.yards} YDS, {stats.tds} TD, {stats.ints} INT ({stats.games} Games)
                </summary>
                <div className="p-4 text-sm text-gray-600">
                  <p><strong>Yards:</strong> {stats.yards}</p>
                  <p><strong>Touchdowns:</strong> {stats.tds}</p>
                  <p><strong>Interceptions:</strong> {stats.ints}</p>
                  <p><strong>Games:</strong> {stats.games}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Game Logs</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Week</th><th className="p-2">Opponent</th><th className="p-2">Result</th><th className="p-2">Yards</th><th className="p-2">TDs</th>
              </tr>
            </thead>
            <tbody>
              {player.game_logs.map((g, i) => (
                <tr key={i} className="text-gray-700">
                  <td className="p-2">{g.week}</td><td className="p-2">{g.opponent}</td><td className="p-2">{g.result}</td><td className="p-2">{g.yards}</td><td className="p-2">{g.tds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Injury History</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            {player.injuries.map((inj, idx) => (
              <li key={idx}><strong>{inj.date}:</strong> {inj.type} ({inj.games_missed} games missed)</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Contract</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            {Object.entries(player.contract).map(([k, v]) => (
              <li key={k}><strong>{formatKey(k)}:</strong> {v}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Advanced Stats</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            {Object.entries(player.advanced_stats).map(([k, v]) => (
              <li key={k}><strong>{formatKey(k)}:</strong> {v}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Highlights & Media</h2>
          {player.highlights.map((clip, i) => (
            <p key={i}><a href={clip.url} target="_blank" className="text-red-600 hover:underline text-sm">🎥 {clip.label}</a></p>
          ))}
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Bio & Background</h2>
          <p className="text-sm text-gray-700 mb-1"><strong>College:</strong> {player.bio.college}</p>
          <p className="text-sm text-gray-700 mb-1"><strong>Drafted:</strong> {player.bio.drafted}</p>
          <p className="text-sm text-gray-700 mt-2">{player.bio.summary}</p>
        </div>
      </div>
    </div>
  )
}
