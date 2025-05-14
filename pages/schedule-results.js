'use client'

import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function ScheduleResults() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/.netlify/functions/getGames')
      .then(res => res.json())
      .then(data => {
        setGames(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading schedule:', err)
        setLoading(false)
      })
  }, [])

  const today = new Date()

  // Group games by week
  const gamesByWeek = games.reduce((acc, game) => {
    acc[game.week] = acc[game.week] || []
    acc[game.week].push(game)
    return acc
  }, {})

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">2024 Schedule & Results</h1>

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
                        const gameDate = new Date(game.game_date)
                        const isPast = gameDate < today
                        return (
                          <tr key={game.game_id}>
                            <td className="p-2">{game.game_date}</td>
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
