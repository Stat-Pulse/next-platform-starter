'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function PlayerProfile() {
  const router = useRouter()
  const { slug } = router.query
  const [player, setPlayer] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return

    async function loadData() {
      try {
        const files = [
          '/data/2024_qbs_sorted.json',
          '/data/2024_rbs_sorted.json',
          '/data/2024_wrs_sorted.json',
          '/data/2024_tes_sorted.json'
        ]

        const all = await Promise.all(files.map(f => fetch(f).then(res => res.json())))
        const flat = all.flat()
        const matched = flat.find(p => {
          const nameSlug = (p.display_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
          return nameSlug === slug
        })

        if (matched) {
          setPlayer(matched)
        } else {
          setNotFound(true)
        }
      } catch (err) {
        console.error('Error loading player data:', err)
        setNotFound(true)
      }
    }

    loadData()
  }, [slug])

  if (notFound) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-6 py-10">
          <p className="text-red-600">Player not found.</p>
          <Link href="/players" className="text-blue-600 hover:underline">← Back to Player Search</Link>
        </main>
        <Footer />
      </>
    )
  }

  if (!player) return null

  const { display_name, age, position, recent_team, games, fantasy_points_ppr, contract, stats = [], injuries = [], game_logs = [] } = player

  const mostRecent = stats.slice().sort((a, b) => b.season - a.season)
  const missedGames = games && games < 17

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">{display_name}</h1>
            <Link href="/players" className="text-sm text-blue-600 hover:underline">← Back to Player Search</Link>
          </div>

          <section className="bg-white p-6 rounded shadow">
            <p className="text-gray-600">{position} · Age: {age} · Team: {recent_team || 'N/A'}</p>
            {missedGames && (
              <p className="text-xs text-yellow-600 mt-1 italic">
                Disclaimer: This player missed {17 - games} games in 2024.
              </p>
            )}
          </section>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Career Stats</h2>
            {mostRecent.map((s, i) => (
              <div key={i} className="mb-3 border-b pb-2">
                <p className="text-gray-800 font-medium">{s.season}</p>
                <p className="text-gray-600 text-sm">
                  Yards: {s.total_yards || 'N/A'}, TDs: {s.passing_tds || s.rushing_tds || s.receiving_tds || 'N/A'}, PPR Points: {s.fantasy_points_ppr || 'N/A'}
                </p>
              </div>
            ))}
          </section>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Game Logs</h2>
            <table className="w-full text-sm table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Week</th>
                  <th className="p-2 text-left">Opponent</th>
                  <th className="p-2 text-left">Result</th>
                  <th className="p-2 text-left">Yards</th>
                  <th className="p-2 text-left">TDs</th>
                </tr>
              </thead>
              <tbody>
                {game_logs.map((g, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{g.week}</td>
                    <td className="p-2">{g.opponent}</td>
                    <td className="p-2">{g.result}</td>
                    <td className="p-2">{g.yards}</td>
                    <td className="p-2">{g.tds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Contract Info</h2>
            <p className="text-sm text-gray-600">
              {contract ? contract : 'No contract details available.'}
            </p>
          </section>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Injury History</h2>
            {injuries.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-600">
                {injuries.map((entry, idx) => (
                  <li key={idx}>{entry.date}: {entry.injury} — Missed {entry.games_missed} games</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No injuries reported.</p>
            )}
          </section>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Advanced Stats</h2>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              <li>Pressure Rating: N/A</li>
              <li>Target Share: N/A</li>
              <li>Yards After Contact: N/A</li>
              <li>Pass Rush Win Rate: N/A</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Bio & Background</h2>
            <p className="text-sm text-gray-600">
              College: N/A · Drafted: N/A · Notable: Add summary here later
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
