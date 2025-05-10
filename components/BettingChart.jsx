'use client'

import { useEffect, useRef } from 'react'
import { Chart } from 'chart.js/auto'

export default function BettingChart({ trends }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    // Clean up existing chart instance
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: trends.map(t => t.label),
        datasets: [
          {
            label: 'Hit Rate (%)',
            data: trends.map(t => t.hitRate),
            backgroundColor: '#DC2626'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: value => `${value}%`
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: context => `${context.parsed.y}% hit rate`
            }
          }
        }
      }
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [trends])

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Betting Trends</h3>
      <div className="relative h-64">
        <canvas ref={canvasRef} id="bettingChart"></canvas>
      </div>
    </div>
  )
}
