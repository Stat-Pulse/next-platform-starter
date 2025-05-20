'use client';
import SeasonSelector from './SeasonSelector';
import ReceivingMetricsTable from '@/components/player/ReceivingMetricsTable';

export default function PlayerProfileShell({ player, careerStats, gameLogs }) {
  console.log('PlayerProfileShell props:', { player, careerStats, gameLogs });
  if (!player) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-gray-800">Player Not Found</h1>
        <p className="text-gray-600">No player data available for this ID.</p>
      </main>
    );
  }

  const gameLogsWithTotalTDs = gameLogs.map((log) => ({
    ...log,
    total_tds: (log.passing_tds || 0) + (log.rushing_tds || 0) + (log.receiving_tds || 0),
  }));

  return (
    <main className="container mx-auto p-6">
      {/* Header Section */}
      <header className="flex items-center mb-6 border-b pb-4">
        {player.headshot_url && (
          <img
            src={player.headshot_url}
            alt={player.player_name}
            className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-gray-300"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{player.player_name}</h1>
          <p className="text-lg text-gray-600">
            {player.position} | {player.team} | #{player.jersey_number}
          </p>
        </div>
      </header>

      {/* Main Content and Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Career Stats */}
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Career Stats</h2>
            {careerStats.length > 0 ? (
              <div className="overflow-x-auto border rounded-md shadow-sm">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left text-gray-700">
                    <tr>
                      <th className="p-3 font-semibold">Season</th>
                      <th className="p-3 font-semibold text-center">Pass Yards</th>
                      <th className="p-3 font-semibold text-center">Rush Yards</th>
                      <th className="p-3 font-semibold text-center">Recv Yards</th>
                      <th className="p-3 font-semibold text-center">PPR Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {careerStats.map((row, index) => (
                      <tr key={row.season} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="p-3">{row.season}</td>
                        <td className="p-3 text-center">{row.passing_yards ?? '-'}</td>
                        <td className="p-3 text-center">{row.rushing_yards ?? '-'}</td>
                        <td className="p-3 text-center">{row.receiving_yards ?? '-'}</td>
                        <td className="p-3 text-center">
                          {row.fantasy_points_ppr ? Number(row.fantasy_points_ppr).toFixed(2) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No career stats available.</p>
            )}
          </section>

          {/* Receiving Metrics */}
          <section className="mb-6">
            <ReceivingMetricsTable playerId={player.player_id} />
          </section>

          {/* Game Logs */}
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Game Logs</h2>
            <SeasonSelector gameLogs={gameLogsWithTotalTDs} />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-1/3">
          <div className="border rounded-md p-4 shadow-sm bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Player Info</h3>
            <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">College:</span> {player.college || 'N/A'}</p>
            <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">Drafted:</span> {player.draft_club || 'Undrafted'} #{player.draft_number || 'N/A'} ({player.rookie_year || 'N/A'})</p>
            <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">Experience:</span> {player.years_exp || 'N/A'} years</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Status:</span> {player.status || 'N/A'}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}