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
    <main className="container mx-auto p-4">
      {/* Header Section */}
      <header className="mb-6">
        <div className="flex items-center">
          {player.headshot_url && (
            <img
              src={player.headshot_url}
              alt={player.player_name}
              className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-gray-300"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{player.player_name}</h1>
            <p className="text-gray-600">
              {player.position} | {player.team} | #{player.jersey_number}
            </p>
          </div>
        </div>
        {/* Bio Section (Moved Up) */}
        <div className="mt-4 text-gray-600">
          <p>College: {player.college || 'N/A'}</p>
          <p>
            Drafted: {player.draft_club || 'Undrafted'} #{player.draft_number || 'N/A'} (
            {player.rookie_year || 'N/A'})
          </p>
          <p>Experience: {player.years_exp || 'N/A'} years</p>
          <p>Status: {player.status || 'N/A'}</p>
        </div>
      </header>

      {/* Career Stats */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Career Stats</h2>
        {careerStats.length > 0 ? (
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Season</th>
                  <th className="p-2 text-center">Pass Yards</th>
                  <th className="p-2 text-center">Rush Yards</th>
                  <th className="p-2 text-center">Recv Yards</th>
                  <th className="p-2 text-center">PPR Points</th>
                </tr>
              </thead>
              <tbody>
                {careerStats.map((row) => (
                  <tr key={row.season} className="border-t">
                    <td className="p-2">{row.season}</td>
                    <td className="p-2 text-center">{row.passing_yards ?? '-'}</td>
                    <td className="p-2 text-center">{row.rushing_yards ?? '-'}</td>
                    <td className="p-2 text-center">{row.receiving_yards ?? '-'}</td>
                    <td className="p-2 text-center">
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Logs</h2>
        <SeasonSelector gameLogs={gameLogsWithTotalTDs} />
      </section>
    </main>
  );
}
