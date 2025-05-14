'use client'

import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SidebarNavigation from '../components/SidebarNavigation'
import SectionWrapper from '../components/SectionWrapper'

export default function GamesPage() {
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
        console.error('Failed to load games:', err)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <SidebarNavigation active="games" />
          </aside>

          <div className="md:col-span-3 space-y-12">
            <SectionWrapper title="2024 NFL Games">
              {loading ? (
                <p className="text-gray-600">Loading games...</p>
              ) : (
                <ul className="divide-y divide-gray-300">
                  {games.map((game) => (
                    <li key={game.game_id} className="py-3">
                      <strong>Week {game.week}</strong> — {game.game_date} <br />
                      Home Team ID: {game.home_team_id} ({game.home_score}) vs. Away Team ID: {game.away_team_id} ({game.away_score})<br />
                      Stadium: {game.stadium_name}
                    </li>
                  ))}
                </ul>
              )}
            </SectionWrapper>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
