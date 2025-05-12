'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState } from 'react'

export default function Simulations() {
  const [result, setResult] = useState(null)

  const simulateGame = () => {
    setResult('Simulation: Bengals 27, Chiefs 24')
  }

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Simulations</h1>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Run Game Simulation</h2>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={simulateGame}
            >
              Simulate Week 1 Matchup
            </button>
            {result && <p className="mt-4 text-gray-600">{result}</p>}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
