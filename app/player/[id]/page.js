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
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

export default async function PlayerProfilePage({ params }) {
  const playerId = params.id;
  const data = await getPlayerData(playerId);
  if (!data || !data.player) return notFound();

  const { player, gameLogs, receivingStats } = data;
  const gameLogsWithTDs = gameLogs.map((log) => ({
    ...log,
    total_tds: (log.passing_tds || 0) + (log.rushing_tds || 0) + (log.receiving_tds || 0),
  }));

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center bg-white rounded-lg shadow p-6 gap-6">
        {player.headshot_url && (
          <Image
            src={player.headshot_url}
            alt={player.player_name}
            width={100}
            height={100}
            className="rounded-full border border-gray-300"
          />
        )}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900">{player.player_name}</h1>
          <p className="text-sm text-gray-600">{player.position} | {player.team_abbr} | #{player.jersey_number}</p>
          <ul className="mt-2 text-sm text-gray-700 space-y-1">
            <li><strong>College:</strong> {player.college || 'N/A'}</li>
            <li><strong>Drafted:</strong> {player.draft_club || 'Undrafted'} #{player.draft_number || 'N/A'} ({player.rookie_year || 'N/A'})</li>
            <li><strong>Experience:</strong> {player.years_exp || 'N/A'} years</li>
            <li><strong>Status:</strong> {player.status || 'N/A'}</li>
          </ul>
        </div>
      </div>

      {/* Game Logs Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Game Logs</h2>
        <SeasonSelector gameLogs={gameLogsWithTDs} />
      </div>

      {/* Career Stats Section */}
      {player.career && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Career Stats</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Total Games</th>
                  <th className="px-4 py-2">Receptions</th>
                  <th className="px-4 py-2">Yards</th>
                  <th className="px-4 py-2">TDs</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">{player.career.games}</td>
                  <td className="px-4 py-2">{player.career.receptions}</td>
                  <td className="px-4 py-2">{player.career.yards}</td>
                  <td className="px-4 py-2">{player.career.tds}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Receiving Metrics Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <ReceivingMetricsTable playerId={playerId} />
      </div>
    </div>
  );
}