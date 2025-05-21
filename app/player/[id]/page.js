import Image from 'next/image';
import { notFound } from 'next/navigation';
import SeasonSelector from './SeasonSelector';
import ReceivingMetricsTable from '@/components/player/ReceivingMetricsTable';

async function getPlayerData(playerId) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/player/${playerId}`, {
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function PlayerProfilePage({ params }) {
  const playerId = params.id;
  const data = await getPlayerData(playerId);

  if (!data || !data.player) return notFound();

  const { player, gameLogs, receivingStats } = data;

  // Compute total TDs for gameLogs
  const gameLogsWithTotalTDs = gameLogs.map((log) => ({
    ...log,
    total_tds: (log.passing_tds || 0) + (log.rushing_tds || 0) + (log.receiving_tds || 0),
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with Bio */}
      <header className="flex items-center bg-gray-50 p-4 rounded-md shadow mb-8">
        {player.headshot_url && (
          <Image
            src={player.headshot_url}
            alt={player.player_name}
            width={80}
            height={80}
            className="rounded-full mr-4 object-cover border-2 border-gray-300"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{player.player_name}</h1>
          <p className="text-sm text-gray-500">
            {player.position} | {player.team_abbr} | #{player.jersey_number}
          </p>
          <div className="mt-2 text-sm text-gray-600">
            <p><span className="font-semibold">College:</span> {player.college || 'N/A'}</p>
            <p>
              <span className="font-semibold">Drafted:</span> {player.draft_club || 'Undrafted'} #
              {player.draft_number || 'N/A'} ({player.rookie_year || 'N/A'})
            </p>
            <p><span className="font-semibold">Experience:</span> {player.years_exp || 'N/A'} years</p>
            <p><span className="font-semibold">Status:</span> {player.status || 'N/A'}</p>
          </div>
        </div>
      </header>

      {/* Season Selector */}
      {gameLogs?.length > 0 && (
        <section className="mb-10">
          <SeasonSelector gameLogs={gameLogsWithTotalTDs} />
        </section>
      )}

      {/* Career Stats */}
      {player.career && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Career Stats</h2>
          <div className="overflow-x-auto border rounded-md shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-700">
                <tr>
                  <th className="p-3 font-semibold">Total Games</th>
                  <th className="p-3 font-semibold text-center">Receptions</th>
                  <th className="p-3 font-semibold text-center">Yards</th>
                  <th className="p-3 font-semibold text-center">TDs</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3">{player.career.games}</td>
                  <td className="p-3 text-center">{player.career.receptions}</td>
                  <td className="p-3 text-center">{player.career.yards}</td>
                  <td className="p-3 text-center">{player.career.tds}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Receiving Metrics */}
      <section>
        <ReceivingMetricsTable playerId={playerId} />
      </section>
    </div>
  );
}
