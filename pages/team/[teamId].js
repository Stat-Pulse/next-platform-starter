// pages/teams/[teamId].js
import { useEffect, useState, useRef } from 'react'; // Added useRef for Chart.js
import Chart from 'chart.js/auto'; // For Chart.js integration

const TeamPage = () => {
  const [teamId, setTeamId] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [news, setNews] = useState([]);
  const [seasonGames, setSeasonGames] = useState([]);
  const [showAllGames, setShowAllGames] = useState(false);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const currentTeamId = pathSegments[pathSegments.length - 1];
    setTeamId(currentTeamId);
  }, []);

  useEffect(() => {
    if (!teamId) return;

    const fetchData = async () => {
      try {
        const newsUrl = `${window.location.origin}/api/news?team=${teamId.toUpperCase()}`;
        const teamUrl = `${window.location.origin}/api/team/${teamId}`;

        const newsRes = await fetch(newsUrl);
        const newsJson = await newsRes.json();
        if (newsRes.ok) setNews(newsJson.slice(0, 5));
        else throw new Error(newsJson.error || 'Failed to load news data');

        const teamRes = await fetch(teamUrl);
        const teamJson = await teamRes.json();
        if (!teamRes.ok) throw new Error(teamJson.error || 'Failed to load team data');
        setTeamData(teamJson);
        setSeasonGames(teamJson.seasonGames || []);
        setUpcomingSchedule(teamJson.upcomingSchedule || []);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError(err.message);
      }
    };
    fetchData();
  }, [teamId]);

  const formatStat = (num, decimals = 0) =>
    num != null && !isNaN(num)
      ? Number(num).toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : '—';

  if (error) return <div className="text-red-600 p-4">Error: {error}</div>;
  if (!teamData || Object.keys(teamData).length === 0) return <div className="p-4">Loading team data...</div>;

  const {
    name: teamName,
    division,
    location: teamLoc,
    branding,
    coaching,
    teamLogos,
    offenseStats,
    defenseStats,
    roster,
    depthChart,
  } = teamData;

  const lastGame = seasonGames.length > 0 ? seasonGames[seasonGames.length - 1] : null;

  // Helper to get player's number and headshot from roster
  const getPlayerInfo = (playerName) => {
    const player = roster.find(p => p.name === playerName);
    return {
      number: player?.jersey_number ?? '—', // Corrected to jersey_number
      headshot: player?.headshot_url || 'https://placehold.co/40x40/E2E8F0/1A202C?text=Player'
    };
  };

  // Depth Chart Display Component (Moved inside TeamPage)
  const DepthChartSection = ({ depthChart, roster }) => {
    const chartRefs = useRef({});

    const offensivePositions = ['QB', 'RB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT'];
    const defensivePositions = ['DE', 'DT', 'LB', 'CB', 'S', 'NT'];
    const specialTeamsPositions = ['K', 'P', 'LS'];

    // Effect to initialize/update unit strength charts
    useEffect(() => {
      // Destroy existing charts before creating new ones on data change
      Object.values(chartRefs.current).forEach(ref => {
        if (ref && ref.chartInstance && ref.chartInstance.destroy) {
          ref.chartInstance.destroy();
          ref.chartInstance = null; // Clear the reference
        }
      });

      if (!depthChart || Object.keys(depthChart).length === 0) {
        return; // Do not draw charts if data is not yet loaded or empty
      }

      // Prepare data for unit strengths (if available in depthChart.unit_strength)
      const unitStrengthData = {};
      // Assuming depthChart might contain a 'unit_strength' property if available from backend
      // Otherwise, you'd need to calculate it or remove this part.
      // For now, let's assume `depthChart.unit_strength` exists if you want these charts.
      // If it doesn't, these charts will just not render.
      const availableUnitStrengths = depthChart.unit_strength || {};

      [...offensivePositions, ...defensivePositions, ...specialTeamsPositions].forEach((pos) => {
        if (availableUnitStrengths[pos] && chartRefs.current[pos]) {
          const newChart = new Chart(chartRefs.current[pos].getContext('2d'), {
            type: 'bar',
            data: {
              labels: [pos],
              datasets: [{
                label: 'Unit Strength',
                data: [availableUnitStrengths[pos]],
                backgroundColor: branding.secondaryColor || '#DBEAFE', // Use team secondary color
                borderColor: branding.primaryColor || '#2563EB',
                borderWidth: 1,
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false, // Allow charts to resize more freely
              plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
              },
              scales: {
                y: { beginAtZero: true, max: 100, ticks: { color: 'black' } }, // Black ticks
                x: { ticks: { color: 'black' } } // Black ticks
              }
            },
          });
          chartRefs.current[pos].chartInstance = newChart; // Store chart instance for cleanup
        }
      });

      // Cleanup function for charts when component unmounts or effect re-runs
      return () => {
        Object.values(chartRefs.current).forEach(ref => {
          if (ref && ref.chartInstance && ref.chartInstance.destroy) {
            ref.chartInstance.destroy();
            ref.chartInstance = null;
          }
        });
      };
    }, [depthChart, branding.primaryColor, branding.secondaryColor]); // Re-run when depthData or colors change

    const renderPositionGroup = (positions, title) => (
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {positions.map(position => {
            const players = depthChart[position] || [];
            if (players.length === 0) return null;

            return (
              <div key={position} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-lg text-blue-700 mb-2">{position}</h4>
                <ul className="space-y-2 text-black">
                  {players.map(player => {
                    const playerInfo = getPlayerInfo(player.name);
                    return (
                      <li key={player.name} className="flex items-center space-x-2">
                        <img
                          src={playerInfo.headshot}
                          alt={`${player.name} headshot`}
                          className="w-8 h-8 rounded-full object-cover bg-white"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/E2E8F0/1A202C?text=Player'; }}
                        />
                        <span>#{playerInfo.number} {player.name}</span>
                        <span className="text-gray-500 text-sm">({player.depth_rank})</span> {/* Assuming depth_rank from backend */}
                      </li>
                    );
                  })}
                </ul>
                {/* Render Chart.js canvas if unit strength data exists for this position */}
                {depthChart.unit_strength?.[position] && (
                  <canvas ref={(ref) => (chartRefs.current[position] = ref)} className="w-full h-16 mt-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );

    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Depth Chart</h2>
        {Object.keys(depthChart).length === 0 ? (
          <p className="text-black">No depth chart data available.</p>
        ) : (
          <div>
            {renderPositionGroup(offensivePositions, 'Offense')}
            {renderPositionGroup(defensivePositions, 'Defense')}
            {renderPositionGroup(specialTeamsPositions, 'Special Teams')}
            {/* Render any other positions not categorized above */}
            {Object.keys(depthChart)
              .filter(pos => ![...offensivePositions, ...defensivePositions, ...specialTeamsPositions, 'unit_strength'].includes(pos))
              .length > 0 && (
                renderPositionGroup(
                  Object.keys(depthChart).filter(pos => ![...offensivePositions, ...defensivePositions, ...specialTeamsPositions, 'unit_strength'].includes(pos)),
                  'Other Positions'
                )
            )}
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="bg-gradient-to-r from-blue-50 via-white to-gray-50 min-h-screen p-6 font-sans text-black">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between rounded-lg p-4 shadow-sm mb-6"
          style={{ backgroundColor: branding.colorPrimary || '#F3F4F6' }} // Dynamic primary color
        >
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            {/* Team Logo */}
            <img
              src={branding.logo || `https://placehold.co/64x64/E2E8F0/1A202C?text=${teamName.substring(0,2).toUpperCase()}`}
              alt={`${teamName} logo`}
              className="w-16 h-16 rounded-full object-contain bg-white p-1 shadow-sm"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/64x64/E2E8F0/1A202C?text=${teamName.substring(0,2).toUpperCase()}`; }}
            />
            {/* Team Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{teamName}</h1>
              <p className="text-sm text-black">{division} • Est. {teamLoc.foundedYear ?? '—'}</p>
              <p className="text-sm text-black">
                Stadium: {teamLoc.stadium ?? '—'} ({formatStat(teamLoc.capacity) ?? '—'} Capacity)
              </p>
              <p className="text-sm text-black">City: {teamLoc.city ?? '—'}</p>
            </div>
          </div>
          {/* Coaching Staff */}
          <div className="text-right text-sm text-black space-y-1">
            <p className="font-semibold">Head Coach: {coaching.headCoach ?? '—'}</p>
            <p>Offensive Coord: {coaching.offensiveCoordinator ?? '—'}</p>
            <p>Defensive Coord: {coaching.d_coord ?? '—'}</p> {/* Corrected to d_coord */}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex overflow-x-auto scrollbar-none space-x-4 border-b border-gray-200 mb-6 pb-2 whitespace-nowrap">
          {['overview', 'depthChart', 'schedule', 'injuries', 'stats'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-700 hover:text-blue-600 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        {/* Conditional Rendering of Content Sections */}
        {activeTab === 'overview' && (
          <>
            {/* Team Stats Section */}
            {(offenseStats || defenseStats) && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Team Stats (2024 Season)</h2>
                {/* Offense Stats */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Offense</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black text-sm">
                    {/* Pass Offense */}
                    <div className="border rounded-lg p-3 shadow-sm" style={{ backgroundColor: branding.secondaryColor || '#DBEAFE' }}>
                      <h4 className="font-semibold text-blue-900 mb-1">Pass Offense</h4> {/* Darker text for header for contrast */}
                      <p>Yards: {formatStat(offenseStats?.pass_yards)}</p>
                      <p>TDs: {formatStat(offenseStats?.pass_tds)}</p>
                      <p>NFL Rank: —</p>
                    </div>
                    {/* Rush Offense */}
                    <div className="border rounded-lg p-3 shadow-sm" style={{ backgroundColor: branding.secondaryColor || '#DBEAFE' }}>
                      <h4 className="font-semibold text-green-900 mb-1">Rush Offense</h4>
                      <p>Yards: {formatStat(offenseStats?.rush_yards)}</p>
                      <p>TDs: {formatStat(offenseStats?.rush_tds)}</p>
                      <p>NFL Rank: —</p>
                    </div>
                    {/* Total Offense */}
                    <div className="border rounded-lg p-3 shadow-sm" style={{ backgroundColor: branding.secondaryColor || '#DBEAFE' }}>
                      <h4 className="font-semibold text-purple-900 mb-1">Total Offense</h4>
                      <p>Yards: {formatStat(offenseStats?.total_off_yards)}</p>
                      <p>TDs: {formatStat((offenseStats?.pass_tds ?? 0) + (offenseStats?.rush_tds ?? 0))}</p>
                      <p>NFL Rank: —</p>
                    </div>
                  </div>
                </div>

                {/* Defense Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Defense</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black text-sm">
                    {/* Pass Defense */}
                    <div className="border rounded-lg p-3 shadow-sm" style={{ backgroundColor: branding.secondaryColor || '#DBEAFE' }}>
                      <h4 className="font-semibold text-red-900 mb-1">Pass Defense</h4>
                      <p>Yards Allowed: {formatStat(defenseStats?.pass_yards_allowed)}</p>
                      <p>TDs Allowed: {formatStat(defenseStats?.pass_td_allowed)}</p>
                      <p>NFL Rank: —</p>
                    </div>
                    {/* Rush Defense */}
                    <div className="border rounded-lg p-3 shadow-sm" style={{ backgroundColor: branding.secondaryColor || '#DBEAFE' }}>
                      <h4 className="font-semibold text-yellow-900 mb-1">Rush Defense</h4>
                      <p>Yards Allowed: {formatStat(defenseStats?.rush_yards_allowed)}</p>
                      <p>TDs Allowed: {formatStat(defenseStats?.rush_td_allowed)}</p>
                      <p>NFL Rank: —</p>
                    </div>
                    {/* Total Defense */}
                    <div className="border rounded-lg p-3 shadow-sm" style={{ backgroundColor: branding.secondaryColor || '#DBEAFE' }}>
                      <h4 className="font-semibold text-teal-900 mb-1">Total Defense</h4>
                      <p>Yards Allowed: {formatStat(defenseStats?.total_defense_yards_allowed)}</p>
                      <p>TDs Allowed: {formatStat(defenseStats?.total_defense_td_allowed)}</p>
                      <p>NFL Rank: —</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Last Games Section */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">Last Game</h2>
                {seasonGames.length > 1 && (
                  <button
                    onClick={() => setShowAllGames(!showAllGames)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    {showAllGames ? 'Hide All' : 'Show All Past Games'}
                  </button>
                )}
              </div>
              {lastGame === null ? (
                <p className="text-sm text-black">No recent games available.</p>
              ) : (
                <div className="space-y-3 mt-2">
                  {(showAllGames ? seasonGames : [lastGame]).map((game, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-center justify-between border rounded p-3 bg-gray-50 text-black">
                      <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                        {/* Home Team */}
                        <div className="flex items-center space-x-1">
                          <img
                            src={teamLogos?.[game.home_team_abbr] || `https://placehold.co/24x24/E2E8F0/1A202C?text=${game.home_team_abbr}`}
                            alt={`${game.home_team_abbr} logo`}
                            className="w-6 h-6 object-contain"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/24x24/E2E8F0/1A202C?text=${game.home_team_abbr}`; }}
                          />
                          <span className="text-sm font-medium">{game.home_team_abbr}</span> {/* Kept abbr for clarity */}
                          <span className={`text-sm font-bold ${game.home_score > game.away_score ? 'text-blue-600' : 'text-gray-700'}`}>
                            {game.home_score}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">vs</span>
                        {/* Away Team */}
                        <div className="flex items-center space-x-1">
                          <span className={`text-sm font-bold ${game.away_score > game.home_score ? 'text-blue-600' : 'text-gray-700'}`}>
                            {game.away_score}
                          </span>
                          <span className="text-sm font-medium">{game.away_team_abbr}</span> {/* Kept abbr for clarity */}
                          <img
                            src={teamLogos?.[game.away_team_abbr] || `https://placehold.co/24x24/E2E8F0/1A202C?text=${game.away_team_abbr}`}
                            alt={`${game.away_team_abbr} logo`}
                            className="w-6 h-6 object-contain"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/24x24/E2E8F0/1A202C?text=${game.away_team_abbr}`; }}
                          />
                        </div>
                      </div>
                      {/* Game Date */}
                      <span className="text-sm text-black">
                        {new Date(game.game_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Games Section */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Game{showAllUpcoming ? 's' : ''}</h2>
                {upcomingSchedule.length > 1 && (
                  <button
                    onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    {showAllUpcoming ? 'Hide All' : 'Show All Upcoming Games'}
                  </button>
                )}
              </div>
              {upcomingSchedule.length === 0 ? (
                <p className="text-sm text-black">No upcoming games scheduled.</p>
              ) : (
                <div className="space-y-3">
                  {(showAllUpcoming ? upcomingSchedule : [upcomingSchedule[0]]).map((game, idx) => (
                    <div key={idx} className="border rounded p-3 space-y-1 bg-blue-50 text-black">
                      <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                          {/* Away Team */}
                          <img
                            src={teamLogos?.[game.away_team_abbr] || `https://placehold.co/24x24/E2E8F0/1A202C?text=${game.away_team_abbr}`}
                            alt={`${game.away_team_abbr} logo`}
                            className="w-6 h-6 object-contain"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/24x24/E2E8F0/1A202C?text=${game.away_team_abbr}`; }}
                          />
                          <span className="text-sm font-medium">{game.away_team_abbr}</span> {/* Kept abbr for clarity */}
                          <span className="text-xs text-gray-500">at</span>
                          {/* Home Team */}
                          <span className="text-sm font-medium">{game.home_team_abbr}</span> {/* Kept abbr for clarity */}
                          <img
                            src={teamLogos?.[game.home_team_abbr] || `https://placehold.co/24x24/E2E8F0/1A202C?text=${game.home_team_abbr}`}
                            alt={`${game.home_team_abbr} logo`}
                            className="w-6 h-6 object-contain"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/24x24/E2E8F0/1A202C?text=${game.home_team_abbr}`; }}
                          />
                        </div>
                        {/* Game Date */}
                        <span className="text-sm text-black">
                          {new Date(game.gameday).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="text-xs text-black">{game.stadium || 'Stadium TBD'}</div>
                      {/* Betting Lines */}
                      {(game.spread_line != null || game.total_line != null) && (
                        <div className="text-xs text-black mt-1 flex flex-wrap gap-x-4">
                          {game.spread_line != null && (
                            <span className="text-red-600 font-medium">
                              Spread: {game.spread_line > 0 ? '+' : ''}
                              {formatStat(game.spread_line, 1)}{' '}
                              <span className="ml-1 text-gray-500">
                                ({game.home_spread_odds ?? '—'} / {game.away_spread_odds ?? '—'})
                              </span>
                            </span>
                          )}
                          {game.total_line != null && (
                            <span className="text-blue-700 font-medium">
                              O/U: {formatStat(game.total_line, 1)}
                              <span className="ml-1 text-gray-500">
                                ({game.over_odds ?? '—'} / {game.under_odds ?? '—'})
                              </span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Latest News Section */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Latest News</h2>
              {news.length === 0 ? (
                <p className="text-sm text-black">No recent news available.</p>
              ) : (
                <ul className="space-y-4">
                  {news.map((article, idx) => (
                    <li key={idx} className="text-sm border-b pb-2 last:border-b-0 text-black">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-medium hover:underline block mb-1"
                      >
                        {article.title}
                      </a>
                      <p className="text-black text-xs">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {/* Depth Chart Section */}
        {activeTab === 'depthChart' && (
          <DepthChartSection depthChart={depthChart} roster={roster} />
        )}

        {/* Placeholder Sections for other tabs */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Full Schedule</h2>
            <p className="text-black">Schedule content goes here. You could combine seasonGames and upcomingSchedule.</p>
          </div>
        )}
        {activeTab === 'injuries' && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Injuries</h2>
            <p className="text-black">Injury report content goes here.</p>
          </div>
        )}
        {activeTab === 'stats' && (
          // Re-using the stats section, but ensuring it's the ONLY thing shown
          (offenseStats || defenseStats) && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Team Stats (2024 Season)</h2>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Offense</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black text-sm">
                  <div className="border rounded-lg p-3 shadow-sm" style={{ backgroundColor: branding.secondaryColor || '#DBEAFE' }}>
                    <h4 className="font-semibold text-blue-900 mb-1">Pass Offense</h4>
                    <p>Yards: {formatStat(offenseStats?.pass_yards)}</p>
                    <p>TDs: {formatStat(offenseStats?.pass_tds)}</p>
                    <p>NFL Rank: —</p>
                  </div>
                  <div className="border rounded-lg p-3 shadow-sm" style={{ backgroundColor: branding.secondaryColor || '#DBEAFE' }}>
                    <h4 className="font-semibold text-green-900 mb-1">Rush Offense</h4>
                    <p>Yards: {formatStat(offenseStats?.rush_yards)}</p>
                    <p>TDs: {formatStat(offenseStats?.rush_tds)}</p>
                    <p>NFL Rank: —</p>
                  </div>
                  <div className="border rounded-lg p-3 shadow-sm" style={{ backgroundColor: branding.secondaryColor || '#DBEAFE' }}>
                    <h4 className="font-semibold text-purple-900 mb-1">Total Offense</h4>
                    <p>Yards: {formatStat(offenseStats?.total_off_yards)}</p>
                    <p>TDs: {formatStat((offenseStats?.pass_tds ?? 0) + (offenseStats?.rush_tds ?? 0))}</p>
                    <p>NFL Rank: —</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-3">Defense</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black text-sm">
                  <div className="border rounded-lg p-3 shadow-sm" style={{ backgroundColor: branding.secondaryColor || '#DBEAFE' }}>
                    <h4 className="font-semibold text-red-900 mb-1">Pass Defense</h4>
                    <p>Yards Allowed: {formatStat(defenseStats?.pass_yards_allowed)}</p>
                    <p>TDs Allowed: {formatStat(defenseStats?.pass_td_allowed)}</p>
                    <p>NFL Rank: —</p>
                  </div>
                  <div className="border rounded-lg p-3 shadow-sm" style={{ backgroundColor: branding.secondaryColor || '#DBEAFE' }}>
                    <h4 className="font-semibold text-yellow-900 mb-1">Rush Defense</h4>
                    <p>Yards Allowed: {formatStat(defenseStats?.rush_yards_allowed)}</p>
                    <p>TDs Allowed: {formatStat(defenseStats?.rush_td_allowed)}</p>
                    <p>NFL Rank: —</p>
                  </div>
                  <div className="border rounded-lg p-3 shadow-sm" style={{ backgroundColor: branding.secondaryColor || '#DBEAFE' }}>
                    <h4 className="font-semibold text-teal-900 mb-1">Total Defense</h4>
                    <p>Yards Allowed: {formatStat(defenseStats?.total_defense_yards_allowed)}</p>
                    <p>TDs Allowed: {formatStat(defenseStats?.total_defense_td_allowed)}</p>
                    <p>NFL Rank: —</p>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TeamPage;
