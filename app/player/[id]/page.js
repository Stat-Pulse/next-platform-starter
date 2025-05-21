import Image from 'next/image';
import { notFound } from 'next/navigation';

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        {player.headshot_url && (
          <Image
            src={player.headshot_url}
            alt={player.player_name}
            width={140}
            height={140}
            className="rounded-md shadow-lg border"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{player.player_name}</h1>
          <p className="text-sm text-gray-500">
            {player.position} | {player.team_abbr} | #{player.jersey_number}
          </p>
        </div>
      </div>

      {/* Game Logs */}
      {gameLogs?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Game Logs</h2>
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Week</th>
                  <th className="p-2">Opp</th>
                  <th className="p-2">Targets</th>
                  <th className="p-2">Receptions</th>
                  <th className="p-2">Yards</th>
                  <th className="p-2">TDs</th>
                </tr>
              </thead>
              <tbody>
                {gameLogs.map((log, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{log.week}</td>
                    <td className="p-2">{log.opponent}</td>
                    <td className="p-2">{log.targets}</td>
                    <td className="p-2">{log.receptions}</td>
                    <td className="p-2">{log.receiving_yards}</td>
                    <td className="p-2">{log.receiving_tds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Career Totals */}
      {player.career && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Career Stats</h2>
          <ul className="text-sm leading-relaxed">
            <li>Total Games: {player.career.games}</li>
            <li>Total Receptions: {player.career.receptions}</li>
            <li>Total Yards: {player.career.yards}</li>
            <li>Total TDs: {player.career.tds}</li>
          </ul>
        </section>
      )}

      {/* Receiving Metrics */}
      {receivingStats?.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Receiving Metrics</h2>
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Season</th>
                  <th className="p-2">Targets</th>
                  <th className="p-2">Air Yards</th>
                  <th className="p-2">YAC</th>
                  <th className="p-2">EPA</th>
                  <th className="p-2">WOPR</th>
                </tr>
              </thead>
              <tbody>
                {receivingStats.map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{row.season}</td>
                    <td className="p-2">{row.targets}</td>
                    <td className="p-2">{row.receiving_air_yards}</td>
                    <td className="p-2">{row.receiving_yards_after_catch}</td>
                    <td className="p-2">{row.receiving_epa}</td>
                    <td className="p-2">{row.wopr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}