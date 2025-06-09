// Extend the Player Profile page with rushing and passing stats
import SeasonStatsTable from '@/components/player/SeasonStatsTable';
import Head from 'next/head';
import { useRef, useEffect, useState } from 'react';

export async function getServerSideProps({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/player/${params.id}`;
  console.log("Fetching player from:", url);

  try {
    const res = await fetch(url);
    console.log("Response status:", res.status);
    if (!res.ok) {
      return { notFound: true };
    }

    const data = await res.json();
    // Fetch advanced passing stats from the backend and attach to player object
    // (Assumes API route already includes advancedPassing in its response)
    // If not, you could fetch from a separate endpoint here.
    console.log("Fetched player data successfully");
    return { props: data };
  } catch (error) {
    console.error("Error fetching player:", error.message);
    return { notFound: true };
  }
}

export default function PlayerPage({ player, seasonStats, receivingMetrics, advancedMetrics, advancedRushing }) {
  // --- Career Summary Carousel State ---
  const [activeIndex, setActiveIndex] = useState(0);
  const [bgColor, setBgColor] = useState('#004C54');
  const scrollRef = useRef();
  // Count how many career summary cards exist (for dots)
  const numDots = 3;
  // Remove local empty arrays for seasonStats, rushingMetrics, passingMetrics; use props instead
  const advancedPassing = player?.advancedPassing || null;

  useEffect(() => {
    if (player?.primary_color) {
      setBgColor(player.primary_color);
    }
  }, [player?.primary_color]);

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

  if (!player) {
    return <div>Player not found</div>;
  }

  // Debug player data for carousel
  console.log("Player Data for Carousel:", player);
  // Debug: Log the resolved color
  console.log("Resolved color:", player.primary_color);
  return (
    <>
      <Head>
        <title>{player.player_name} | StatPulse Profile</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="relative mb-8">
          {/* Background Stripe */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: player.primary_color ?? bgColor,
              borderBottom: `4px solid ${player.secondary_color ?? '#000'}`
            }}
          ></div>

          {/* Main Header Content */}
          <div className="relative bg-white bg-opacity-90 rounded shadow px-6 py-6 flex flex-col md:flex-row items-center md:items-end justify-between">
            <div className="flex items-center space-x-6">
              <img
                src={player.headshot_url}
                alt={`${player.player_name} headshot`}
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {typeof player.team_logo === 'string' && player.team_logo.trim() !== '' && (
                <img
                  src={player.team_logo || '/default-logo.png'}
                  alt={`${player.team_abbr || 'team'} logo`}
                  className="w-12 h-12 object-contain"
                />
              )}
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
            {/* Add ESPN team logo in top-right */}
            <div className="absolute top-4 right-4 flex flex-col items-end">
              {player.team_logo_espn && (
                <img
                  src={player.team_logo_espn}
                  alt={`${player.team_abbr || 'team'} ESPN logo`}
                  className="w-32 h-32 object-contain mb-2"
                />
              )}
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              {/* Team Name */}
              <span className="text-lg font-semibold text-gray-800">
                {player.recent_team}
              </span>
            </div>
            {/* End team name */}
          </div>

          {/* Season Stats Table */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Season Stats</h2>
            {seasonStats && seasonStats.length > 0 ? (
              <SeasonStatsTable stats={seasonStats} />
            ) : (
              <p className="text-sm text-gray-500">No season stats available.</p>
            )}
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
                <span>{player.draft_year ?? 'N/A'}</span>
              </div>
              <div>
                <span className="block font-semibold">DRAFT TEAM</span>
                <span>{player.draft_team || player.team_abbr || 'N/A'}</span>
              </div>
              <div>
                <span className="block font-semibold">ROUND</span>
                <span>{player.draft_round ?? 'N/A'}</span>
              </div>
              <div>
                <span className="block font-semibold">SELECTION</span>
                <span>{player.draft_overall ?? player.draft_pick ?? 'N/A'}</span>
              </div>
              <div>
                <span className="block font-semibold">CONTRACT VALUE</span>
                <span>{player.contract_value ? `$${Number(player.contract_value).toLocaleString()}M` : 'N/A'}</span>
              </div>
              <div>
                <span className="block font-semibold">AVG/YEAR</span>
                <span>{player.contract_apy ? `$${Number(player.contract_apy).toLocaleString()}M` : 'N/A'}</span>
              </div>
              <div>
                <span className="block font-semibold">GUARANTEED</span>
                <span>{player.contract_guaranteed ? `$${Number(player.contract_guaranteed).toLocaleString()}M` : 'N/A'}</span>
              </div>
              <div>
                <span className="block font-semibold">CAP %</span>
                <span>{player.contract_apy_cap_pct ? `${(Number(player.contract_apy_cap_pct) * 100).toFixed(1)}%` : 'N/A'}</span>
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
        <p><strong>Seasons Played:</strong> {player.career?.receiving?.seasons}</p>
        <p><strong>Games Played:</strong> {player.career?.receiving?.games}</p>
        <p><strong>Receiving Yards:</strong> {player.career?.receiving?.yards}</p>
        <p><strong>Receiving Touchdowns:</strong> {player.career?.receiving?.tds}</p>
      </div>

      {/* Rushing Career Card */}
      <div className="bg-white p-4 rounded shadow-lg min-w-full snap-center">
        <h3 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">
          Rushing Career
        </h3>
        <p><strong>Games:</strong> {player.career?.rushing?.games}</p>
        <p><strong>Yards:</strong> {player.career?.rushing?.yards}</p>
        <p><strong>Touchdowns:</strong> {player.career?.rushing?.tds}</p>
      </div>

      {/* Passing Career Card */}
      <div className="bg-white p-4 rounded shadow-lg min-w-full snap-center">
        <h3 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">
          Passing Career
        </h3>
        <p><strong>Games:</strong> {player.career?.passing?.games}</p>
        <p><strong>Completions:</strong> {player.career?.passing?.completions}</p>
        <p><strong>Attempts:</strong> {player.career?.passing?.attempts}</p>
        <p><strong>Yards:</strong> {player.career?.passing?.yards}</p>
        <p><strong>Touchdowns:</strong> {player.career?.passing?.tds}</p>
        <p><strong>Interceptions:</strong> {player.career?.passing?.ints}</p>
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
            {Array.isArray(advancedRushing) && advancedRushing?.some(g => g.carries > 0 || g.rushing_yards > 0 || g.rushing_tds > 0) && (
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
                      {advancedRushing.map((g, idx) => (
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
            {Array.isArray(player?.passingMetrics) && player.passingMetrics?.some(g => g.completions > 0 || g.attempts > 0 || g.passing_yards > 0 || g.passing_tds > 0 || g.interceptions > 0) && (
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
                      {player.passingMetrics.map((g, idx) => (
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
            {/* Advanced Passing Stats */}
            {advancedPassing && typeof advancedPassing === "object" && !Array.isArray(advancedPassing) && (
              <div>
                <h2 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">2024 Advanced Passing Stats</h2>
                <div className="bg-white p-4 rounded shadow space-y-2">
                  <p><strong>Avg Time to Throw:</strong> {advancedPassing.avg_time_to_throw?.toFixed(2) ?? 'N/A'} sec</p>
                  <p><strong>Avg Completed Air Yards:</strong> {advancedPassing.avg_completed_air_yards?.toFixed(2) ?? 'N/A'}</p>
                  <p><strong>Avg Intended Air Yards:</strong> {advancedPassing.avg_intended_air_yards?.toFixed(2) ?? 'N/A'}</p>
                  <p><strong>Air Yards Differential:</strong> {advancedPassing.avg_air_yards_differential?.toFixed(2) ?? 'N/A'}</p>
                  <p><strong>Aggressiveness:</strong> {advancedPassing.aggressiveness?.toFixed(1) ?? 'N/A'}%</p>
                  <p><strong>Max Completed Air Distance:</strong> {advancedPassing.max_completed_air_distance?.toFixed(1) ?? 'N/A'}</p>
                  <p><strong>Air Yards to Sticks:</strong> {advancedPassing.avg_air_yards_to_sticks?.toFixed(2) ?? 'N/A'}</p>
                  <p><strong>Passer Rating:</strong> {advancedPassing.passer_rating?.toFixed(1) ?? 'N/A'}</p>
                  <p><strong>Completion %:</strong> {advancedPassing.completion_percentage?.toFixed(1) ?? 'N/A'}%</p>
                  <p><strong>Expected Comp %:</strong> {advancedPassing.expected_completion_percentage?.toFixed(1) ?? 'N/A'}%</p>
                  <p><strong>CPOE:</strong> {advancedPassing.completion_percentage_above_expectation?.toFixed(2) ?? 'N/A'}%</p>
                  <p><strong>Avg Air Distance:</strong> {advancedPassing.avg_air_distance?.toFixed(2) ?? 'N/A'}</p>
                  <p><strong>Max Air Distance:</strong> {advancedPassing.max_air_distance?.toFixed(2) ?? 'N/A'}</p>
                </div>
              </div>
            )}
            {/* Advanced Receiving Metrics */}
            {advancedMetrics && typeof advancedMetrics === "object" && !Array.isArray(advancedMetrics) && (
              <div>
                <h2 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">2024 Advanced Receiving Metrics</h2>
                <div className="bg-white p-4 rounded shadow">
                  <p><strong>Avg Cushion:</strong> {typeof advancedMetrics.avg_cushion === 'number' ? advancedMetrics.avg_cushion.toFixed(2) + ' yds' : 'N/A'}</p>
                  <p><strong>Avg Separation:</strong> {typeof advancedMetrics.avg_separation === 'number' ? advancedMetrics.avg_separation.toFixed(2) + ' yds' : 'N/A'}</p>
                  <p><strong>Air Yards Share:</strong> {typeof advancedMetrics.percent_share_of_intended_air_yards === 'number' ? (advancedMetrics.percent_share_of_intended_air_yards * 100).toFixed(1) + '%' : 'N/A'}</p>
                  <p><strong>Avg YAC Over Expectation:</strong> {typeof advancedMetrics.avg_yac_above_expectation === 'number' ? advancedMetrics.avg_yac_above_expectation.toFixed(2) : 'N/A'}</p>
                  <p><strong>Receiving EPA:</strong> {typeof advancedMetrics.receiving_epa === 'number' ? advancedMetrics.receiving_epa.toFixed(2) : 'N/A'}</p>
                  <p><strong>WOPR:</strong> {typeof advancedMetrics.wopr === 'number' ? advancedMetrics.wopr.toFixed(3) : 'N/A'}</p>
                </div>
              </div>
            )}
            {/* Advanced Rushing Metrics */}
            {advancedRushing && typeof advancedRushing === "object" && !Array.isArray(advancedRushing) && (
              <div>
                <h2 className="text-sm uppercase tracking-wide font-semibold border-b border-gray-200 pb-2 mb-4">2024 Advanced Rushing Metrics</h2>
                <div className="bg-white p-4 rounded shadow">
                  <p><strong>Rush Yards Over Expected:</strong> {typeof advancedRushing.rushing_yards_over_expected === 'number' ? advancedRushing.rushing_yards_over_expected.toFixed(1) : 'N/A'}</p>
                  <p><strong>Rush EPA:</strong> {typeof advancedRushing.rushing_epa === 'number' ? advancedRushing.rushing_epa.toFixed(2) : 'N/A'}</p>
                  <p><strong>Rush Success Rate:</strong> {typeof advancedRushing.success_rate === 'number' ? (advancedRushing.success_rate * 100).toFixed(1) + '%' : 'N/A'}</p>
                </div>
              </div>
            )}

            {/* (Removed duplicate advanced passing block if present) */}
            {/* Advanced Receiving Metrics Table */}
            {Array.isArray(advancedMetrics) && advancedMetrics.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Advanced Receiving Metrics</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        {Object.keys(advancedMetrics[0]).map((col) => (
                          <th key={col} className="px-4 py-2 text-left border-b">
                            {col.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {advancedMetrics.map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((val, i) => (
                            <td key={i} className="px-4 py-1 border-b">{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Advanced Rushing Metrics Table */}
            {Array.isArray(advancedRushing) && advancedRushing.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Advanced Rushing Metrics</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        {Object.keys(advancedRushing[0]).map((col) => (
                          <th key={col} className="px-4 py-2 text-left border-b">
                            {col.replace(/_/g, ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {advancedRushing.map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((val, i) => (
                            <td key={i} className="px-4 py-1 border-b">{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
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