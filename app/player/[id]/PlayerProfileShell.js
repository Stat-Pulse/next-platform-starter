'use client';
import SeasonSelector from './SeasonSelector';
import ReceivingMetricsTable from '@/components/player/ReceivingMetricsTable';

export default function PlayerProfileShell({ player, careerStats, gameLogs }) {
  if (!player) {
    return (
      <main className="container py-8">
        <h1 className="text-2xl font-bold text-gray-800">Player Not Found</h1>
        <p className="mt-2 text-gray-600">No player data available for this ID.</p>
      </main>
    );
  }

  // compute total TDs
  const gameLogsWithTotalTDs = gameLogs.map((log) => ({
    ...log,
    total_tds: (log.passing_tds || 0) + (log.rushing_tds || 0) + (log.receiving_tds || 0),
  }));

  return (
    <main className="container max-w-5xl mx-auto py-8">
      {/* Header Section */}
      <header className="flex items-center bg-gray-50 p-4 rounded-md shadow mb-8">
        {player.headshot_url && (
          <img
            src={player.headshot_url}
            alt={player.player_name}
            className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-gray-300"
            onError={(e) => console.log('Headshot load error:', e)}
          />
        )}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{player.player_name}</h1>
          <p className="mt-1 text-lg text-gray-600">
            {player.position}  |  {player.team}  |  #{player.jersey_number}
          </p>
        </div>
      </header>

      {/* Sticky Season Tabs */}
      <div className="sticky top-20 bg-white z-10 border-b mb-8">
        <SeasonSelector gameLogs={gameLogsWithTotalTDs} />
      </div>

      {/* Main Content + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* — Main Content — */}
        <div className="flex-1 space-y-8">
          {/* Career Stats Table */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Career Stats</h2>
            {careerStats.length ? (
              <div className="overflow-x-auto border rounded-md shadow-sm">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                  <thead className="bg-gray-100 uppercase text-xs tracking-widest text-gray-700">
                    <tr>
                      <th className="p-3 text-left">Season</th>
                      <th className="p-3 text-center">Pass Yards</th>
                      <th className="p-3 text-center">Rush Yards</th>
                      <th className="p-3 text-center">Recv Yards</th>
                      <th className="p-3 text-center">PPR Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {careerStats.map((row, idx) => (
                      <tr
                        key={row.season}
                        className={`${
                          idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-gray-100 transition`}
                      >
                        <td className="p-3">{row.season}</td>
                        <td className="p-3 text-center">{row.passing_yards ?? '-'}</td>
                        <td className="p-3 text-center">{row.rushing_yards ?? '-'}</td>
                        <td className="p-3 text-center">{row.receiving_yards ?? '-'}</td>
                        <td className="p-3 text-center">
                          {row.fantasy_points_ppr
                            ? Number(row.fantasy_points_ppr).toFixed(2)
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No career stats available.</p>
            )}
          </section>

          {/* Receiving Metrics */}
          <section>
            <ReceivingMetricsTable playerId={player.player_id} />
          </section>

          {/* (Game Logs are now handled by SeasonSelector above) */}
        </div>

        {/* — Sidebar — */}
        <aside className="lg:w-1/3">
          <div className="relative bg-white border rounded-md p-4 shadow-sm">
            {/* neutral accent bar on the left */}
            <span className="absolute left-0 top-0 h-full w-1 bg-neutralAccent rounded-l-md" />
            <div className="pl-4">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Player Info</h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">College:</span> {player.college || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Drafted:</span> {player.draft_club || 'Undrafted'}{' '}
                #{player.draft_number || 'N/A'} ({player.rookie_year || 'N/A'})
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Experience:</span> {player.years_exp || 'N/A'} yrs
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Status:</span> {player.status || 'N/A'}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
