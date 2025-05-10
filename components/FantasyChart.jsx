'use client'

import { useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'

export default function FantasyChart({ data }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    // Destroy previous chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => `Week ${i + 1}`),
        datasets: [
          {
            label: 'Fantasy Points',
            data,
            borderColor: '#DC2626',
            backgroundColor: 'rgba(220,38,38,0.1)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })

    // Clean up on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Fantasy Points Trend</h3>
      <div className="relative h-64">
        <canvas ref={canvasRef} id="fantasyChart"></canvas>
      </div>
    </div>
  )
}
