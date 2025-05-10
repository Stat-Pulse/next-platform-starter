'use client'

export default function PowerRankings() {
  const rankings = [
    '1. Kansas City Chiefs (0-0)',
    '2. Philadelphia Eagles (0-0)',
    '3. Cincinnati Bengals (0-0)',
    '4. Baltimore Ravens (0-0)',
    '5. Buffalo Bills (0-0)',
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <ul className="space-y-2 text-gray-700">
        {rankings.map((team, index) => (
          <li key={index}>{team}</li>
        ))}
      </ul>
      <a
        href="power-rankings.html"
        className="text-red-600 hover:underline mt-4 inline-block"
      >
        View Full Rankings
      </a>
    </div>
  )
}
