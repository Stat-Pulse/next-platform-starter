'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Chart from 'chart.js/auto'

export default function Insights() {
  const [playerData, setPlayerData] = useState(null)
  const [selectedPlayer, setSelectedPlayer] = useState('Joe Burrow')
  const [view, setView] = useState('fantasy')

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/data/player-insights.json')
        if (!res.ok) throw new Error('Failed to fetch player insights')
        const players = await res.json()
        const player = players.find(p => p.name === selectedPlayer)
        setPlayerData(player)
      } catch (err) {
        console.error(err)
        setPlayerData(null)
      }
    }

    loadData()
  }, [selectedPlayer])

  useEffect(() => {
    if (!playerData) return
    const ctx = document.getElementById('fantasyChart')
    if (!ctx) return
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: playerData.fantasy.pointsHistory.map((_, i) => `Week ${i + 1}`),
        datasets: [{
          label: 'Fantasy Points',
          data: playerData.fantasy.pointsHistory,
          borderColor: '#DC2626',
          fill: false,
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    })
  }, [playerData])

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Player Insights</h2>

          {/* Player Selector */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
            <select
              className="p-2 border rounded-md"
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
            >
              <option value="Joe Burrow">Joe Burrow</option>
              <option value="Saquon Barkley">Saquon Barkley</option>
              <option value="Ja'Marr Chase">Ja'Marr Chase</option>
            </select>
            <div className="flex gap-2">
              <button
                className={`${view === 'betting' ? 'bg-red-600' : 'bg-gray-600'} text-white px-4 py-2 rounded-md text-sm`}
                onClick={() => setView('betting')}
              >
                Betting View
              </button>
              <button
                className={`${view === 'fantasy' ? 'bg-red-600' : 'bg-gray-600'} text-white px-4 py-2 rounded-md text-sm`}
                onClick={() => setView('fantasy')}
              >
                Fantasy View
              </button>
            </div>
          </div>

          {/* Player Info */}
          {playerData && (
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h3 className="text-2xl font-semibold mb-2">{playerData.name}</h3>
              <p className="text-gray-600 mb-2">
                {playerData.position} | {playerData.team} | #{playerData.jersey}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Injury Status:</strong>{' '}
                <span className={playerData.injuryStatus === 'Healthy' ? 'text-green-600' : 'text-red-600'}>
                  {playerData.injuryStatus}
                </span>
              </p>

              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Recent Games</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2">Week</th>
                        <th className="p-2">Opp</th>
                        <th className="p-2">Pass Yds</th>
                        <th className="p-2">Pass TD</th>
                        <th className="p-2">INT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playerData.recentGames.map((g) => (
                        <tr key={g.week}>
                          <td className="p-2">{g.week}</td>
                          <td className="p-2">{g.opponent}</td>
                          <td className="p-2">{g.passYards}</td>
                          <td className="p-2">{g.passTD}</td>
                          <td className="p-2">{g.interceptions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Fantasy Points Trend</h3>
            <canvas id="fantasyChart" className="w-full h-64"></canvas>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
