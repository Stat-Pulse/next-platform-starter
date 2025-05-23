import Image from 'next/image';
import { notFound } from 'next/navigation';
import SeasonSelector from './SeasonSelector';
import ReceivingMetricsTable from '@/components/player/ReceivingMetricsTable';
import PlayerHeader from '@/components/player/PlayerHeader';

async function getPlayerData(playerId) {
  try {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/player/${playerId}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function PlayerProfilePage({ params }) {
  const playerId = params.id;
  const data = await getPlayerData(playerId);
  if (!data || !data.player) return notFound();

  const { player, gameLogs, receivingStats } = data;
  const gameLogsWithTDs = gameLogs.map((g) => ({
    ...g,
    total_tds: (g.passing_tds || 0) + (g.rushing_tds || 0) + (g.receiving_tds || 0),
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* ✅ Player Header Component */}
      <PlayerHeader player={player} />

      {/* ✅ Game Logs */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 border-b pb-1">Game Logs</h2>
        <SeasonSelector gameLogs={gameLogsWithTDs} />
      </section>

      {/* ✅ Career Stats */}
      {player.career && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-1">Career Stats</h2>
          <div className="overflow-x-auto border rounded-md shadow">
            <table className="min-w-full text-sm text-center">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-3 font-semibold">Total Games</th>
                  <th className="p-3 font-semibold">Receptions</th>
                  <th className="p-3 font-semibold">Yards</th>
                  <th className="p-3 font-semibold">TDs</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3">{player.career.games}</td>
                  <td className="p-3">{player.career.receptions}</td>
                  <td className="p-3">{player.career.yards}</td>
                  <td className="p-3">{player.career.tds}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ✅ Receiving Metrics */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 border-b pb-1">Receiving Metrics</h2>
        <ReceivingMetricsTable playerId={playerId} />
      </section>
    </div>
  );
}
