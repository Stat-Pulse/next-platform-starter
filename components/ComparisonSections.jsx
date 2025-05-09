// components/ComparisonSections.jsx
import { useEffect } from 'react'
import Chart from 'chart.js/auto'

export default function ComparisonSections({ players, metrics }) {
  useEffect(() => {
    players.forEach((player, idx) => {
      const canvas = document.getElementById(`fantasyPointsChart-${idx}`)
      if (!canvas) return
      new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: { /* …line chart config… */ },
        options: { responsive: true }
      })
    })
  }, [players, metrics])

  if (players.length < 2) {
    return (
      <section className="py-12 bg-white">
        <p className="text-gray-600 text-center">Select at least 2 players to compare.</p>
      </section>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 space-y-12">
        {/* Core Information grid */}
        {/* Recent Game Log table */}
        {/* Fantasy Points Trend charts (canvas id={`fantasyPointsChart-${idx}`}) */}
        {/* Analyst Commentary */}
      </div>
    </section>
  )
}
