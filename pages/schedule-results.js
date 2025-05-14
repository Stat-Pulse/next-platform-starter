'use client'

import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'

export default function ScheduleResults() {
  const [games, setGames] = useState([])
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  const [season, setSeason] = useState('2024')
  const [selectedTeam, setSelectedTeam] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState('')

  useEffect(() => {
    const query = new URLSearchParams({
      season,
      ...(selectedPlayer && { player: selectedPlayer })
    }).toString()

    setLoading(true)
    fetch(`/.netlify/functions/getGames?${query}`)
      .then(res => res.json())
      .then(data => {
        setGames(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading schedule:', err)
        setLoading(false)
      })
  }, [season, selectedPlayer])

  // Load player list separately
  useEffect(() => {
    fetch('/.netlify/functions/getPlayers')
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error('Failed to load players:', err))
  }, [])

  const today = new Date()

  const filteredGames = selectedTeam
    ? games.filter(
        g => g.home_team_name === selectedTeam || g.away_team_name === selectedTeam
      )
    : games

  const gamesByWeek = filteredGames.reduce((acc, game) => {
    acc[game.week] = acc[game.week] || []
    acc[game.week].push(game)
    return acc
  }, {})

  const allTeams = Array.from(
    new Set(games.flatMap(g => [g.home_team_name, g.away_team_name]))
  ).sort()

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Schedule & Results</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Season Selector */}
            <div>
              <label htmlFor="season" className="block mb-1 text-gray-700 font-medium">Season</label>
              <select
                id="season"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="2024">2024</option>
              </select>
            </div>

            {/* Team Filter */}
            <div>
              <label htmlFor="team-filter" className="block mb-1 text-gray-700 font-medium">Filter by Team</label>
              <select
                id="team-filter"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">All Teams</option>
                {allTeams.map((team) => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>

            {/* Player Filter */}
            <div>
              <label htmlFor="player-filter" className="block mb-1 text-gray-700 font-medium">Filter by Player</label>
              <select
                id="player-filter"
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">All Players</option>
                {players.map((p) => (
                  <option key={p.player_id} value={p.player_id}>{p.player_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* View Profile Link */}
          {selectedPlayer && (
            <div className="text-right mt-2">
              <Link
                href={`/player-stats?player_id=${selectedPlayer}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View Full Profile →
              </Link>
            </div>
          )}

          {/* Schedule Table */}
          {loading ? (
            <p className="text-gray-600">Loading schedule...</p>
          ) : (
            Object.keys(gamesByWeek).map(week => (
              <div key={week} className="mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Week {week}</h2>
                <div className="bg-white p-4 rounded shadow overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Matchup</th>
                        <th className="p-2 text-left">Result</th>
                        <th className="p-2 text-left">Stadium</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gamesByWeek[week].map(game => {
                        const gameDate = new Date(`${game.game_date}T${game.game_time || '00:00:00'}`)
                        const isPast = gameDate < today

                        const formattedDate = gameDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })

                        const formattedTime = game.game_time
                          ? gameDate.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              timeZone: 'America/Chicago',
                            })
                          : null

                        return (
                          <tr key={game.game_id}>
                            <td className="p-2">
                              {formattedDate}
                              {formattedTime && (
                                <span className="block text-xs text-gray-500">{formattedTime} CST</span>
                              )}
                            </td>
                            <td className="p-2">{game.home_team_name} vs {game.away_team_name}</td>
                            <td className="p-2">
                              {game.home_score !== null && game.away_score !== null ? (
                                <span className={isPast ? "text-green-600 font-medium" : "text-gray-500"}>
                                  {game.home_score} - {game.away_score}
                                </span>
                              ) : (
                                <span className="text-gray-500">Scheduled</span>
                              )}
                            </td>
                            <td className="p-2">{game.stadium_name}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
