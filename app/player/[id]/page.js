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

  const gameLogsWithTotalTDs = Array.isArray(gameLogs)
    ? gameLogs.map((log) => ({
        ...log,
        total_tds: (log.passing_tds || 0) + (log.rushing_tds || 0) + (log.receiving_tds || 0),
      }))
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Safe Header */}
      <header className="flex items-center gap-4 mb-8">
        {player?.headshot_url && (
          <Image
            src={player.headshot_url}
            alt={player.player_name}
            width={80}
            height={80}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{player.player_name}</h1>
          <p className="text-sm text-gray-500">
            {player.position} | {player.team_abbr} | #{player.jersey_number}
          </p>
        </div>
      </header>

      {/* Safe Season Selector */}
      {gameLogsWithTotalTDs.length > 0 && (
        <section className="mb-8">
          <SeasonSelector gameLogs={gameLogsWithTotalTDs} />
        </section>
      )}

      {/* Safe Receiving Metrics */}
      <section className="mb-8">
        <ReceivingMetricsTable playerId={playerId} />
      </section>
    </div>
  );
}