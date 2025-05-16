'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function FantasyDashboard() {
  const [teams, setTeams] = useState([])
  const [recentActivity, setActivity] = useState([])
  const [waiverWire, setWaiverWire] = useState([])
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    fetch('/data/sampleFantasyData.json')
      .then(res => res.json())
      .then(data => {
        setTeams(data.teams)
        setActivity(data.recentActivity)
        setWaiverWire(data.waiverWire)
        setTransactions(data.transactions)
      })
      .catch(err => console.error('Failed to load fantasy data:', err))
  }, [])

  const userTeam = teams.find(t => t.name === 'Thunder Cats') || {}

  // Compute the four scoring extremes once teams load
  const scoringExtremes = useMemo(() => {
    if (!teams.length) return null

    let maxOverall = { name: '', points: -Infinity }
    let minOverall = { name: '', points: Infinity }
    let maxLoss    = { name: '', points: -Infinity }
    let minWin     = { name: '', points: Infinity }

    teams.forEach(team => {
      const games = team.games || []
      // Total season points
      const totalPoints = games.reduce((sum, g) => sum + (g.pointsScored || 0), 0)

      if (totalPoints > maxOverall.points) maxOverall = { name: team.name, points: totalPoints }
      if (totalPoints < minOverall.points) minOverall = { name: team.name, points: totalPoints }

      games.forEach(g => {
        if (g.result === 'L' && g.pointsScored > maxLoss.points) maxLoss = { name: team.name, points: g.pointsScored }
        if (g.result === 'W' && g.pointsScored < minWin.points)  minWin  = { name: team.name, points: g.pointsScored }
      })
    })

    return { maxOverall, minOverall, maxLoss, minWin }
  }, [teams])

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="bg-white rounded-lg shadow p-6 space-y-2">
            <ul className="space-y-2">
              <li><Link href="/fantasy" className="block p-2 rounded text-red-600 bg-gray-100 font-semibold">Dashboard</Link></li>
              <li><Link href="/fantasy/my-team" className="block p-2 rounded hover:text-red-600 hover:bg-gray-100">My Team</Link></li>
              <li><Link href="/fantasy/current-matchup" className="block p-2 rounded hover:text-red-600 hover:bg-gray-100">Current Matchup</Link></li>
              <li><Link href="/fantasy/league-schedule" className="block p-2 rounded hover:text-red-600 hover:bg-gray-100">League Schedule</Link></li>
              <li><Link href="/fantasy/player-stats" className="block p-2 rounded hover:text-red-600 hover:bg-gray-100">Player Stats</Link></li>
              <li><Link href="/fantasy/free-agent-listings" className="block p-2 rounded hover:text-red-600 hover:bg-gray-100">Free Agents</Link></li>
              <li><Link href="/fantasy/trade-center" className="block p-2 rounded hover:text-red-600 hover:bg-gray-100">Trade Center</Link></li>
              <li><Link href="/fantasy/draft-review" className="block p-2 rounded hover:text-red-600 hover:bg-gray-100">Draft Review</Link></li>
            </ul>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Fantasy Dashboard - Week 10</h1>

            {/* … your existing Team Summary, Recent Activity, Waiver Wire, Transactions … */}

            {/* Scoring Extremes */}
            {scoringExtremes && (
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Scoring Extremes</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>
                    Most points overall:&nbsp;
                    <strong>{scoringExtremes.maxOverall.name}</strong> (
                    {scoringExtremes.maxOverall.points})
                  </li>
                  <li>
                    Fewest points overall:&nbsp;
                    <strong>{scoringExtremes.minOverall.name}</strong> (
                    {scoringExtremes.minOverall.points})
                  </li>
                  <li>
                    Most points in a loss:&nbsp;
                    <strong>{scoringExtremes.maxLoss.name}</strong> (
                    {scoringExtremes.maxLoss.points})
                  </li>
                  <li>
                    Fewest points in a win:&nbsp;
                    <strong>{scoringExtremes.minWin.name}</strong> (
                    {scoringExtremes.minWin.points})
                  </li>
                </ul>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
