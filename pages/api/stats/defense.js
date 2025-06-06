// pages/league/defense.js
import { useEffect, useState } from 'react'

export default function DefensiveStatsPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats/defense')
        const stats = await res.json()
        setData(stats)
      } catch (error) {
        console.error('Failed to load defensive stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <div className="p-8 text-center">Loading defensive stats...</div>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">2024 Defensive Stats</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Player</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Team</th>
              <th className="px-4 py-2">Sacks</th>
              <th className="px-4 py-2">QB Hits</th>
              <th className="px-4 py-2">Tackles</th>
              <th className="px-4 py-2">TFL</th>
              <th className="px-4 py-2">INT</th>
              <th className="px-4 py-2">Pass Def</th>
              <th className="px-4 py-2">TDs</th>
            </tr>
          </thead>
          <tbody>
            {data.map((player, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{player.player_name}</td>
                <td className="px-4 py-2">{player.position}</td>
                <td className="px-4 py-2">{player.team}</td>
                <td className="px-4 py-2">{player.sacks}</td>
                <td className="px-4 py-2">{player.qb_hits}</td>
                <td className="px-4 py-2">{player.tackles}</td>
                <td className="px-4 py-2">{player.tfl}</td>
                <td className="px-4 py-2">{player.interceptions}</td>
                <td className="px-4 py-2">{player.pass_defended}</td>
                <td className="px-4 py-2">{player.def_tds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}