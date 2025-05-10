'use client'

export default function FantasyFootballInsights() {
  const insights = [
    {
      title: 'Waiver Wire Pickups',
      content: 'Top adds: RB Chase Brown (CIN), WR Brian Thomas Jr. (JAX).',
      date: 'May 8, 2025',
    },
    {
      title: 'Trending Players',
      content: 'Up: J.J. McCarthy (QB, MIN). Down: Tua Tagovailoa (QB, MIA).',
      date: 'May 8, 2025',
    },
    {
      title: 'Salary Cap Analysis',
      content: 'Bengals\' cap strategy for 2025.',
      date: 'May 7, 2025',
    },
    {
      title: 'Draft Prospect Deep Dive',
      content: 'Scouting QB Cam Ward.',
      date: 'May 6, 2025',
    },
    {
      title: 'Matchup Preview',
      content: 'Bengals vs. Patriots: Key fantasy matchups.',
      date: 'May 5, 2025',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {insights.map((item, i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">{item.title}</h3>
          <p className="text-gray-600 mb-4">{item.content}</p>
          <p className="text-sm text-gray-500">{item.date}</p>
        </div>
      ))}
    </div>
  )
}
