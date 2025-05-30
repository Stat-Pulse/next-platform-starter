// pages/player/[id].js
import mysql from 'mysql2/promise';
import Head from 'next/head';

export async function getServerSideProps({ params }) {
  const playerId = params.id;
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [profileRows] = await connection.execute(`
      SELECT *
      FROM Active_Player_Profiles
      WHERE player_id = ?
      LIMIT 1
    `, [playerId]);

    if (profileRows.length === 0) {
      return { notFound: true };
    }

    const player = profileRows[0];

    const [receivingMetrics] = await connection.execute(`
      SELECT *
      FROM NextGen_Stats_Receiving
      WHERE player_id = ? AND season = 2024
      ORDER BY week
    `, [playerId]);

    // Aggregate career stats
    const career = receivingMetrics.length > 0 ? {
      games: receivingMetrics.length,
      targets: receivingMetrics.reduce((sum, g) => sum + (g.targets || 0), 0),
      receptions: receivingMetrics.reduce((sum, g) => sum + (g.receptions || 0), 0),
      yards: receivingMetrics.reduce((sum, g) => sum + (g.yards || 0), 0),
      tds: receivingMetrics.reduce((sum, g) => sum + (g.rec_touchdowns || 0), 0),
    } : null;

    return {
      props: {
        player: { ...player, career },
        receivingMetrics
      }
    };
  } catch (error) {
    console.error('Database error:', error);
    return { notFound: true };
  } finally {
    if (connection) await connection.end();
  }
}

export default function PlayerPage({ player, receivingMetrics }) {
  return (
    <>
      <Head>
        <title>{player.player_name} | StatPulse Profile</title>
      </Head>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-4">{player.player_name}</h1>
        {player.headshot_url && (
          <div className="mb-4">
            <img
              src={player.headshot_url}
              alt={`${player.player_name} headshot`}
              className="w-32 h-32 object-cover rounded-full border"
            />
          </div>
        )}

        {/* Grid for Info and Contract */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow">
          {/* Player Info */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Player Info</h2>
            <p><strong>Position:</strong> {player.position}</p>
            <p><strong>Team:</strong> {player.team_abbr} ({player.team_name || 'N/A'})</p>
            <p><strong>College:</strong> {player.college}</p>
            <p><strong>Height / Weight:</strong> {player.height_inches} in / {player.weight_pounds} lbs</p>
            <p><strong>Birth Date:</strong> {player.date_of_birth ? new Date(player.date_of_birth).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Status:</strong> {player.is_active ? "Active" : "Inactive"}</p>
          </div>

          {/* Draft & Contract */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Draft & Contract</h2>
            <p><strong>Drafted:</strong> {player.draft_season || '—'} | {player.draft_team || '—'} | Round {player.draft_round || '—'}, Pick {player.draft_pick || '—'}</p>
            <p><strong>Contract Year:</strong> {player.contract_year || '—'}</p>
            <p><strong>Total Value:</strong> ${player.value ? (player.value * 1_000_000).toLocaleString() : 'N/A'}</p>
            <p><strong>APY:</strong> ${player.apy ? (player.apy * 1_000_000).toLocaleString() : 'N/A'}</p>
            <p><strong>Guaranteed:</strong> ${player.guaranteed ? (player.guaranteed * 1_000_000).toLocaleString() : 'N/A'}</p>
            <p><strong>APY Cap %:</strong> {(player.apy_cap_pct !== null && player.apy_cap_pct !== undefined) ? `${(player.apy_cap_pct * 100).toFixed(1)}%` : 'N/A'}</p>
            <p><strong>Inflated Value:</strong> ${player.inflated_value ? (player.inflated_value * 1_000_000).toLocaleString() : 'N/A'}</p>
            <p><strong>Inflated Guaranteed:</strong> ${player.inflated_guaranteed ? (player.inflated_guaranteed * 1_000_000).toLocaleString() : 'N/A'}</p>
          </div>
        </div>

        {/* Career Summary */}
        {player.career && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-2">Career Receiving Summary</h2>
            <div className="bg-white p-4 rounded shadow">
              <p><strong>Games:</strong> {player.career.games}</p>
              <p><strong>Targets:</strong> {player.career.targets}</p>
              <p><strong>Receptions:</strong> {player.career.receptions}</p>
              <p><strong>Yards:</strong> {player.career.yards}</p>
              <p><strong>Touchdowns:</strong> {player.career.tds}</p>
            </div>
          </div>
        )}

        {/* Receiving Metrics Table */}
        {receivingMetrics && receivingMetrics.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-2">Receiving Metrics (2024)</h2>
            <div className="overflow-x-auto bg-white p-4 rounded shadow">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Week</th>
                    <th className="text-left p-2">Targets</th>
                    <th className="text-left p-2">Receptions</th>
                    <th className="text-left p-2">Yards</th>
                    <th className="text-left p-2">TDs</th>
                    <th className="text-left p-2">Catch %</th>
                    <th className="text-left p-2">Avg YAC</th>
                    <th className="text-left p-2">Separation</th>
                  </tr>
                </thead>
                <tbody>
                  {receivingMetrics.map((g, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{g.week}</td>
                      <td className="p-2">{g.targets}</td>
                      <td className="p-2">{g.receptions}</td>
                      <td className="p-2">{g.yards}</td>
                      <td className="p-2">{g.rec_touchdowns}</td>
                      <td className="p-2">{(g.catch_percentage * 100).toFixed(1)}%</td>
                      <td className="p-2">{g.avg_yac?.toFixed(1)}</td>
                      <td className="p-2">{g.avg_separation?.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
