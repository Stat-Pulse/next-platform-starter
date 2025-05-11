'use client'

export default function PowerRankings() {
  const rankings = [
    { rank: 1, team: 'Kansas City Chiefs', record: '0-0' },
    { rank: 2, team: 'Philadelphia Eagles', record: '0-0' },
    { rank: 3, team: 'Cincinnati Bengals', record: '0-0' },
    { rank: 4, team: 'Baltimore Ravens', record: '0-0' },
    { rank: 5, team: 'Buffalo Bills', record: '0-0' }
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <ul className="space-y-2 text-gray-700">
        {rankings.map(({ rank, team, record }) => (
          <li key={rank}>
            {rank}. {team} ({record})
          </li>
        ))}
      </ul>
      <a
        href="/power-rankings"
        className="text-red-600 hover:underline mt-4 inline-block"
      >
        View Full Rankings
      </a>
    </div>
  )
}
