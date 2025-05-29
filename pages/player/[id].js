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

    return {
      props: {
        player
      }
    };
  } catch (error) {
    console.error('Database error:', error);
    return { notFound: true };
  } finally {
    if (connection) await connection.end();
  }
}

export default function PlayerPage({ player }) {
  return (
    <>
      <Head>
        <title>{player.player_name} | StatPulse Profile</title>
      </Head>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-4">{player.player_name}</h1>

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
            <p><strong>Total Value:</strong> ${player.value?.toLocaleString() || 'N/A'}</p>
            <p><strong>APY:</strong> ${player.apy?.toLocaleString() || 'N/A'}</p>
            <p><strong>Guaranteed:</strong> ${player.guaranteed?.toLocaleString() || 'N/A'}</p>
            <p><strong>APY Cap %:</strong> {(player.apy_cap_pct !== null && player.apy_cap_pct !== undefined) ? `${(player.apy_cap_pct * 100).toFixed(1)}%` : 'N/A'}</p>
            <p><strong>Inflated Value:</strong> ${player.inflated_value?.toLocaleString() || 'N/A'}</p>
            <p><strong>Inflated Guaranteed:</strong> ${player.inflated_guaranteed?.toLocaleString() || 'N/A'}</p>
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
      </div>
    </>
  );
}
