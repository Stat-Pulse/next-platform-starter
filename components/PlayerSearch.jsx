// components/PlayerSearch.jsx
import { useState, useEffect } from 'react'
import Link from 'next/link'

// List of positions for filter dropdown
const positionOptions = [
  '', 'QB', 'RB', 'WR', 'TE', 'S', 'DB', 'DE', 'DL', 'DT', 'EDG',
  'FB', 'G', 'LB', 'LS', 'OL', 'OT', 'PK', 'P', 'C', 'CB', 'OE'
]

export default function PlayerSearch() {
  const [players, setPlayers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
  const [teamFilter, setTeamFilter] = useState('')
  const [teams, setTeams] = useState([])

  useEffect(() => {
    async function loadPlayers() {
      try {
        // TODO: adjust file paths to your actual JSON files
        // Example: fetch('/data/2024_qbs_sorted.json') etc.
        const fallback = [
          { name: 'Patrick Mahomes', position: 'QB', team: 'Chiefs' },
          { name: 'Josh Allen', position: 'QB', team: 'Bills' }
        ]
        // Temporarily use fallback until real data is wired up
        setPlayers(fallback)
        setFiltered(fallback)
        setTeams([...new Set(fallback.map(p => p.team))])
      } catch (err) {
        console.error('Error loading players:', err)
      }
    }
    loadPlayers()
  }, [])

  useEffect(() => {
    let result = players
    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (positionFilter) {
      result = result.filter(p => p.position === positionFilter)
    }
    if (teamFilter) {
      result = result.filter(p => p.team === teamFilter)
    }
    setFiltered(result)
  }, [search, positionFilter, teamFilter, players])

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-6">
        <div id="search-container" className="mb-6">
          <input
            type="search"
            placeholder="Search Players"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="flex space-x-4 mt-2">
            <select
              value={positionFilter}
              onChange={e => setPositionFilter(e.target.value)}
              className="p-2 border rounded"
            >
              {positionOptions.map(pos => (
                <option key={pos} value={pos}>{pos || 'All Positions'}</option>
              ))}
            </select>
            <select
              value={teamFilter}
              onChange={e => setTeamFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All Teams</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>
        <div id="player-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(player => (
            <div key={player.name} className="player-card bg-white p-4 rounded shadow">
              <Link href={`/player/${encodeURIComponent(player.name)}`}>
                <a className="text-blue-600 hover:underline">
                  {player.name}
                </a>
              </Link>
              <p className="text-gray-600">{player.position}, {player.team}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-gray-600 text-center py-4">No players found.</p>
          )}
        </div>
      </div>
    </section>
  )
}
