'use client';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import SeasonSelector from './SeasonSelector';
import ReceivingMetricsTable from '@/components/player/ReceivingMetricsTable';

async function getPlayerData(playerId) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/player/${playerId}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
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
    total_tds: (log.passing_tds || 0) + (log.rushing_tds || 0) + (log.receiving_tds || 0),
  }));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start bg-white shadow rounded-xl p-6">
        {player.headshot_url && (
          <Image
            src={player.headshot_url}
            alt={player.player_name}
            width={140}
            height={140}
            className="rounded-full border border-gray-300 shadow-md mr-6"
          />
        )}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">{player.player_name}</h1>
          <p className="text-sm text-gray-600">{player.position} | {player.team_abbr} | #{player.jersey_number}</p>
          <p className="mt-2 text-gray-700 text-sm">College: {player.college || 'N/A'}</p>
          <p className="text-gray-700 text-sm">Drafted: {player.draft_club || 'Undrafted'} #{player.draft_number || 'N/A'} ({player.rookie_year || 'N/A'})</p>
          <p className="text-gray-700 text-sm">Experience: {player.years_exp || 'N/A'} years</p>
          <p className="text-gray-700 text-sm">Status: {player.status || 'N/A'}</p>
        </div>
      </div>

      {/* Game Logs */}
      {gameLogs.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Game Logs</h2>
          <SeasonSelector gameLogs={gameLogsWithTotalTDs} />
        </section>
      )}

      {/* Career Stats */}
      {player.career && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Career Stats</h2>
          <div className="overflow-x-auto rounded-lg shadow border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left font-medium">Total Games</th>
                  <th className="p-3 text-center font-medium">Receptions</th>
                  <th className="p-3 text-center font-medium">Yards</th>
                  <th className="p-3 text-center font-medium">TDs</th>
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
        </section>
      )}

      {/* Receiving Metrics */}
      <section>
        <ReceivingMetricsTable playerId={playerId} />
      </section>
    </div>
  );
}
