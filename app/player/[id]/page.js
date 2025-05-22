'use client'

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
    total_tds: (log.passing_tds || 0) + (log.rushing_tds || 0) + (log.receiving_tds || 0),
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Player Header */}
      <div className="bg-white shadow rounded-lg p-6 flex gap-6">
        {player.headshot_url && (
          <Image
            src={player.headshot_url}
            alt={player.player_name}
            width={120}
            height={120}
            className="rounded-full border border-gray-300 object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{player.player_name}</h1>
          <p className="text-sm text-gray-500">
            {player.position} | {player.team_abbr} | #{player.jersey_number}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-700">
            <div><span className="font-semibold">College:</span> {player.college || 'N/A'}</div>
            <div><span className="font-semibold">Drafted:</span> {player.draft_club || 'Undrafted'} #{player.draft_number || 'N/A'} ({player.rookie_year || 'N/A'})</div>
            <div><span className="font-semibold">Experience:</span> {player.years_exp || 'N/A'} years</div>
            <div><span className="font-semibold">Status:</span> {player.status || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* Game Logs */}
      {gameLogs?.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Game Logs</h2>
          <SeasonSelector gameLogs={gameLogsWithTotalTDs} />
        </section>
      )}

      {/* Career Stats */}
      {player.career && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Career Totals</h2>
          <div className="overflow-x-auto border rounded-md shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-700">
                <tr>
                  <th className="p-3 font-semibold">Games</th>
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
      <section className="mt-10">
        <ReceivingMetricsTable playerId={playerId} />
      </section>
    </div>
  );
}