import { useEffect } from 'react'
import Chart from 'chart.js/auto'

export default function BettingChart({ trends }) {
  useEffect(() => {
    const ctx = document.getElementById('bettingChart')
    if (!ctx) return

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: trends.map(t => t.label),
        datasets: [{
          label: 'Hit Rate (%)',
          data: trends.map(t => t.hitRate),
          backgroundColor: '#DC2626'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, max: 100 }
        }
      }
    })
  }, [trends])

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-xl font-semibold mb-4">Top Betting Trends</h3>
      <canvas id="bettingChart" className="w-full h-64"></canvas>
    </div>
  )
}
