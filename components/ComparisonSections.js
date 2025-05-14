// File: components/ComparisonSections.js

import { useEffect, useState } from 'react'
import CompareBarChart from './charts/CompareBarChart'

export default function ComparisonSections({ players = [], metrics = [], viewMode = 'weekly' }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!players.length) return

    async function fetchComparisonStats() {
      setLoading(true)
      try {
        const res = await fetch('/.netlify/functions/getComparisonStats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerIds: players, viewMode })
        })
        const result = await res.json()
        setData(result)
      } catch (err) {
        console.error('Error loading comparison data:', err)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchComparisonStats()
  }, [players, viewMode])

  const getStatValue = (playerId, metric) => {
    const player = data.find(p => p.player_id === playerId)
    if (!player) return '—'
    return player[metric] ?? '—'
  }

  return (
    <div className="container mx-auto px-6 mt-4">
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {viewMode === 'weekly' && 'Weekly Stats'}
          {viewMode === 'season' && 'Season Overview'}
          {viewMode === 'career' && 'Career Breakdown'}
        </h3>

        {loading ? (
          <p className="text-gray-500">Loading comparison data...</p>
        ) : players.length === 0 ? (
          <p className="text-gray-500">No players selected.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Metric</th>
                    {players.map((p, i) => (
                      <th key={i} className="p-2">{p || `Player ${i + 1}`}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric) => (
                    <tr key={metric} className="border-t">
                      <td className="p-2 font-medium text-gray-700">{metric}</td>
                      {players.map((pid, i) => (
                        <td key={i} className="p-2 text-gray-700">{getStatValue(pid, metric)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {metrics.includes('tds') && (
              <CompareBarChart data={data} stat="tds" label="Touchdowns" />
            )}
          </>
        )}
      </div>
    </div>
  )
}
