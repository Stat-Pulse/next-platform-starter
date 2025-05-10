'use client'

export default function ExploreMore() {
  const links = [
    { href: 'league-standings.html', label: 'League Standings' },
    { href: 'teams.html', label: 'Teams' },
    { href: 'betting-book.html', label: 'Betting Book' },
    { href: 'stat-tracker.html', label: 'Stat Tracker' },
    { href: 'analytics-lab.html', label: 'Analytics Lab' },
    { href: 'injury-report-hub.html', label: 'Injury Report Hub' },
    { href: 'power-rankings.html', label: 'Power Rankings' },
    { href: 'schedule-results.html', label: 'Schedule & Results' },
    { href: 'league-news.html', label: 'League News' },
    { href: 'draft-hq.html', label: 'Draft HQ' },
    { href: 'media-vault.html', label: 'Media Vault' },
    { href: 'simulations.html', label: 'Simulations' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="bg-red-600 text-white p-6 rounded-lg shadow text-center hover:bg-red-700"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
