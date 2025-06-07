// Extend the Player Profile page with rushing and passing stats
import mysql from 'mysql2/promise';
import Head from 'next/head';
import { useRef, useEffect, useState } from 'react';

// Add getServerSideProps wrapper for async server logic
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
      `
      SELECT p.*, d.team AS current_team_abbr, t.primary_color
      FROM Active_Player_Profiles p
      LEFT JOIN Depth_Charts d 
        ON p.player_id = d.player_id 
        AND (d.season, d.week) = (
          SELECT season, week FROM Depth_Charts 
          WHERE player_id = p.player_id 
          ORDER BY season DESC, week DESC 
          LIMIT 1
        )
      LEFT JOIN Teams t ON d.team = t.team_abbr
      WHERE p.player_id = ? LIMIT 1
      `,
      [playerId]
    );
    if (profileRows.length === 0) return { notFound: true };
    const player = profileRows[0];

    // Fetch contract info (example: from a table called Player_Contracts, or add to Active_Player_Profiles if present)
    // This assumes contract_year, base_salary, cap_hit are columns in Active_Player_Profiles

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
        player: {
          ...player,
          team_abbr: player.current_team_abbr || player.team_abbr || null,
          primary_color: player.primary_color || '#004C54',
          contract_year: player.contract_year || null,
          base_salary: player.base_salary || null,
          cap_hit: player.cap_hit || null,
          career,
          rushingCareer,
          passingCareer
        },
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
  // --- Career Summary Carousel State ---
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef();
  // Count how many career summary cards exist (for dots)
  const numDots = 3;
  // Scroll handler to update activeIndex
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const width = el.clientWidth;
      // Find the index of the visible card (approx card width 240px)
      const index = Math.round(scrollLeft / 240);
      setActiveIndex(index);
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // Debug player data for carousel
  console.log("Player Data for Carousel:", player);
  return (
    <>
      <Head>
        <title>{player.player_name} | StatPulse Profile</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="relative mb-8">
          {/* Background Stripe */}
          <div className="absolute inset-0" style={{ backgroundColor: player.primary_color || '#004C54' }}></div>

          {/* Main Header Content */}
          <div className="relative bg-white bg-opacity-90 rounded shadow px-6 py-6 flex flex-col md:flex-row items-center md:items-end justify-between">
            <div className="flex items-center space-x-6">
              <img
                src={player.headshot_url}
                alt={`${player.player_name} headshot`}
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                  {player.player_name}
                </h1>
                <div className="text-xl font-semibold text-gray-700 mt-1">
                  {player.position} {player.jersey_number ? `#${player.jersey_number}` : ''}
                </div>
                <div className="text-sm text-gray-600 mt-1 space-x-4">
                  <span><strong>DOB:</strong> {player.date_of_birth ? new Date(player.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span>
                  <span><strong>Height:</strong> {player.height_inches ? `${player.height_inches} in` : 'N/A'}</span>
                  <span><strong>Weight:</strong> {player.weight_pounds ? `${player.weight_pounds} lbs` : 'N/A'}</span>
                  <span><strong>Team:</strong> {player.team_abbr || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              {/* Team Name */}
              <span className="text-lg font-semibold text-gray-800">
                {player.recent_team}
              </span>
            </div>
            {/* End team name */}
          </div>

          {/* Stats Row */}
          <div className="relative bg-white rounded shadow px-4 py-4 -mt-4 z-10">
            <div className="grid grid-cols-2 md:grid-cols-9 gap-4 text-center text-sm text-gray-700">
              <div>
                <span className="block font-semibold">COLLEGE</span>
                <span>{player.college || 'N/A'}</span>
              </div>
              <div>
                <span className="block font-semibold">DRAFT YEAR</span>
                <span>{player.draft_year || 'N/A'}</span>
              </div>
              <div>
                <span className="block font-semibold">DRAFT TEAM</span>
                <span>{player.draft_team || 'N/A'}</span>
              </div>
              <div>
                <span className="block font-semibold">ROUND</span>
                <span>{player.draft_round || 'N/A'}</span>
              </div>
              <div>
                <span className="block font-semibold">SELECTION</span>
                <span>{player.draft_pick || 'N/A'}</span>
              </div>
              <div>
                <span className="block font-semibold">CONTRACT VALUE</span>
                <span>{player.value ? `$${Number(player.value).toLocaleString()}M` : 'N/A'}</span>
              </div>
              <div>
                <span className="block font-semibold">AVG/YEAR</span>
                <span>{player.apy ? `$${Number(player.apy).toLocaleString()}M` : 'N/A'}</span>
              </div>
              <div>
                <span className="block font-semibold">GUARANTEED</span>
                <span>{player.guaranteed ? `$${Number(player.guaranteed).toLocaleString()}M` : 'N/A'}</span>
              </div>
              <div>
                <span className="block font-semibold">CAP %</span>
                <span>{player.apy_cap_pct ? (Number(player.apy_cap_pct) * 100).toFixed(1) + '%' : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Player Info Card */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">Player Summary</h2>
              <p>
                This player is currently active and contributing as a <span className="font-semibold">{player.position}</span> for the <span className="font-semibold">{player.recent_team}</span>.
              </p>
            </div>
          </div>
          {/* Center Column */}
          <div className="space-y-8">
            {/* Career Summary Carousel */}
<div className="relative">
  <div
    className="overflow-x-auto px-0 py-6 relative hide-scrollbar"
    ref={scrollRef}
    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
  >
    <div
      className="flex snap-x snap-mandatory"
      style={{ scrollPadding: '1rem' }}
    >
      {/* Receiving Career Card */}
      <div className="bg-white p-4 rounded shadow-lg min-w-full snap-center">
        <h3 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">
          Receiving Career
        </h3>
        <p><strong>Games:</strong> {player.career?.games}</p>
        <p><strong>Yards:</strong> {player.career?.yards}</p>
        <p><strong>Touchdowns:</strong> {player.career?.tds}</p>
      </div>

      {/* Rushing Career Card */}
      <div className="bg-white p-4 rounded shadow-lg min-w-full snap-center">
        <h3 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">
          Rushing Career
        </h3>
        <p><strong>Games:</strong> {player.rushingCareer?.games}</p>
        <p><strong>Yards:</strong> {player.rushingCareer?.yards}</p>
        <p><strong>Touchdowns:</strong> {player.rushingCareer?.tds}</p>
      </div>

      {/* Passing Career Card */}
      <div className="bg-white p-4 rounded shadow-lg min-w-full snap-center">
        <h3 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">
          Passing Career
        </h3>
        <p><strong>Games:</strong> {player.passingCareer?.games}</p>
        <p><strong>Completions:</strong> {player.passingCareer?.completions}</p>
        <p><strong>Attempts:</strong> {player.passingCareer?.attempts}</p>
        <p><strong>Yards:</strong> {player.passingCareer?.yards}</p>
        <p><strong>Touchdowns:</strong> {player.passingCareer?.tds}</p>
        <p><strong>Interceptions:</strong> {player.passingCareer?.ints}</p>
      </div>
    </div>
  </div>

  {/* Dot Pagination */}
  <div className="flex justify-center space-x-2 mt-2">
    {Array.from({ length: numDots }).map((_, idx) => (
      <button
        key={idx}
        onClick={() => {
          scrollRef.current.scrollTo({
            left: idx * scrollRef.current.clientWidth,
            behavior: 'smooth'
          });
        }}
        className={`h-2 w-2 rounded-full ${idx === activeIndex ? 'bg-gray-800' : 'bg-gray-300'}`}
        aria-label={`Go to slide ${idx + 1}`}
      />
    ))}
  </div>
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
          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-white p-4 rounded shadow flex flex-col items-center">
              <h2 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">Snaps</h2>
              {/* Placeholder Donut Chart */}
              <div className="w-40 h-40 rounded-full border-8 border-gray-200 flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-gray-500">75%</span>
              </div>
            </div>
            {/* Weekly Bar Graph Card */}
            <div className="bg-white p-4 rounded shadow flex flex-col items-center">
              <div className="text-sm font-semibold mb-2 flex justify-between w-full">
                <span>Weekly Targets vs. Receptions</span>
                <div className="flex space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <span className="w-3 h-3 bg-blue-500 inline-block rounded-sm"></span><span>Targets</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-3 h-3 bg-blue-300 inline-block rounded-sm"></span><span>Receptions</span>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-1">
                {(receivingMetrics && receivingMetrics.length > 0 ? receivingMetrics : [...Array(10)].map((_, i) => ({
                  week: i + 1,
                  targets: Math.floor(Math.random() * 10),
                  receptions: Math.floor(Math.random() * 10)
                }))).map((g, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-6 text-xs text-gray-600">W{g.week}</div>
                    <div className="h-4 bg-blue-500 rounded" style={{ width: `${g.targets || 0}px`, minWidth: '4px' }}></div>
                    <div className="h-4 bg-blue-300 rounded" style={{ width: `${g.receptions || 0}px`, minWidth: '4px' }}></div>
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