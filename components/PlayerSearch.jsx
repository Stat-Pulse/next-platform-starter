'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Position dropdown options
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

  const generateSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  useEffect(() => {
    async function loadPlayers() {
      const sources = [
        '/data/2024_qbs_sorted.json',
        '/data/2024_rbs_sorted.json',
        '/data/2024_wrs_sorted.json',
        '/data/2024_tes_sorted.json'
      ]

      let all = []

      for (const src of sources) {
        try {
          const res = await fetch(src)
          const data = await res.json()
          const withSlugs = data.map(p => ({
            name: p.display_name,
            slug: generateSlug(p.display_name),
            position: p.position,
            team: p.team || p.recent_team || 'N/A'
          }))
          all = [...all, ...withSlugs]
        } catch (e) {
          console.error(`Failed to load ${src}`, e)
        }
      }

      setPlayers(all)
      setFiltered(all)
      setTeams([...new Set(all.map(p => p.team))])
    }

    loadPlayers()
  }, [])

  useEffect(() => {
    let result = players

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.team.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q)
      )
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
            <div key={player.slug} className="player-card bg-white p-4 rounded shadow">
              <Link href={`/players/${player.slug}`} className="text-blue-600 hover:underline">
                {player.name}
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