import Image from 'next/image';
import { notFound } from 'next/navigation';
import SeasonSelector from './SeasonSelector';
import ReceivingMetricsTable from '@/components/player/ReceivingMetricsTable';

async function getPlayerData(playerId) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/player/${playerId}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching player data:', error);
    return null;
  }
}

export default async function PlayerProfilePage({ params }) {
  const playerId = params.id;
  const data = await getPlayerData(playerId);

  if (!data || !data.player) return notFound();

  const { player, gameLogs, receivingStats } = data;
  const gameLogsWithTotalTDs = gameLogs.map((log) => ({
    ...log,
    total_tds:
      (log.passing_tds || 0) +
      (log.rushing_tds || 0) +
      (log.receiving_tds || 0),
  }));

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      {/* Bio Header */}
      <div className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        {player.headshot_url && (
          <Image
            src={player.headshot_url}
            alt={player.player_name}
            width={120}
            height={120}
            className="rounded-full border"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{player.player_name}</h1>
          <p className="text-sm text-gray-600 mb-2">
            {player.position} | {player.team_abbr} | #{player.jersey_number}
          </p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li><strong>College:</strong> {player.college || 'N/A'}</li>
            <li><strong>Drafted:</strong> {player.draft_club || 'Undrafted'} #{player.draft_number || 'N/A'} ({player.rookie_year || 'N/A'})</li>
            <li><strong>Experience:</strong> {player.years_exp || 'N/A'} years</li>
            <li><strong>Status:</strong> {player.status || 'N/A'}</li>
          </ul>
        </div>
      </div>

      {/* Game Logs */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Game Logs</h2>
        <SeasonSelector gameLogs={gameLogsWithTotalTDs} />
      </div>

      {/* Career Stats */}
      {player.career && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Career Stats</h2>
          <div className="overflow-x-auto border rounded-md shadow-sm bg-white">
            <table className="min-w-full text-sm text-left divide-y divide-gray-200">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-3 font-medium">Total Games</th>
                  <th className="p-3 font-medium text-center">Receptions</th>
                  <th className="p-3 font-medium text-center">Yards</th>
                  <th className="p-3 font-medium text-center">TDs</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="p-3">{player.career.games}</td>
                  <td className="p-3 text-center">{player.career.receptions}</td>
                  <td className="p-3 text-center">{player.career.yards}</td>
                  <td className="p-3 text-center">{player.career.tds}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Receiving Metrics */}
      <div>
        <ReceivingMetricsTable playerId={playerId} />
      </div>
    </div>
  );
}
