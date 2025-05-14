'use client'

import { useEffect, useState } from 'react'

export default function PlayerStatsClient({ playerId }) {
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!playerId) return

    fetch(`/.netlify/functions/getPlayerDetails?player_id=${playerId}`)
      .then(res => res.json())
      .then(data => {
        setPlayer(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load player:', err)
        setError(true)
        setLoading(false)
      })
  }, [playerId])

  if (!playerId) return <p className="text-red-500 p-4">No player selected</p>
  if (loading) return <p className="text-gray-600 p-4">Loading player data...</p>
  if (error || !player) return <p className="text-red-500 p-4">Failed to load player info.</p>

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-2">{player.player_name}</h1>
      <p className="text-sm text-gray-500 mb-4">{player.position} — {player.team_id}</p>

      <div className="space-y-2 text-sm">
        <p><strong>Age:</strong> {player.age}</p>
        <p><strong>College:</strong> {player.college}</p>
        <p><strong>Draft Year:</strong> {player.draft_year}</p>
        <p><strong>Status:</strong> {player.is_active ? 'Active' : 'Inactive'}</p>
        <p><strong>Height:</strong> {player.height_inches} in</p>
        <p><strong>Weight:</strong> {player.weight} lbs</p>
        <p><strong>Date of Birth:</strong> {player.date_of_birth}</p>
      </div>
    </div>
  )
}
