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
      SELECT * FROM NextGen_Stats_Receiving WHERE player_gsis_id = ? AND season = 2024
    `, [playerId]);

    const [advancedRushing] = await connection.execute(`
      SELECT * FROM NextGen_Stats_Rushing WHERE player_id = ? AND season = 2024
    `, [playerId]);

    const [advancedPassing] = await connection.execute(`
      SELECT * FROM NextGen_Stats_Passing WHERE player_id = ? AND season = 2024
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Player Header */}
            <div className="flex flex-col items-center lg:items-start space-y-4">
              <img src={player.headshot_url} alt={`${player.player_name} headshot`} className="w-32 h-32 rounded-full object-cover" />
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight">{player.player_name}</h1>
                <p className="text-base uppercase tracking-wide font-semibold text-gray-600">{player.position} - {player.recent_team}</p>
              </div>
            </div>

            {/* Bio and Draft Info */}
            <div className="bg-slate-50 p-4 rounded shadow">
              <h2 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">Bio & Draft Info</h2>
              <p><strong>College:</strong> {player.college || 'N/A'}</p>
              <p><strong>Draft Team:</strong> {player.draft_team || 'N/A'}</p>
              <p><strong>Draft Round:</strong> {player.draft_round || 'N/A'}</p>
              <p><strong>Draft Pick:</strong> {player.draft_pick || 'N/A'}</p>
              <p><strong>Draft Year:</strong> {player.draft_year || 'N/A'}</p>
            </div>

            {/* Contract Info */}
            <div className="bg-slate-50 p-4 rounded shadow">
              <h2 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">Contract Info</h2>
              <p><strong>Base Salary:</strong> {player.base_salary ? `$${player.base_salary.toLocaleString()}` : 'N/A'}</p>
              <p><strong>Cap Hit:</strong> {player.cap_hit ? `$${player.cap_hit.toLocaleString()}` : 'N/A'}</p>
              <p><strong>Dead Money:</strong> {player.dead_money ? `$${player.dead_money.toLocaleString()}` : 'N/A'}</p>
              <p><strong>Cap Savings:</strong> {player.cap_savings ? `$${player.cap_savings.toLocaleString()}` : 'N/A'}</p>
            </div>
          </div>

          {/* Center Content */}
          <div className="space-y-8">
            {/* Career Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {player.career && (
                <div className="bg-neutral-100 p-4 rounded shadow">
                  <h3 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">Receiving Career</h3>
                  <p><strong>Games:</strong> {player.career.games}</p>
                  <p><strong>Yards:</strong> {player.career.yards}</p>
                  <p><strong>Touchdowns:</strong> {player.career.tds}</p>
                </div>
              )}
              {player.rushingCareer && (
                <div className="bg-neutral-100 p-4 rounded shadow">
                  <h3 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">Rushing Career</h3>
                  <p><strong>Games:</strong> {player.rushingCareer.games}</p>
                  <p><strong>Yards:</strong> {player.rushingCareer.yards}</p>
                  <p><strong>Touchdowns:</strong> {player.rushingCareer.tds}</p>
                </div>
              )}
              {player.passingCareer && (
                <div className="bg-neutral-100 p-4 rounded shadow">
                  <h3 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">Passing Career</h3>
                  <p><strong>Games:</strong> {player.passingCareer.games}</p>
                  <p><strong>Completions:</strong> {player.passingCareer.completions}</p>
                  <p><strong>Attempts:</strong> {player.passingCareer.attempts}</p>
                  <p><strong>Yards:</strong> {player.passingCareer.yards}</p>
                  <p><strong>Touchdowns:</strong> {player.passingCareer.tds}</p>
                  <p><strong>Interceptions:</strong> {player.passingCareer.ints}</p>
                </div>
              )}
            </div>

            {/* Receiving Stats */}
            {receivingMetrics?.some(g => g.targets > 0 || g.receptions > 0 || g.receiving_yards > 0 || g.rec_touchdowns > 0) && (
              <div>
                <h2 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">2024 Receiving Stats</h2>
                <div className="overflow-x-auto bg-white p-4 rounded shadow">
                  <table className="table-auto w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Week</th>
                        <th className="text-left p-2">Opponent</th>
                        <th className="text-left p-2">Targets</th>
                        <th className="text-left p-2">Rec</th>
                        <th className="text-left p-2">Yards</th>
                        <th className="text-left p-2">TDs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receivingMetrics.map((g, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-2">{g.week}</td>
                          <td className="p-2">{g.opponent_team}</td>
                          <td className="p-2">{g.targets}</td>
                          <td className="p-2">{g.receptions}</td>
                          <td className="p-2">{g.receiving_yards}</td>
                          <td className="p-2">{g.rec_touchdowns}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Rushing Stats */}
            {rushingMetrics?.some(g => g.carries > 0 || g.rushing_yards > 0 || g.rushing_tds > 0) && (
              <div>
                <h2 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">2024 Rushing Stats</h2>
                <div className="overflow-x-auto bg-white p-4 rounded shadow">
                  <table className="table-auto w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Week</th>
                        <th className="text-left p-2">Opponent</th>
                        <th className="text-left p-2">Carries</th>
                        <th className="text-left p-2">Yards</th>
                        <th className="text-left p-2">TDs</th>
                        <th className="text-left p-2">EPA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rushingMetrics.map((g, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-2">{g.week}</td>
                          <td className="p-2">{g.opponent_team}</td>
                          <td className="p-2">{g.carries}</td>
                          <td className="p-2">{g.rushing_yards}</td>
                          <td className="p-2">{g.rushing_tds}</td>
                          <td className="p-2">{typeof g.rushing_epa === 'number' ? g.rushing_epa.toFixed(2) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Passing Stats */}
            {passingMetrics?.some(g => g.completions > 0 || g.attempts > 0 || g.passing_yards > 0 || g.passing_tds > 0 || g.interceptions > 0) && (
              <div>
                <h2 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">2024 Passing Stats</h2>
                <div className="overflow-x-auto bg-white p-4 rounded shadow">
                  <table className="table-auto w-full text-xs">
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
                        <tr key={idx} className="border-b hover:bg-gray-50">
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

            {/* Advanced Passing Metrics */}
            {advancedPassing && (
              <div>
                <h2 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">2024 Advanced Passing Metrics</h2>
                <div className="bg-neutral-100 p-4 rounded shadow">
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

          {/* Right Sidebar: Snaps Charts */}
          <div className="space-y-8">
            <div className="bg-slate-50 p-4 rounded shadow flex flex-col items-center">
              <h2 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">Snaps</h2>
              {/* Placeholder Donut Chart */}
              <div className="w-40 h-40 rounded-full border-8 border-gray-300 flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-gray-500">75%</span>
              </div>
              {/* Placeholder Weekly Bar Graph */}
              <div className="w-full space-y-1">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-6 text-xs text-gray-600">W{i + 1}</div>
                    <div className="h-4 bg-blue-500 rounded" style={{ width: `${Math.floor(Math.random() * 100)}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}