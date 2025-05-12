// pages/betting-book.js
'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'

export default function BettingBook() {
  const keyGames = [
    {
      matchup: 'Chiefs @ Bengals',
      spread: 'KC -3.5',
      total: 'O/U 48.5',
      kickoff: 'May 15, 2025 – 4:25 PM EST'
    },
    {
      matchup: 'Cowboys @ Eagles',
      spread: 'PHI -2.0',
      total: 'O/U 46.0',
      kickoff: 'May 15, 2025 – 8:20 PM EST'
    }
  ]

  const lineMovements = [
    {
      game: 'Bills @ Jets',
      opened: 'BUF -1.0',
      current: 'BUF +1.5',
      change: '+2.5'
    },
    {
      game: '49ers @ Rams',
      opened: 'SF -3.0',
      current: 'SF -1.0',
      change: '+2.0'
    }
  ]

  const bettingTrends = [
    {
      team: 'Packers',
      ats: '10-5-1',
      overUnder: '8-8',
      bestBet: 'At Home (6-1 ATS)'
    },
    {
      team: 'Dolphins',
      ats: '11-6',
      overUnder: '12-5',
      bestBet: 'Overs (12-5)'
    }
  ]

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-12">
          <section>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Betting Book</h1>
            <p className="text-gray-600 mb-4">Track NFL betting insights, line movements, and trends.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">📌 Week 1 Key Games & Odds</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {keyGames.map((game, i) => (
                <div key={i} className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-bold text-gray-800">{game.matchup}</h3>
                  <p className="text-sm text-gray-600">Spread: <span className="text-red-600">{game.spread}</span></p>
                  <p className="text-sm text-gray-600">Total: {game.total}</p>
                  <p className="text-sm text-gray-500">Kickoff: {game.kickoff}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">📈 Line Movements</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white text-sm text-left rounded shadow overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Game</th>
                    <th className="p-2">Opening Line</th>
                    <th className="p-2">Current Line</th>
                    <th className="p-2">Movement</th>
                  </tr>
                </thead>
                <tbody>
                  {lineMovements.map((line, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{line.game}</td>
                      <td className="p-2">{line.opened}</td>
                      <td className="p-2">{line.current}</td>
                      <td className="p-2 text-red-600">{line.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">📊 Team Betting Trends</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {bettingTrends.map((team, i) => (
                <div key={i} className="bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-bold text-gray-800">{team.team}</h3>
                  <p className="text-sm text-gray-600">ATS: <strong>{team.ats}</strong></p>
                  <p className="text-sm text-gray-600">Over/Under: {team.overUnder}</p>
                  <p className="text-sm text-gray-500">Best Bet Angle: {team.bestBet}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mt-8">📚 Learn More</h2>
            <p className="text-sm text-gray-600 mt-2">Check back soon for guides on interpreting betting lines, odds calculators, and links to recommended sportsbooks.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
