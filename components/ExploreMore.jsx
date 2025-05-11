export default function ExploreMore() {
  const links = [
    { href: '/league-standings', label: 'League Standings' },
    { href: '/teams', label: 'Teams' },
    { href: '/betting-book', label: 'Betting Book' },
    { href: '/stat-tracker', label: 'Stat Tracker' },
    { href: '/analytics-lab', label: 'Analytics Lab' },
    { href: '/injury-report-hub', label: 'Injury Report Hub' },
    { href: '/power-rankings', label: 'Power Rankings' },
    { href: '/schedule-results', label: 'Schedule & Results' },
    { href: '/league-news', label: 'League News' },
    { href: '/draft-hq', label: 'Draft HQ' },
    { href: '/media-vault', label: 'Media Vault' },
    { href: '/simulations', label: 'Simulations' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {links.map(({ href, label }) => (
        <a
          key={href}
          href={href}
          className="bg-red-600 text-white p-6 rounded-lg shadow text-center hover:bg-red-700"
        >
          {label}
        </a>
      ))}
    </div>
  )
}
