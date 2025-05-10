import { useEffect } from 'react'
import Chart from 'chart.js/auto'

export default function FantasyChart({ data }) {
  useEffect(() => {
    const ctx = document.getElementById('fantasyChart')
    if (!ctx) return

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => `Week ${i + 1}`),
        datasets: [{
          label: 'Fantasy Points',
          data: data,
          borderColor: '#DC2626',
          fill: false,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    })
  }, [data])

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Fantasy Points Trend</h3>
      <canvas id="fantasyChart" className="w-full h-64"></canvas>
    </div>
  )
}
