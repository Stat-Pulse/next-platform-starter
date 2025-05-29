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
          <div>
            <h2 className="text-xl font-semibold mb-2">Player Info</h2>
            <p><strong>Position:</strong> {player.position}</p>
            <p><strong>Team:</strong> {player.team_abbr} ({player.team_name})</p>
            <p><strong>College:</strong> {player.college}</p>
            <p><strong>Height / Weight:</strong> {player.height_inches} in / {player.weight_pounds} lbs</p>
            <p><strong>Birth Date:</strong> {player.date_of_birth}</p>
            <p><strong>Status:</strong> {player.is_active ? "Active" : "Inactive"}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Draft & Contract</h2>
            <p><strong>Drafted:</strong> {player.draft_season} | {player.draft_team} | Round {player.draft_round}, Pick {player.draft_pick}</p>
            <p><strong>Contract Type:</strong> {player.contract_type || 'N/A'} ({player.contract_year || '—'})</p>
            <p><strong>Base Salary:</strong> ${player.base_salary?.toLocaleString() || 'N/A'}</p>
            <p><strong>Cap Hit:</strong> ${player.cap_number?.toLocaleString() || 'N/A'}</p>
            <p><strong>Dead Cap:</strong> ${player.dead_cap?.toLocaleString() || 'N/A'}</p>
            <p><strong>Cap Savings:</strong> ${player.cap_savings?.toLocaleString() || 'N/A'}</p>
          </div>
        </div>
      </div>
    </>
  );
}
