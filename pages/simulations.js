'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import teams from '../data/teams'

export default function Simulations() {
  const [teamA, setTeamA] = useState('')
  const [teamB, setTeamB] = useState('')
  const [result, setResult] = useState(null)

  const simulateGame = () => {
    if (teamA && teamB && teamA !== teamB) {
      const scoreA = Math.floor(Math.random() * 30) + 10
      const scoreB = Math.floor(Math.random() * 30) + 10
      const winner = scoreA > scoreB ? teamA : teamB
      setResult(`${teamA} ${scoreA} — ${teamB} ${scoreB} → ${winner} wins`)
    } else {
      setResult('Please select two different teams.')
    }
  }

  const teamOptions = teams.map((team) => ({
    name: team.name,
    slug: team.slug
  }))

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Simulations</h1>

          <div className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Select Teams</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <select
                className="p-2 border rounded"
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
              >
                <option value="">-- Select Team A --</option>
                {teamOptions.map((team) => (
                  <option key={team.slug} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>

              <select
                className="p-2 border rounded"
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
              >
                <option value="">-- Select Team B --</option>
                {teamOptions.map((team) => (
                  <option key={team.slug} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
              onClick={simulateGame}
            >
              Simulate Game
            </button>

            {result && (
              <p className="mt-4 text-gray-700 text-lg font-medium">{result}</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
