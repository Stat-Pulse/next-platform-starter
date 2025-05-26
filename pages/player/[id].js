// pages/player/[id].js
import Head from 'next/head';
import PlayerHeader from '@/components/player/PlayerHeader';

export default function PlayerProfilePage({ player, gameLogs }) {
  if (!player) {
    return (
      <div className="p-10 text-center text-red-600">
        <h1>❌ Player not found</h1>
      </div>
    );
  }

  const logsWithTDs = gameLogs
    .map((g) => ({
      ...g,
      total_tds: (g.passing_tds || 0) + (g.rushing_tds || 0) + (g.receiving_tds || 0),
    }))
    .sort((a, b) => a.week - b.week);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <Head>
        <title>{player.player_name} | StatPulse</title>
      </Head>

      {/* ✅ Header */}
      <PlayerHeader player={player} />

      {/* ✅ Game Logs */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 border-b pb-1">Game Logs</h2>
        <div className="overflow-x-auto border rounded-md shadow">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="p-3 font-semibold">Week</th>
                <th className="p-3 font-semibold">Opponent</th>
                <th className="p-3 font-semibold">Rec</th>
                <th className="p-3 font-semibold">Yards</th>
                <th className="p-3 font-semibold">TDs</th>
              </tr>
            </thead>
            <tbody>
              {logsWithTDs.map((log, idx) => (
                <tr key={idx} className="even:bg-gray-50">
                  <td className="p-2">{log.week || '-'}</td>
                  <td className="p-2">{log.opponent_team_abbr || '-'}</td>
                  <td className="p-2">{log.receptions || 0}</td>
                  <td className="p-2">{log.receiving_yards || 0}</td>
                  <td className="p-2">{log.total_tds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ✅ Career Stats */}
      {player.career && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 border-b pb-1">Career Stats</h2>
          <div className="overflow-x-auto border rounded-md shadow">
            <table className="min-w-full text-sm text-center">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-3 font-semibold">Games</th>
                  <th className="p-3 font-semibold">Receptions</th>
                  <th className="p-3 font-semibold">Yards</th>
                  <th className="p-3 font-semibold">Touchdowns</th>
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
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const playerId = params.id;

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://statpulseanalytics.netlify.app';
    const res = await fetch(`${baseUrl}/api/player/${playerId}`);
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();

    return {
      props: {
        player: data.player || null,
        gameLogs: data.gameLogs || [],
      },
    };
  } catch (error) {
    console.error('Error loading player data:', error);
    return {
      props: {
        player: null,
        gameLogs: [],
      },
    };
  }
}
