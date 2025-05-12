// components/PlayerSearch.jsx
import { useState, useEffect } from 'react'
import Link from 'next/link'

const positionOptions = [
  '', 'QB', 'RB', 'WR', 'TE', 'S', 'DB', 'DE', 'DL', 'DT', 'EDG',
  'FB', 'G', 'LB', 'LS', 'OL', 'OT', 'PK', 'P', 'C', 'CB', 'OE'
]

function slugify(name) {
  return name.toLowerCase().replace(/\./g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function PlayerSearch() {
  const [players, setPlayers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
  const [teamFilter, setTeamFilter] = useState('')
  const [teams, setTeams] = useState([])

  useEffect(() => {
    async function loadAllPlayers() {
      try {
        const files = [
          '/data/2024_qbs_sorted.json',
          '/data/2024_rbs_sorted.json',
          '/data/2024_wrs_sorted.json',
          '/data/2024_tes_sorted.json'
        ]

        const all = await Promise.all(files.map(path => fetch(path).then(r => r.json())))
        const merged = all.flat().map(p => ({
          name: p.display_name || p.name || 'Unknown',
          position: p.position || 'N/A',
          team: p.recent_team || p.team || 'N/A',
          slug: slugify(p.display_name || p.name || '')
        }))

        setPlayers(merged)
        setFiltered(merged)
        setTeams([...new Set(merged.map(p => p.team).filter(Boolean))])
      } catch (e) {
        console.error('Error loading player data:', e)
      }
    }

    loadAllPlayers()
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
        <div id="search-container" className="mb-6 space-y-3">
          <input
            type="search"
            placeholder="Search Players"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full p-2 border rounded"
            onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
          />
          <div className="flex flex-wrap space-x-4">
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
            <div key={player.slug} className="player-card bg-white p-4 rounded shadow">
              <Link href={`/players/${player.slug}`} className="text-blue-600 hover:underline">
                {player.name}
              </Link>
              <p className="text-gray-600 text-sm">{player.position}, {player.team}</p>
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
