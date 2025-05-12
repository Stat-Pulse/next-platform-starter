'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const injuryData = [
  {
    player: 'Joe Burrow',
    team: 'Bengals',
    position: 'QB',
    injury: 'Wrist',
    status: 'Questionable',
    return: 'Week 6'
  },
  {
    player: 'Justin Jefferson',
    team: 'Vikings',
    position: 'WR',
    injury: 'Hamstring',
    status: 'Out',
    return: 'Week 7'
  },
  {
    player: 'Nick Bosa',
    team: '49ers',
    position: 'DE',
    injury: 'Ankle',
    status: 'Probable',
    return: 'Week 5'
  },
  {
    player: 'Bijan Robinson',
    team: 'Falcons',
    position: 'RB',
    injury: 'Shoulder',
    status: 'Questionable',
    return: 'Week 6'
  }
]

export default function InjuryReportHub() {
  const [teamFilter, setTeamFilter] = useState('All')
  const [positionFilter, setPositionFilter] = useState('All')

  const uniqueTeams = ['All', ...new Set(injuryData.map(p => p.team))]
  const uniquePositions = ['All', ...new Set(injuryData.map(p => p.position))]

  const filteredData = injuryData.filter(player => {
    const teamMatch = teamFilter === 'All' || player.team === teamFilter
    const posMatch = positionFilter === 'All' || player.position === positionFilter
    return teamMatch && posMatch
  })

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Injury Report Hub</h1>

          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Injuries</h2>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <select
                className="p-2 border rounded"
                value={teamFilter}
                onChange={e => setTeamFilter(e.target.value)}
              >
                {uniqueTeams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>

              <select
                className="p-2 border rounded"
                value={positionFilter}
                onChange={e => setPositionFilter(e.target.value)}
              >
                {uniquePositions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Player</th>
                    <th className="p-2">Team</th>
                    <th className="p-2">Position</th>
                    <th className="p-2">Injury</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Return</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((player, idx) => (
                      <tr key={idx}>
                        <td className="p-2">{player.player}</td>
                        <td className="p-2">{player.team}</td>
                        <td className="p-2">{player.position}</td>
                        <td className="p-2">{player.injury}</td>
                        <td className="p-2 text-yellow-700">{player.status}</td>
                        <td className="p-2">{player.return}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-500">No injuries match your filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
