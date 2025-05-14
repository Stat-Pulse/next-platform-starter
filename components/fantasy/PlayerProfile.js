'use client'

import { useEffect, useState } from 'react'

export default function PlayerProfile({ playerId }) {
  const [player, setPlayer] = useState(null)
  const [gameLogs, setGameLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!playerId) return

    async function fetchPlayerAndLogs() {
      try {
        const [playerRes, logsRes] = await Promise.all([
          fetch(`/.netlify/functions/getPlayerDetails?player_id=${playerId}`),
          fetch(`/.netlify/functions/getPlayerGameLogs?player_id=${playerId}`)
        ])

        const playerData = await playerRes.json()
        const logsData = await logsRes.json()

        setPlayer(playerData)
        setGameLogs(logsData)
        setLoading(false)
      } catch (err) {
        console.error('Failed to load player or game logs:', err)
        setError(true)
        setLoading(false)
      }
    }

    fetchPlayerAndLogs()
  }, [playerId])

  if (!playerId) return <p className="text-red-500 p-4">No player selected</p>
  if (loading) return <p className="text-gray-600 p-4">Loading player data...</p>
  if (error || !player) return <p className="text-red-500 p-4">Failed to load player info.</p>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex items-center gap-6 mb-6">
        <img
          src={player.headshot_url || '/default-headshot.png'}
          alt={player.player_name}
          className="w-24 h-24 object-cover rounded-full border"
        />
        <div>
          <h1 className="text-2xl font-bold mb-1">{player.player_name}</h1>
          <p className="text-sm text-gray-500">
            {player.position} — {player.team_id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-8">
        <p><strong>Age:</strong> {player.age}</p>
        <p><strong>Date of Birth:</strong> {player.date_of_birth}</p>
        <p><strong>College:</strong> {player.college}</p>
        <p><strong>Draft Year:</strong> {player.draft_year}</p>
        <p><strong>Status:</strong> {player.is_active ? 'Active' : 'Inactive'}</p>
        <p><strong>Height:</strong> {player.height_inches} in</p>
        <p><strong>Weight:</strong> {player.weight} lbs</p>
      </div>

      {gameLogs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Recent Games</h2>
          <table className="w-full text-sm bg-white rounded shadow overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Week</th>
                <th className="p-2 text-left">Team</th>
                <th className="p-2 text-left">Opponent</th>
                <th className="p-2 text-left">Fantasy PPR</th>
                <th className="p-2 text-left">Receptions</th>
                <th className="p-2 text-left">Yards</th>
                <th className="p-2 text-left">TDs</th>
              </tr>
            </thead>
            <tbody>
              {gameLogs.map((log, i) => (
                <tr key={i}>
                  <td className="p-2">{log.week}</td>
                  <td className="p-2">{log.team}</td>
                  <td className="p-2">{log.opponent}</td>
                  <td className="p-2">{log.fantasy_points_ppr}</td>
                  <td className="p-2">{log.receptions}</td>
                  <td className="p-2">{log.yards}</td>
                  <td className="p-2">{log.tds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
