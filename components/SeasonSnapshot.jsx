'use client'

import Link from 'next/link'

const leaders = {
  passing: [
    { name: 'Joe Burrow', yards: 4918 },
    { name: 'Patrick Mahomes', yards: 4800 },
    { name: 'Josh Allen', yards: 4600 }
  ],
  rushing: [
    { name: 'Saquon Barkley', yards: 2000 },
    { name: 'Bijan Robinson', yards: 1456 },
    { name: 'Derrick Henry', yards: 1921 }
  ],
  receiving: [
    { name: "Ja'Marr Chase", yards: 1708 },
    { name: 'Justin Jefferson', yards: 1533 },
    { name: 'Brian Thomas Jr.', yards: 1282 }
  ],
  defense: [
    { name: 'Trey Hendrickson', sacks: 17.5 },
    { name: 'Myles Garrett', sacks: 14 },
    { name: 'Micah Parsons', sacks: 12 }
  ]
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function KeyStatsLeaders() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        <Link href="/stat-tracker" className="text-red-600 hover:underline">
          Key Statistics Leaders
        </Link>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Passing */}
        <StatBox title="Passing Yards" statList={leaders.passing} statKey="yards" />

        {/* Rushing */}
        <StatBox title="Rushing Yards" statList={leaders.rushing} statKey="yards" />

        {/* Receiving */}
        <StatBox title="Receiving Yards" statList={leaders.receiving} statKey="yards" />

        {/* Sacks */}
        <StatBox title="Sacks" statList={leaders.defense} statKey="sacks" />
      </div>

      <div className="text-center mt-8">
        <Link href="/stat-tracker" className="bg-red-600 text-white px-6 py-3 rounded-md text-sm hover:bg-red-700">
          View Full Stats
        </Link>
      </div>
    </div>
  )
}

function StatBox({ title, statList, statKey }) {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        <Link href="/stat-tracker" className="hover:underline text-red-600">
          {title}
        </Link>
      </h3>
      <ul className="space-y-2 text-gray-700">
        {statList.map(player => (
          <li key={player.name}>
            <Link
              href={`/players/${slugify(player.name)}`}
              className="text-red-600 hover:underline"
            >
              {player.name}
            </Link>{' '}
            – {player[statKey].toLocaleString()} {statKey === 'sacks' ? 'sacks' : 'yds'}
          </li>
        ))}
      </ul>
    </div>
  )
}
