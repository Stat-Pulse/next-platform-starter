'use client'

export default function SidebarNavigation({ current = 'league' }) {
  const links = [
    { href: 'league', label: 'League Overview' },
    { href: 'league-standings', label: 'League Standings' },
    { href: 'teams', label: 'Teams' },
    { href: 'betting-book', label: 'Betting Book' },
    { href: 'stat-tracker', label: 'Stat Tracker' },
    { href: 'analytics-lab', label: 'Analytics Lab' },
    { href: 'injury-report-hub', label: 'Injury Report Hub' },
    { href: 'power-rankings', label: 'Power Rankings' },
    { href: 'schedule-results', label: 'Schedule & Results' },
    { href: 'league-news', label: 'League News' },
    { href: 'draft-hq', label: 'Draft HQ' },
    { href: 'media-vault', label: 'Media Vault' },
    { href: 'simulations', label: 'Simulations' },
  ]

  return (
    <aside className="bg-white rounded-lg shadow p-6 space-y-2">
      {links.map(({ href, label }) => {
        const isActive = href === current
        return (
          <a
            key={href}
            href={`/${href}`}
            className={`flex items-center p-3 rounded-md ${
              isActive
                ? 'text-red-600 bg-gray-100'
                : 'text-gray-800 hover:text-red-600 hover:bg-gray-100'
            }`}
          >
            <span>{label}</span>
          </a>
        )
      })}
    </aside>
  )
}
