// pages/stat-tracker.js
'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'

export default function StatTracker() {
  const passingLeaders = [
    { player: 'Joe Burrow', team: 'CIN', yds: 4918, td: 36, int: 9 },
    { player: 'Patrick Mahomes', team: 'KC', yds: 4800, td: 34, int: 10 },
    { player: 'Josh Allen', team: 'BUF', yds: 4600, td: 30, int: 14 }
  ]

  const rushingLeaders = [
    { player: 'Saquon Barkley', team: 'NYG', yds: 2000, td: 15 },
    { player: 'Bijan Robinson', team: 'ATL', yds: 1456, td: 12 },
    { player: 'Derrick Henry', team: 'TEN', yds: 1422, td: 13 }
  ]

  const receivingLeaders = [
    { player: 'Ja\'Marr Chase', team: 'CIN', yds: 1708, td: 14 },
    { player: 'Justin Jefferson', team: 'MIN', yds: 1533, td: 11 },
    { player: 'Brian Thomas Jr.', team: 'JAX', yds: 1282, td: 10 }
  ]

  const defenseLeaders = [
    { player: 'Trey Hendrickson', team: 'CIN', sacks: 17.5, tackles: 59 },
    { player: 'Myles Garrett', team: 'CLE', sacks: 14, tackles: 62 },
    { player: 'Micah Parsons', team: 'DAL', sacks: 12, tackles: 70 }
  ]

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-12">
          <section>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">NFL Stat Tracker</h1>
            <p className="text-gray-600 mb-6">Track top performers across the league in every major category.</p>
          </section>

          {/* Passing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">🏈 Passing Leaders</h2>
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Player</th>
                    <th className="p-2">Team</th>
                    <th className="p-2">Yards</th>
                    <th className="p-2">TD</th>
                    <th className="p-2">INT</th>
                  </tr>
                </thead>
                <tbody>
                  {passingLeaders.map((p, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2 text-red-600 hover:underline"><a href={`/players/${p.player.toLowerCase().replace(/ /g, '-')}`}>{p.player}</a></td>
                      <td className="p-2">{p.team}</td>
                      <td className="p-2">{p.yds}</td>
                      <td className="p-2">{p.td}</td>
                      <td className="p-2">{p.int}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Rushing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">🏃 Rushing Leaders</h2>
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Player</th>
                    <th className="p-2">Team</th>
                    <th className="p-2">Yards</th>
                    <th className="p-2">TD</th>
                  </tr>
                </thead>
                <tbody>
                  {rushingLeaders.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2 text-red-600 hover:underline"><a href={`/players/${r.player.toLowerCase().replace(/ /g, '-')}`}>{r.player}</a></td>
                      <td className="p-2">{r.team}</td>
                      <td className="p-2">{r.yds}</td>
                      <td className="p-2">{r.td}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Receiving */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">🎯 Receiving Leaders</h2>
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Player</th>
                    <th className="p-2">Team</th>
                    <th className="p-2">Yards</th>
                    <th className="p-2">TD</th>
                  </tr>
                </thead>
                <tbody>
                  {receivingLeaders.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2 text-red-600 hover:underline"><a href={`/players/${r.player.toLowerCase().replace(/ /g, '-')}`}>{r.player}</a></td>
                      <td className="p-2">{r.team}</td>
                      <td className="p-2">{r.yds}</td>
                      <td className="p-2">{r.td}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Defense */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">🛡️ Defensive Leaders</h2>
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Player</th>
                    <th className="p-2">Team</th>
                    <th className="p-2">Sacks</th>
                    <th className="p-2">Tackles</th>
                  </tr>
                </thead>
                <tbody>
                  {defenseLeaders.map((d, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2 text-red-600 hover:underline"><a href={`/players/${d.player.toLowerCase().replace(/ /g, '-')}`}>{d.player}</a></td>
                      <td className="p-2">{d.team}</td>
                      <td className="p-2">{d.sacks}</td>
                      <td className="p-2">{d.tackles}</td>
                    </tr>
                  ))}
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
