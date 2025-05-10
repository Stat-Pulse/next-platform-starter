'use client'

import { useState, useEffect } from 'react'
import Chart from 'chart.js/auto'

export default function ComparisonSections({ players = [], metrics = [] }) {
  // only render once we have at least 2 players
  if (players.length < 2) {
    return (
      <div className="container mx-auto px-6 py-8">
        <p className="text-gray-600 italic">
          Select at least two players to compare.
        </p>
      </div>
    )
  }

  const [data, setData] = useState([])

  // Fetch full player data when players[] changes
  useEffect(() => {
    async function load() {
      const results = await Promise.all(
        players.map((name) =>
          fetch(`/api/player?name=${encodeURIComponent(name)}`)
            .then((r) => r.json())
        )
      )
      setData(results)
    }
    load()
  }, [players])

  // Show loading if we haven't gotten back all player details yet
  if (data.length < players.length) {
    return (
      <div className="container mx-auto px-6 py-8">
        <p className="text-gray-600">Loading comparison…</p>
      </div>
    )
  }

  // We now have full data for two players
  const [p1, p2] = data

  return (
    <div className="container mx-auto px-6 py-8 bg-white rounded shadow">
      {/* Core Information */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-6">Core Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[p1, p2].map((p) => (
            <div key={p.name} className="bg-gray-100 p-6 rounded-lg shadow">
              <h4 className="text-xl font-semibold mb-2">{p.name}</h4>
              <p>{p.position} | {p.team} | #{p.jersey}</p>
              <p><strong>Upcoming:</strong> {p.upcomingGame}</p>
              <p><strong>Bye:</strong> {p.byeWeek}</p>
              <p>
                <strong>Injury:</strong>{' '}
                <span className={
                  p.injuryStatus === 'Healthy'
                    ? 'text-green-600'
                    : 'text-red-600'
                }>
                  {p.injuryStatus}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Game Log */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-6">Recent Game Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Player</th>
                <th className="p-2">Week</th>
                <th className="p-2">Opp</th>
                {p1.position === 'QB'
                  ? ['Pass Yds','Pass TD','INT'].map((h) => (
                      <th key={h} className="p-2">{h}</th>
                    ))
                  : p1.position === 'RB'
                  ? ['Rush Yds','Rush TD','Rec Yds'].map((h) => (
                      <th key={h} className="p-2">{h}</th>
                    ))
                  : ['Rec','Rec Yds','Rec TD'].map((h) => (
                      <th key={h} className="p-2">{h}</th>
                    ))
                }
              </tr>
            </thead>
            <tbody>
              {data.flatMap((p) =>
                p.recentGames.slice(0, 3).map((game) => (
                  <tr key={`${p.name}-${game.week}`}>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{game.week}</td>
                    <td className="p-2">{game.opponent}</td>
                    {p.position === 'QB' ? (
                      <>
                        <td className="p-2">{game.stats.passYards}</td>
                        <td className="p-2">{game.stats.passTD}</td>
                        <td className="p-2">{game.stats.interceptions}</td>
                      </>
                    ) : p.position === 'RB' ? (
                      <>
                        <td className="p-2">{game.stats.rushYards}</td>
                        <td className="p-2">{game.stats.rushTD}</td>
                        <td className="p-2">{game.stats.recYards}</td>
                      </>
                    ) : (
                      <>
                        <td className="p-2">{game.stats.receptions}</td>
                        <td className="p-2">{game.stats.recYards}</td>
                        <td className="p-2">{game.stats.recTD}</td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
