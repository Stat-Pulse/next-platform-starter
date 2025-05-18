import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'

export default function TeamPage() {
  const router = useRouter()
  const { id } = router.query
  const [teamData, setTeamData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
  if (!router.isReady || !id) return
  fetch(`/api/team/${id}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.error) throw new Error(data.error)
      setTeamData(data)
      setLoading(false)
    })
    .catch((err) => {
      console.error(err)
      setError(err.message)
      setLoading(false)
    })
}, [router.isReady, id])

  if (loading) return <div className="p-6 text-center">Loading team data...</div>
  if (error || !teamData) return <div className="p-6 text-center text-red-500">Error: {error}</div>

  const {
  name,
  roster,
  depthChart,
  schedule,
  stats,
  branding,
  recentNews,
  division,
  conference
} = teamData;

  return (
    <>
      <Head><title>{name} - StatPulse</title></Head>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8 border-b pb-4" style={{ borderColor: branding?.colorPrimary || '#ccc' }}>
          <Image src={branding?.logo || '/placeholder.png'} alt={name} width={100} height={100} className="rounded shadow" />
          <div>
            <h1 className="text-3xl font-bold" style={{ color: branding?.colorPrimary }}>{name}</h1>
            <p className="text-gray-600">{conference} | {division} Division</p>
          </div>
        </div>

        {/* Latest News */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2" style={{ color: branding?.colorPrimary }}>Latest News</h2>
          <div className="space-y-2">
            {recentNews.map((news, i) => (
              <div key={i} className="border p-3 rounded shadow-sm bg-white">
                <p className="font-semibold">{news.title}</p>
                <p className="text-xs text-gray-500">{news.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Depth Chart */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2" style={{ color: branding?.colorPrimary }}>Depth Chart</h2>
          {Object.keys(depthChart).length === 0 ? (
            <p className="text-gray-500 italic">Depth chart not available.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(depthChart).map(([position, players]) => (
                <div key={position}>
                  <h3 className="text-lg font-bold">{position}</h3>
                  <ul className="ml-4 list-disc text-sm">
                    {players.map((p, i) => (
                      <li key={i}>
                        {p.name} <span className="text-gray-400">(Depth: {p.depth})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      {/* Full Schedule */}
<div className="mb-10">
  <h2 className="text-xl font-semibold mb-2" style={{ color: branding?.colorPrimary }}>Game Schedule</h2>
  {schedule.length === 0 ? (
    <p className="text-gray-500 italic">No schedule available.</p>
  ) : (
    <table className="w-full text-sm table-auto border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Week</th>
          <th className="border p-2">Opponent</th>
          <th className="border p-2">Date</th>
          <th className="border p-2">Home/Away</th>
          <th className="border p-2">Score</th>
          <th className="border p-2">Result</th>
        </tr>
      </thead>
      <tbody>
        {schedule.map((game, i) => (
          <tr key={i}>
            <td className="border p-2 text-center">{game.week}</td>
            <td className="border p-2 text-center">{game.opponent}</td>
            <td className="border p-2 text-center">{new Date(game.date).toLocaleDateString()}</td>
            <td className="border p-2 text-center">{game.homeAway}</td>
            <td className="border p-2 text-center">{game.score}</td>
            <td className="border p-2 text-center">{game.result}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
        {/* Placeholder: Injuries */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Injuries</h2>
          <p className="text-gray-500 italic">Injury data coming soon...</p>
        </div>

        {/* Placeholder: Transactions */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">Recent Transactions</h2>
          <p className="text-gray-500 italic">Transaction log coming soon...</p>
        </div>

        {/* Stats */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Defensive Stats (2024)</h2>
          {Object.keys(stats || {}).length === 0 ? (
            <p className="text-gray-500 italic">No stats available.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-4 text-sm">
              <li><strong>Points Allowed:</strong> {stats.pointsAllowed}</li>
              <li><strong>Total Yards Allowed:</strong> {stats.totalYardsAllowed}</li>
              <li><strong>Pass Yards Allowed:</strong> {stats.passYardsAllowed}</li>
              <li><strong>Rush Yards Allowed:</strong> {stats.rushYardsAllowed}</li>
              <li><strong>Sacks:</strong> {stats.sacks}</li>
              <li><strong>Turnovers:</strong> {stats.turnovers}</li>
              <li><strong>Red Zone %:</strong> {stats.redZonePct}</li>
              <li><strong>3rd Down %:</strong> {stats.thirdDownPct}</li>
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
