'use client'

export default function FantasyFootballInsights() {
  const insights = [
    {
      title: 'Waiver Wire Pickups',
      content: 'Top adds: RB Chase Brown (CIN), WR Brian Thomas Jr. (JAX).',
      link: '/fantasy',
      date: 'May 8, 2025'
    },
    {
      title: 'Trending Players',
      content: 'Up: J.J. McCarthy (QB, MIN). Down: Tua Tagovailoa (QB, MIA).',
      link: '/fantasy',
      date: 'May 8, 2025'
    },
    {
      title: 'Draft Prospect Deep Dive',
      content: 'Scouting QB Cam Ward.',
      link: '/draft-hq',
      date: 'May 6, 2025'
    },
    {
      title: 'Matchup Preview',
      content: 'Bengals vs. Patriots: Key fantasy matchups.',
      link: '/analytics-lab',
      date: 'May 5, 2025'
    }
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        <a href="/fantasy" className="hover:underline text-red-600">
          Fantasy Football Insights
        </a>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-4">
              {item.content}{' '}
              <a href={item.link} className="text-red-600 hover:underline">
                Read more
              </a>
            </p>
            <p className="text-sm text-gray-500">{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
