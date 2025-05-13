// components/TeamSidebar.js

export default function TeamSidebar({ active = '' }) {
  const links = [
    'Dashboard',
    'My Team',
    'Current Matchup',
    'Live Scoring',
    'League Schedule',
    'Player Stats',
    'Free Agent Listings',
    'Trade Center',
    'Draft Review',
  ];

  return (
    <aside className="bg-white rounded-lg shadow p-6">
      <ul className="space-y-2">
        {links.map((text) => {
          const fileName = text.toLowerCase().replace(/\s+/g, '-');
          const isActive = active === text;
          return (
            <li key={text}>
              <a
                href={`/${fileName}.html`}
                className={`flex items-center p-3 rounded-md ${
                  isActive
                    ? 'bg-gray-100 text-red-600'
                    : 'text-gray-800 hover:text-red-600 hover:bg-gray-100'
                }`}
              >
                {text}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
