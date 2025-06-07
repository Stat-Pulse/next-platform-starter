import mysql from 'mysql2/promise';
import Head from 'next/head';
import { useRef, useEffect, useState } from 'react'; // Kept for potential future use, but not needed for the carousel itself

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

    if (profileRows.length === 0) {
      return { notFound: true };
    }
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

  // You can add a console.log here for debugging during development if you want
  // console.log("Player Data on Page:", player);
  
  return (
    <>
      <Head>
        <title>{player.player_name} | StatPulse Profile</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Block */}
        <div className="bg-white rounded shadow flex flex-col md:flex-row items-center md:items-end md:justify-between px-6 py-6 mb-8">
          <div className="flex items-center space-x-6 w-full">
            <img src={player.headshot_url} alt={`${player.player_name} headshot`} className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow" />
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">{player.player_name}</h1>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-base uppercase tracking-wide font-semibold text-gray-600">{player.position}</span>
                <span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span>
                <span className="text-base font-semibold text-gray-700">{player.recent_team}</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <span className="mr-4"><strong>Height:</strong> {player.height || 'N/A'}</span>
                <span className="mr-4"><strong>Weight:</strong> {player.weight || 'N/A'}</span>
                <span><strong>Age:</strong> {player.age || 'N/A'}</span>
              </div>
              <div className="mt-1 text-sm text-gray-500">
                <span className="mr-4"><strong>College:</strong> {player.college || 'N/A'}</span>
                <span className="mr-4"><strong>Draft:</strong> {player.draft_round ? `R${player.draft_round}, P${player.draft_pick}, ${player.draft_team}` : 'N/A'}</span>
              </div>
              <div className="text-sm text-gray-500">
                <span className="mr-4"><strong>Base Salary:</strong> {player.base_salary ? `$${player.base_salary.toLocaleString()}` : 'N/A'}</span>
                <span className="mr-4"><strong>Cap Hit:</strong> {player.cap_hit ? `$${player.cap_hit.toLocaleString()}` : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">Player Summary</h2>
              <p>
                This player is currently active and contributing as a <span className="font-semibold">{player.position}</span> for the <span className="font-semibold">{player.recent_team}</span>.
              </p>
            </div>
          </div>

          {/* Center Column */}
          <div className="space-y-8">
            
            {/* --- CORRECTED CAREER SUMMARY CAROUSEL --- */}
            <div className="relative">
              <div className="overflow-x-auto py-6 scrollbar-hide">
                <div
                  className="flex space-x-4 snap-x snap-mandatory px-4"
                  style={{ scrollPadding: '1rem' }}
                >
                  {/* Receiving Card (with condition) */}
                  {player.career && (
                    <div className="bg-white p-4 rounded shadow-lg min-w-[220px] snap-start flex-shrink-0">
                      <h3 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">Receiving Career</h3>
                      <p><strong>Games:</strong> {player.career.games}</p>
                      <p><strong>Yards:</strong> {player.career.yards}</p>
                      <p><strong>Touchdowns:</strong> {player.career.tds}</p>
                    </div>
                  )}

                  {/* Rushing Card (with condition) */}
                  {player.rushingCareer && (player.rushingCareer.yards > 0 || player.rushingCareer.tds > 0) && (
                    <div className="bg-white p-4 rounded shadow-lg min-w-[220px] snap-start flex-shrink-0">
                      <h3 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">Rushing Career</h3>
                      <p><strong>Games:</strong> {player.rushingCareer.games}</p>
                      <p><strong>Yards:</strong> {player.rushingCareer.yards}</p>
                      <p><strong>Touchdowns:</strong> {player.rushingCareer.tds}</p>
                    </div>
                  )}

                  {/* Passing Card (with condition) */}
                  {player.passingCareer && (player.passingCareer.yards > 0 || player.passingCareer.tds > 0 || player.passingCareer.completions > 0) && (
                    <div className="bg-white p-4 rounded shadow-lg min-w-[220px] snap-start flex-shrink-0">
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
              </div>
            </div>
            
            {/* Receiving Stats */}
            {receivingMetrics?.some(g => g.targets > 0 || g.receptions > 0 || g.receiving_yards > 0 || g.rec_touchdowns > 0) && (
              <div>
                <h2 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">2024 Receiving Stats</h2>
                <div className="overflow-x-auto bg-white p-4 rounded shadow">
                  <table className="table-auto w-full text-xs">
                    {/* ... table content ... */}
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
                    {/* ... table content ... */}
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
                    {/* ... table content ... */}
                  </table>
                </div>
              </div>
            )}
            {/* Advanced Passing Metrics */}
            {advancedPassing && (
              <div>
                <h2 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">2024 Advanced Passing Metrics</h2>
                <div className="bg-white p-4 rounded shadow">
                  {/* ... advanced stats content ... */}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-white p-4 rounded shadow flex flex-col items-center">
              <h2 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">Snaps</h2>
              <div className="w-40 h-40 rounded-full border-8 border-gray-200 flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-gray-500">75%</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded shadow flex flex-col items-center">
              {/* ... bar graph content ... */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}