// Extend the Player Profile page with rushing and passing stats
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

    const [profileRows] = await connection.execute(
      `SELECT * FROM Active_Player_Profiles WHERE player_id = ? LIMIT 1`,
      [playerId]
    );
    if (profileRows.length === 0) return { notFound: true };
    const player = profileRows[0];

    const [receivingMetrics] = await connection.execute(`
      SELECT week, season, recent_team, opponent_team, targets, receptions, receiving_yards, receiving_tds AS rec_touchdowns
      FROM Player_Stats_Game_All
      WHERE player_id = ? AND season = 2024 AND receiving_yards IS NOT NULL
      ORDER BY week
    `, [playerId]);

    const [passingMetrics] = await connection.execute(`
      SELECT week, season, recent_team, opponent_team, completions, attempts, passing_yards, passing_tds, interceptions, passing_epa
      FROM Player_Stats_Game_All
      WHERE player_id = ? AND season = 2024 AND attempts IS NOT NULL
      ORDER BY week
    `, [playerId]);

    const [rushingMetrics] = await connection.execute(`
      SELECT week, season, recent_team, opponent_team, carries, rushing_yards, rushing_tds, rushing_epa, rushing_fumbles, rushing_fumbles_lost, rushing_first_downs
      FROM Player_Stats_Game_All
      WHERE player_id = ? AND season = 2024 AND carries IS NOT NULL
      ORDER BY week
    `, [playerId]);

    const [advancedReceiving] = await connection.execute(`
      SELECT * FROM NextGen_Stats_Receiving WHERE gsis_id = ? AND season = 2024
    `, [playerId]);

    const [advancedRushing] = await connection.execute(`
      SELECT * FROM NextGen_Stats_Rushing WHERE gsis_id = ? AND season = 2024
    `, [playerId]);

    const [advancedPassing] = await connection.execute(`
      SELECT * FROM NextGen_Stats_Passing WHERE gsis_id = ? AND season = 2024
    `, [playerId]);

    const rushingCareer = rushingMetrics.length > 0 ? {
      games: rushingMetrics.length,
      yards: rushingMetrics.reduce((sum, g) => sum + (g.rushing_yards || 0), 0),
      tds: rushingMetrics.reduce((sum, g) => sum + (g.rushing_tds || 0), 0),
    } : null;

    const passingCareer = passingMetrics.length > 0 ? {
      games: passingMetrics.length,
      completions: passingMetrics.reduce((sum, g) => sum + (g.completions || 0), 0),
      attempts: passingMetrics.reduce((sum, g) => sum + (g.attempts || 0), 0),
      yards: passingMetrics.reduce((sum, g) => sum + (g.passing_yards || 0), 0),
      tds: passingMetrics.reduce((sum, g) => sum + (g.passing_tds || 0), 0),
      ints: passingMetrics.reduce((sum, g) => sum + (g.interceptions || 0), 0)
    } : null;

    const career = receivingMetrics.length > 0 ? {
      games: receivingMetrics.length,
      yards: receivingMetrics.reduce((sum, g) => sum + (g.receiving_yards || 0), 0),
      tds: receivingMetrics.reduce((sum, g) => sum + (g.rec_touchdowns || 0), 0),
    } : null;

    return {
      props: {
        player: { ...player, career, rushingCareer, passingCareer },
        receivingMetrics,
        rushingMetrics,
        passingMetrics,
        advancedMetrics: advancedReceiving[0] || null,
        advancedRushing: advancedRushing[0] || null,
        advancedPassing: advancedPassing[0] || null
      }
    };
  } catch (error) {
    console.error('Database error:', error);
    return { notFound: true };
  } finally {
    if (connection) await connection.end();
  }
}

export default function PlayerPage({ player, receivingMetrics, rushingMetrics, passingMetrics, advancedMetrics, advancedRushing, advancedPassing }) {
  return (
    <>
      <Head>
        <title>{player.player_name} | StatPulse Profile</title>
      </Head>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* ...existing sections... */}

        {passingMetrics?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-2">2024 Passing Stats</h2>
            <div className="overflow-x-auto bg-white p-4 rounded shadow">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Week</th>
                    <th className="text-left p-2">Opponent</th>
                    <th className="text-left p-2">Comp</th>
                    <th className="text-left p-2">Att</th>
                    <th className="text-left p-2">Yards</th>
                    <th className="text-left p-2">TDs</th>
                    <th className="text-left p-2">INTs</th>
                    <th className="text-left p-2">EPA</th>
                  </tr>
                </thead>
                <tbody>
                  {passingMetrics.map((g, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{g.week}</td>
                      <td className="p-2">{g.opponent_team}</td>
                      <td className="p-2">{g.completions}</td>
                      <td className="p-2">{g.attempts}</td>
                      <td className="p-2">{g.passing_yards}</td>
                      <td className="p-2">{g.passing_tds}</td>
                      <td className="p-2">{g.interceptions}</td>
                      <td className="p-2">{typeof g.passing_epa === 'number' ? g.passing_epa.toFixed(2) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {advancedPassing && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-2">2024 Advanced Passing Metrics</h2>
            <div className="bg-white p-4 rounded shadow">
              <p><strong>Avg Time to Throw:</strong> {typeof advancedPassing.avg_time_to_throw === 'number' ? advancedPassing.avg_time_to_throw.toFixed(2) + ' sec' : 'N/A'}</p>
              <p><strong>Avg Completed Air Yards:</strong> {typeof advancedPassing.avg_completed_air_yards === 'number' ? advancedPassing.avg_completed_air_yards.toFixed(2) : 'N/A'}</p>
              <p><strong>Avg Intended Air Yards:</strong> {typeof advancedPassing.avg_intended_air_yards === 'number' ? advancedPassing.avg_intended_air_yards.toFixed(2) : 'N/A'}</p>
              <p><strong>Avg Air Yards Differential:</strong> {typeof advancedPassing.avg_air_yards_differential === 'number' ? advancedPassing.avg_air_yards_differential.toFixed(2) : 'N/A'}</p>
              <p><strong>Aggressiveness:</strong> {typeof advancedPassing.aggressiveness === 'number' ? advancedPassing.aggressiveness.toFixed(1) + '%' : 'N/A'}</p>
              <p><strong>Max Completed Air Distance:</strong> {typeof advancedPassing.max_completed_air_distance === 'number' ? advancedPassing.max_completed_air_distance.toFixed(1) : 'N/A'}</p>
              <p><strong>Expected Completion %:</strong> {typeof advancedPassing.expected_completion_percentage === 'number' ? advancedPassing.expected_completion_percentage.toFixed(1) + '%' : 'N/A'}</p>
              <p><strong>Completion % Over Expectation:</strong> {typeof advancedPassing.completion_percentage_above_expectation === 'number' ? advancedPassing.completion_percentage_above_expectation.toFixed(1) + '%' : 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}