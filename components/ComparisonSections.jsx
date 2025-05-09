// components/ComparisonSections.jsx
import { useEffect } from 'react'
import Chart from 'chart.js/auto'

export default function ComparisonSections({ players, metrics }) {
  useEffect(() => {
    // Fantasy Points Trend Charts
    players.forEach((player, idx) => {
      const canvas = document.getElementById(`fantasyPointsChart-${idx}`)
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Week 1','Week 2','Week 3','Week 4','Week 5'],
          datasets: [{
            label: player.name,
            data: player.fantasy.pointsHistory,
            borderColor: `hsl(${idx * 60}deg, 70%, 50%)`,
            fill: false,
          }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      })
    })

    // Heatmap & Matchup charts omitted for brevity
  }, [players, metrics])

  if (players.length < 2) {
    return (
      <section id="comparisonContainer" className="py-12 bg-white">
        <p className="text-gray-600 text-center">Select at least 2 players to compare.</p>
      </section>
    )
  }

  return (
    <section id="comparisonContainer" className="py-12 bg-white">
      <div className="container mx-auto px-6 space-y-12">
        {/* Core Information */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Core Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {players.map(player => (
              <div key={player.name} className="bg-gray-100 p-6 rounded-lg shadow">
                <h4 className="text-xl font-semibold text-gray-700 mb-2">{player.name}</h4>
                <p className="text-gray-600">{player.position} | {player.team} | #{player.jersey}</p>
                <p className="text-gray-600"><strong>Upcoming:</strong> {player.upcomingGame}</p>
                <p className="text-gray-600"><strong>Bye:</strong> {player.byeWeek}</p>
                <p className="text-gray-600"><strong>Injury:</strong> <span className={player.injuryStatus === 'Healthy' ? 'text-green-600' : 'text-red-600'}>{player.injuryStatus}</span></p>
                <a href={`/insights?player=${encodeURIComponent(player.name)}`} className="text-red-600 hover:underline">View Full Insights</a>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Game Log */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Game Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Player</th>
                  <th className="p-2">Week</th>
                  <th className="p-2">Opp</th>
                  {/* Add conditional headers based on position */}
                  <th className="p-2">Stat 1</th>
                  <th className="p-2">Stat 2</th>
                  <th className="p-2">Stat 3</th>
                </tr>
              </thead>
              <tbody>
                {players.flatMap(player => player.recentGames.slice(0,3).map((game, i) => (
                  <tr key={player.name + i}>
                    <td className="p-2">{player.name}</td>
                    <td className="p-2">{game.week}</td>
                    <td className="p-2">{game.opponent}</td>
                    {/* Map stats generically */}
                    <td className="p-2">{Object.values(game.stats)[0]}</td>
                    <td className="p-2">{Object.values(game.stats)[1]}</td>
                    <td className="p-2">{Object.values(game.stats)[2]}</td>
                  </tr>
                ))) }
              </tbody>
            </table>
          </div>
        </div>

        {/* Season Stats, Betting, Fantasy, Advanced sections follow similar pattern */}

        {/* Fantasy Points Trend Visualization */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Fantasy Points Trend</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {players.map((player, idx) => (
              <div key={player.name} className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-xl font-semibold text-gray-700 mb-2">{player.name}</h4>
                <canvas id={`fantasyPointsChart-${idx}`} className="w-full h-48"></canvas>
              </div>
            ))}
          </div>
        </div>

        {/* Analyst Commentary */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Analyst Commentary</h3>
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h4 className="text-xl font-semibold mb-4">Comparison Analysis</h4>
            {players.map(player => (
              <p key={player.name} className="text-gray-600 mb-2">
                <strong>{player.name}:</strong> {player.analystNotes}
              </p>
            ))}
            <p className="text-sm text-gray-500 mt-4">By StatPulse Staff • May 6, 2025</p>
          </div>
        </div>
      </div>
    </section>
  )
}
