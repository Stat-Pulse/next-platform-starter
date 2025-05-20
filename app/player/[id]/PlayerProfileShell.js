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

  return (
    <main className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{player.player_name}</h1>
        <p className="text-gray-600">
          {player.position} | {player.team} | #{player.jersey_number}
        </p>
        {player.headshot_url && (
          <img
            src={player.headshot_url}
            alt={player.player_name}
            className="w-32 h-32 rounded-full mt-4"
          />
        )}
        <p className="mt-2 text-gray-600">College: {player.college || 'N/A'}</p>
        <p className="text-gray-600">
          Drafted: {player.draft_club || 'Undrafted'} #{player.draft_number || 'N/A'} (
          {player.rookie_year || 'N/A'})
        </p>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Career Stats</h2>
        {careerStats.length > 0 ? (
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Season</th>
                  <th className="p-2">Pass Yards</th>
                  <th className="p-2">Rush Yards</th>
                  <th className="p-2">Recv Yards</th>
                  <th className="p-2">PPR Points</th>
                </tr>
              </thead>
              <tbody>
                {careerStats.map((row) => (
                  <tr key={row.season} className="border-t">
                    <td className="p-2">{row.season}</td>
                    <td className="p-2">{row.passing_yards ?? '-'}</td>
                    <td className="p-2">{row.rushing_yards ?? '-'}</td>
                    <td className="p-2">{row.receiving_yards ?? '-'}</td>
                    <td className="p-2">
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

      <ReceivingMetricsTable playerId={player.player_id} /> {/* Use player_id from page.js */}

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Logs</h2>
        <SeasonSelector gameLogs={gameLogs} />
      </section>
    </main>
  );
}
