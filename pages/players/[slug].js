'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

// Dummy contract and fantasy trend
const dummyContract = {
  year: 'Year 3 of 5',
  baseSalary: '$30,000,000',
  capHit: '$52,000,000',
  signingBonus: '$22,000,000',
  capPercent: '17.2%',
  deadMoney: '$55,921,569',
  capSavings: '$12,464,214'
}
const dummyFantasyTrend = [21.8, 17.6, 24.1, 22.4, 19.3]

export default function PlayerProfile() {
  const router = useRouter()
  const { slug } = router.query
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)

  const generateSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const loadData = async () => {
    const paths = [
      '/data/2024_qbs_sorted.json',
      '/data/2024_rbs_sorted.json',
      '/data/2024_tes_sorted.json'
    ]

    let allPlayers = []

    for (const path of paths) {
      try {
        const res = await fetch(path)
        const data = await res.json()
        const withSlugs = data.map(p => ({
          ...p,
          slug: generateSlug(p.display_name)
        }))
        allPlayers = [...allPlayers, ...withSlugs]
      } catch (e) {
        console.error(`Failed to load ${path}`, e)
      }
    }

    const found = allPlayers.find(p => p.slug === slug)
    setPlayer(found || null)
    setLoading(false)
  }

  useEffect(() => {
    if (slug) loadData()
  }, [slug])

  if (loading) {
    return (
      <>
        <Header />
        <main className="p-6 text-center text-gray-500">Loading profile...</main>
        <Footer />
      </>
    )
  }

  if (!player) {
    return (
      <>
        <Header />
        <main className="p-6 text-center text-red-600">Player not found.</main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-8">
          <h1 className="text-3xl font-bold text-gray-800">{player.display_name}</h1>

          {/* Player Metadata */}
          <div className="bg-white p-6 rounded shadow text-sm space-y-2 text-gray-700">
            <p><strong>Position:</strong> {player.position}</p>
            <p><strong>Age:</strong> {player.age}</p>
            <p><strong>Team:</strong> {player.team || player.recent_team || 'N/A'}</p>
          </div>

          {/* Position-Specific Stats */}
          <div className="bg-white p-6 rounded shadow space-y-3">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">2024 Stats</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
              {player.position === 'QB' && (
                <>
                  <li><strong>Passing Yards:</strong> {player.passing_yards}</li>
                  <li><strong>TDs:</strong> {player.passing_tds}</li>
                  <li><strong>INTs:</strong> {player.interceptions}</li>
                  <li><strong>Sacks:</strong> {player.sacks}</li>
                  <li><strong>Rush Yards:</strong> {player.rushing_yards}</li>
                  <li><strong>Fantasy Points (PPR):</strong> {player.fantasy_points_ppr}</li>
                </>
              )}
              {player.position === 'RB' && (
                <>
                  <li><strong>Rush Yards:</strong> {player.rushing_yards}</li>
                  <li><strong>Rush TDs:</strong> {player.rushing_tds}</li>
                  <li><strong>Receptions:</strong> {player.receptions}</li>
                  <li><strong>Rec Yards:</strong> {player.receiving_yards}</li>
                  <li><strong>Fantasy Points (PPR):</strong> {player.fantasy_points_ppr}</li>
                </>
              )}
              {player.position === 'TE' && (
                <>
                  <li><strong>Receptions:</strong> {player.receptions}</li>
                  <li><strong>Rec Yards:</strong> {player.receiving_yards}</li>
                  <li><strong>TDs:</strong> {player.receiving_tds}</li>
                  <li><strong>Fantasy Points (PPR):</strong> {player.fantasy_points_ppr}</li>
                </>
              )}
            </ul>
          </div>

          {/* Fantasy Trends */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Fantasy Trend (Last 5 Weeks)</h2>
            <ul className="flex space-x-4 text-sm text-gray-700">
              {dummyFantasyTrend.map((pts, idx) => (
                <li key={idx}>Week {idx + 1}: {pts} pts</li>
              ))}
            </ul>
          </div>

          {/* Contract Info */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Contract Details</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
              <li><strong>Year:</strong> {dummyContract.year}</li>
              <li><strong>Base Salary:</strong> {dummyContract.baseSalary}</li>
              <li><strong>Cap Hit:</strong> {dummyContract.capHit}</li>
              <li><strong>Signing Bonus:</strong> {dummyContract.signingBonus}</li>
              <li><strong>Cap %:</strong> {dummyContract.capPercent}</li>
              <li><strong>Dead Money:</strong> {dummyContract.deadMoney}</li>
              <li><strong>Cap Savings:</strong> {dummyContract.capSavings}</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
