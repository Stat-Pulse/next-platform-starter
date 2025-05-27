// pages/teams/[teamId].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Fetch data from the API
const fetchTeamData = async (teamId) => {
  try {
    const response = await fetch(`/api/teams/${teamId}`);
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error('Error fetching team data:', error);
    return null;
  }
};

// Components for tabs
const TeamDepthChart = ({ depthChart, teamColors }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: teamColors.primary }}>
    <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.primary }}>Depth Chart</h2>
    {depthChart && depthChart.length > 0 ? (
      <ul className="space-y-2">
        {depthChart.map((player, idx) => (
          <li key={idx} className="border-b py-2 hover:bg-gray-100 transition-colors">
            {player.full_name} - {player.position} (#{player.jersey_number})
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No depth chart data available.</p>
    )}
  </div>
);

const TeamStatsTable = ({ detailedStats, teamColors }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: teamColors.primary }}>
    <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.primary }}>Detailed Stats (2024 Season)</h2>
    <p className="text-yellow-600 mb-2">Note: Stats are incomplete (only 1 game available). Full data import pending.</p>
    {detailedStats && Object.keys(detailedStats).length > 0 ? (
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded bg-gray-50 hover:shadow-md transition-shadow">
          <p className="text-gray-600">Passing Yards</p>
          <p className="text-lg font-semibold">{detailedStats.total_passing_yards || 0}</p>
        </div>
        <div className="border p-4 rounded bg-gray-50 hover:shadow-md transition-shadow">
          <p className="text-gray-600">Rushing Yards</p>
          <p className="text-lg font-semibold">{detailedStats.total_rushing_yards || 0}</p>
        </div>
        <div className="border p-4 rounded bg-gray-50 hover:shadow-md transition-shadow">
          <p className="text-gray-600">Receiving Yards</p>
          <p className="text-lg font-semibold">{detailedStats.total_receiving_yards || 0}</p>
        </div>
      </div>
    ) : (
      <p className="text-gray-500">No stats available.</p>
    )}
  </div>
);

const TeamInjuries = ({ injuries, teamColors }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: teamColors.primary }}>
    <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.primary }}>Injuries</h2>
    {injuries && injuries.length > 0 ? (
      <ul className="space-y-2">
        {injuries.map((injury, idx) => (
          <li key={idx} className="border-b py-2 hover:bg-gray-100 transition-colors">
            {injury.player_name} ({injury.position}) - {injury.injury_description || 'N/A'} ({injury.injury_status || 'Unknown'})
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No injury data available.</p>
    )}
  </div>
);

const TeamSchedule = ({ schedule, teamColors }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: teamColors.primary }}>
    <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.primary }}>Schedule (2024 Season)</h2>
    {schedule && schedule.length > 0 ? (
      <ul className="space-y-2">
        {schedule
          .filter(game => new Date(game.game_date).getFullYear() === 2024)
          .map((game, idx) => (
            <li key={idx} className="border-b py-2 hover:bg-gray-100 transition-colors">
              Week {game.week}: {new Date(game.game_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} vs {game.opponent}{' '}
              {game.is_final ? `(Final: ${game.final_score})` : '(Upcoming)'}
            </li>
          ))}
      </ul>
    ) : (
      <p className="text-gray-500">No schedule data available.</p>
    )}
  </div>
);

const TopPlayers = ({ teamColors }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: teamColors.primary }}>
    <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.primary }}>Top Players (2024 Season)</h2>
    <p className="text-yellow-600 mb-2">Note: Player stats are incomplete. Full data import pending.</p>
    <div className="space-y-4">
      <div className="border p-4 rounded bg-gray-50 hover:shadow-md transition-shadow">
        <p className="text-gray-600">Top Passer</p>
        <p className="text-lg font-semibold">TBD - 250 yards (placeholder)</p>
      </div>
      <div className="border p-4 rounded bg-gray-50 hover:shadow-md transition-shadow">
        <p className="text-gray-600">Top Rusher</p>
        <p className="text-lg font-semibold">TBD - 20 yards (placeholder)</p>
      </div>
      <div className="border p-4 rounded bg-gray-50 hover:shadow-md transition-shadow">
        <p className="text-gray-600">Top Receiver</p>
        <p className="text-lg font-semibold">TBD - 200 yards (placeholder)</p>
      </div>
    </div>
  </div>
);

// Skeleton Loading Component
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="h-16 bg-gray-300 rounded mb-4"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-gray-200 p-4 rounded-lg h-40"></div>
        <div className="bg-gray-200 p-4 rounded-lg h-40"></div>
        <div className="bg-gray-200 p-4 rounded-lg h-40"></div>
      </div>
      <div className="md:col-span-1">
        <div className="bg-gray-200 p-4 rounded-lg h-60"></div>
      </div>
    </div>
  </div>
);

const TeamPage = () => {
  const router = useRouter();
  const { teamId } = router.query;
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!teamId) return;
    const loadTeamData = async () => {
      setIsLoading(true);
      const data = await fetchTeamData(teamId);
      setIsLoading(false);
      if (!data) {
        setError('Failed to load team data. Please try again later.');
        return;
      }
      setTeamData(data);
    };
    loadTeamData();
  }, [teamId]);

  if (error) {
    return <div className="container mx-auto py-6 text-red-600">{error}</div>;
  }

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!teamData) {
    return <div className="container mx-auto py-6">No data available.</div>;
  }

  const { team, seasonStats, lastGame, upcomingGame, depthChart, detailedStats, injuries, schedule, teamGrades, news } = teamData;

  // Use team colors from the API, with fallbacks
  const teamColors = {
    primary: team?.primary_color || '#1D2526',
    secondary: team?.secondary_color || '#A5ACAF',
  };

  return (
    <div className="container mx-auto py-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className={`mb-6 text-white p-4 rounded-lg shadow-lg`} style={{ backgroundColor: teamColors.primary }}>
        <div className="flex items-center space-x-4">
          <img
            src={team?.logo_url || '/placeholder-logo.png'}
            alt={`${team?.team_name || 'Team'} logo`}
            className="w-16 h-16 rounded-full border-2 border-gray-300"
            onError={(e) => (e.target.src = '/placeholder-logo.png')}
          />
          <div>
            <h1 className="text-3xl font-bold">{team?.city} {team?.nickname || team?.team_name || 'Unknown Team'}</h1>
            <p className="text-lg">
              Record: {seasonStats ? `${seasonStats.wins}-${seasonStats.losses}` : 'Loading...'}
            </p>
          </div>
        </div>
        <nav className="flex space-x-4 mt-2">
          {['overview', 'depthChart', 'schedule', 'injuries', 'stats', 'topPlayers'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`hover:underline ${activeTab === tab ? 'font-bold text-gray-200' : 'text-white'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('Chart', ' Chart').replace('TopPlayers', 'Top Players')}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left/Middle Column */}
          <div className="md:col-span-2 space-y-6">
            {/* 2024 Season Stats */}
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: teamColors.primary }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.primary }}>2024 Season Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="border p-4 rounded bg-gray-50 hover:shadow-md transition-shadow">
                  <p className="text-gray-600">Division</p>
                  <p className="text-lg font-semibold">{team?.division || 'N/A'}</p>
                </div>
                <div className="border p-4 rounded bg-gray-50 hover:shadow-md transition-shadow">
                  <p className="text-gray-600">Record</p>
                  <p className="text-lg font-semibold">
                    {seasonStats ? `${seasonStats.wins}-${seasonStats.losses}` : 'Loading...'}
                  </p>
                </div>
                <div className="border p-4 rounded bg-gray-50 hover:shadow-md transition-shadow">
                  <p className="text-gray-600">Points Scored</p>
                  <p className="text-lg font-semibold">
                    {seasonStats?.points_scored || 'Loading...'}
                  </p>
                </div>
                <div className="border p-4 rounded bg-gray-50 hover:shadow-md transition-shadow">
                  <p className="text-gray-600">Points Allowed</p>
                  <p className="text-lg font-semibold">
                    {seasonStats?.points_allowed || 'Loading...'}
                  </p>
                </div>
              </div>
            </div>

            {/* 2024 Team Grades */}
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: teamColors.primary }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.primary }}>2024 Team Grades</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="border p-4 rounded bg-gray-50 hover:shadow-md transition-shadow">
                  <p className="text-gray-600">Overall</p>
                  <p className="text-lg font-semibold">{teamGrades?.overall || 'N/A'}</p>
                </div>
                <div className="border p-4 rounded bg-gray-50 flex items-center hover:shadow-md transition-shadow">
                  <p className="text-gray-600">Offense</p>
                  <span className={`ml-2 ${teamGrades?.offense === 'A' ? 'text-green-500' : teamGrades?.offense === 'B' ? 'text-yellow-500' : 'text-red-500'}`}>
                    {teamGrades?.offense || 'N/A'}
                  </span>
                </div>
                <div className="border p-4 rounded bg-gray-50 flex items-center hover:shadow-md transition-shadow">
                  <p className="text-gray-600">Defense</p>
                  <span className={`ml-2 ${teamGrades?.defense === 'A' ? 'text-green-500' : teamGrades?.defense === 'B' ? 'text-yellow-500' : 'text-red-500'}`}>
                    {teamGrades?.defense || 'N/A'}
                  </span>
                </div>
                <div className="border p-4 rounded bg-gray-50 flex items-center hover:shadow-md transition-shadow">
                  <p className="text-gray-600">Special Teams</p>
                  <span className={`ml-2 ${teamGrades?.special_teams === 'A' ? 'text-green-500' : teamGrades?.special_teams === 'B' ? 'text-yellow-500' : 'text-red-500'}`}>
                    {teamGrades?.special_teams || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Last Game */}
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: teamColors.primary }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.primary }}>Last Game</h2>
              {lastGame ? (
                <div>
                  <p className="text-gray-600 mb-2">
                    {new Date(lastGame.game_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}, {lastGame.game_time.slice(0, 5)}
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={lastGame.home_team_id === team.team_abbr ? team.logo_url : '/placeholder-logo.png'}
                      alt={`${lastGame.home_team_id} logo`}
                      className="w-12 h-12"
                      onError={(e) => (e.target.src = '/placeholder-logo.png')}
                    />
                    <p className="text-xl font-semibold">
                      {lastGame.home_score} - {lastGame.away_score}
                    </p>
                    <img
                      src={lastGame.away_team_id === team.team_abbr ? team.logo_url : '/placeholder-logo.png'}
                      alt={`${lastGame.away_team_id} logo`}
                      className="w-12 h-12"
                      onError={(e) => (e.target.src = '/placeholder-logo.png')}
                    />
                  </div>
                  <div className="flex justify-center space-x-4 mt-2">
                    <span className="text-sm text-gray-600">{lastGame.home_team_id}</span>
                    <span className="text-sm text-gray-600">{lastGame.away_team_id}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No recent games found.</p>
              )}
            </div>

            {/* PFF Betting Odds */}
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 relative" style={{ borderColor: teamColors.primary }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.primary }}>PFF Betting Odds</h2>
              {upcomingGame ? (
                <div>
                  <p className="text-gray-600 mb-2">
                    {new Date(upcomingGame.game_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}, {upcomingGame.game_time.slice(0, 5)}
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={upcomingGame.home_team_id === team.team_abbr ? team.logo_url : '/placeholder-logo.png'}
                      alt={`${upcomingGame.home_team_id} logo`}
                      className="w-12 h-12"
                      onError={(e) => (e.target.src = '/placeholder-logo.png')}
                    />
                    <p className="text-xl font-semibold">vs</p>
                    <img
                      src={upcomingGame.away_team_id === team.team_abbr ? team.logo_url : '/placeholder-logo.png'}
                      alt={`${upcomingGame.away_team_id} logo`}
                      className="w-12 h-12"
                      onError={(e) => (e.target.src = '/placeholder-logo.png')}
                    />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={team?.logo_url || '/placeholder-logo.png'}
                    alt={`${team?.team_name || 'Team'} logo`}
                    className="absolute inset-0 w-full h-full object-cover opacity-10"
                    onError={(e) => (e.target.src = '/placeholder-logo.png')}
                  />
                  <p className="text-gray-600 text-center">No Upcoming Game</p>
                </div>
              )}
            </div>

            {/* Fantasy Projections */}
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: teamColors.primary }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.primary }}>Fantasy Projections</h2>
              <p className="text-gray-600">Coming Soon</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: teamColors.secondary }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.secondary }}>Latest News</h2>
              {news && news.length > 0 ? (
                <div className="space-y-4">
                  {news.map((newsItem, idx) => (
                    <div key={idx} className="border-b pb-4 last:border-b-0 hover:bg-gray-100 transition-colors">
                      <h4 className="text-md font-semibold text-gray-800 mb-2">
                        {newsItem.title}
                      </h4>
                      <div className="flex justify-between items-center">
                        <a
                          href={newsItem.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Read More (Source: {newsItem.source})
                        </a>
                        <span className="text-xs text-gray-600">{newsItem.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No news available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Render other tabs */}
      {activeTab === 'depthChart' && <TeamDepthChart depthChart={depthChart} teamColors={teamColors} />}
      {activeTab === 'stats' && <TeamStatsTable detailedStats={detailedStats} teamColors={teamColors} />}
      {activeTab === 'injuries' && <TeamInjuries injuries={injuries} teamColors={teamColors} />}
      {activeTab === 'schedule' && <TeamSchedule schedule={schedule} teamColors={teamColors} />}
      {activeTab === 'topPlayers' && <TopPlayers teamColors={teamColors} />}
    </div>
  );
};

export default TeamPage;