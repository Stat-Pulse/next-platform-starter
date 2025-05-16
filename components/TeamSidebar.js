// components/TeamSidebar.js
import Link from 'next/link';

const linkMap = {
  'Dashboard': '/fantasy',
  'My Team': '/fantasy/my-team',
  'Current Matchup': '/fantasy/current-matchup',
  'Live Scoring': '/fantasy/live-scoring',
  'League Schedule': '/fantasy/league-schedule',
  'Player Stats': '/fantasy/player-stats',
  'Free Agent Listings': '/fantasy/free-agent-listings',
  'Trade Center': '/fantasy/trade-center',
  'Draft Review': '/fantasy/draft-review',
};

export default function TeamSidebar({ active = '' }) {
  return (
    <aside className="bg-white rounded-lg shadow p-6">
      <ul className="space-y-2">
        {Object.entries(linkMap).map(([label, path]) => {
          const isActive = active === label;
          return (
            <li key={label}>
              <Link href={path} legacyBehavior>
                <a className={`flex items-center p-3 rounded-md ${
                  isActive
                    ? 'bg-gray-100 text-red-600'
                    : 'text-gray-800 hover:text-red-600 hover:bg-gray-100'
                }`}>
                  {label}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
