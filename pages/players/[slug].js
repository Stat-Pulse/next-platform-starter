'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function PlayerProfile() {
  const router = useRouter()
  const { slug } = router.query
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)

  // Utility: convert a name to slug format
  const generateSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  useEffect(() => {
    if (!slug) return

    const fetchData = async () => {
      try {
        const res = await fetch('/data/rb.json')
        const rbData = await res.json()

        // Flatten into a single player list
        const players = []
        rbData.forEach((team) => {
          if (team.starter) {
            players.push({
              ...team.starter,
              slug: generateSlug(team.starter.name),
              team: team.team,
              position: 'RB',
              depth: 'Starter',
              notes: team.notes || ''
            })
          }
          if (team.backup) {
            players.push({
              ...team.backup,
              slug: generateSlug(team.backup.name),
              team: team.team,
              position: 'RB',
              depth: 'Backup'
            })
          }
        })

        const match = players.find((p) => p.slug === slug)
        setPlayer(match || null)
      } catch (err) {
        console.error('Error loading player data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
        <main className="p-6 text-center text-red-600">
          Player not found. Please check the URL or go back to the player search page.
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-8">
          <h1 className="text-3xl font-bold text-gray-800">{player.name}</h1>
          <div className="bg-white p-6 rounded shadow space-y-4 text-sm text-gray-700">
            <p><strong>Team:</strong> {player.team}</p>
            <p><strong>Position:</strong> {player.position}</p>
            <p><strong>Age:</strong> {player.age}</p>
            <p><strong>Depth Chart:</strong> {player.depth}</p>
            {player.notes && (
              <div className="bg-gray-50 p-3 rounded border">
                <p><strong>Notes:</strong> {player.notes}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
