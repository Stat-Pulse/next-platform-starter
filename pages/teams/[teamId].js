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

// Team logos (fetch dynamically from team.logo_url or update as needed)
const teamLogos = {
  KC: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
  DET: 'https://a.espncdn.com/i/teamlogos/nfl/500/det.png',
  // Add other team logos as needed
};

// Placeholder newsItems (to be replaced with real data)
const newsItems = [
  { title: 'News 1', link: '#', timestamp: '1 hour ago' },
  { title: 'News 2', link: '#', timestamp: '2 hours ago' },
  { title: 'News 3', link: '#', timestamp: '3 hours ago' },
  { title: 'News 4', link: '#', timestamp: '4 hours ago' },
  { title: 'News 5', link: '#', timestamp: '5 hours ago' },
  { title: 'News 6', link: '#', timestamp: '6 hours ago' },
];

// Components for tabs
const TeamDepthChart = ({ depthChart }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Depth Chart</h2>
    {depthChart && depthChart.length > 0 ? (
      <ul className="space-y-2">
        {depthChart.map((player, idx) => (
          <li key={idx} className="border-b py-2">
            {player.full_name} - {player.position} (#{player.jersey_number})
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No depth chart data available.</p>
    )}
  </div>
);

const TeamStatsTable = ({ detailedStats }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Detailed Stats (2024 Season)</h2>
    <p className="text-yellow-600 mb-2">Note: Stats are incomplete (only 1 game available). Full data import pending.</p>
    {detailedStats && Object.keys(detailedStats).length > 0 ? (
      <div className="grid grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <p className="text-gray-600">Passing Yards</p>
          <p className="text-lg font-semibold">{detailedStats.total_passing_yards || 0}</p>
        </div>
        <div className="border p-4 rounded">
          <p className="text-gray-600">Rushing Yards</p>
          <p className="text-lg font-semibold">{detailedStats.total_rushing_yards || 0}</p>
        </div>
        <div className="border p-4 rounded">
          <p className="text-gray-600">Receiving Yards</p>
          <p className="text-lg font-semibold">{detailedStats.total_receiving_yards || 0}</p>
        </div>
      </div>
    ) : (
      <p className="text-gray-500">No stats available.</p>
    )}
  </div>
);

const TeamInjuries = ({ injuries }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Injuries</h2>
    {injuries && injuries.length > 0 ? (
      <ul className="space-y-2">
        {injuries.map((injury, idx) => (
          <li key={idx} className="border-b py-2">
            {injury.player_name} ({injury.position}) - {injury.injury_description || 'N/A'} ({injury.injury_status || 'Unknown'})
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No injury data available.</p>
    )}
  </div>
);

const TeamSchedule = ({ schedule }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Schedule (2024 Season)</h2>
    {schedule && schedule.length > 0 ? (
      <ul className="space-y-2">
        {schedule
          .filter(game => new Date(game.game_date).getFullYear() === 2024)
          .map((game, idx) => (
            <li key={idx} className="border-b py-2">
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
// In the overview tab
<div className="bg-white p-4 rounded shadow">
  <h2 className="text-xl font-semibold mb-4">2024 Team Grades</h2>
  <div className="grid grid-cols-2 gap-4">
    <div className="border p-4 rounded">
      <p className="text-gray-600">Overall</p>
      <p className="text-lg font-semibold">{teamGrades?.overall || 'N/A'}</p>
    </div>
    <div className="border p-4 rounded flex items-center">
      <p className="text-gray-600">Offense</p>
      <span className={`ml-2 ${teamGrades?.offense === 'A' ? 'text-green-500' : teamGrades?.offense === 'B' ? 'text-yellow-500' : 'text-red-500'}`}>
        {teamGrades?.offense || 'N/A'}
      </span>
    </div>
    <div className="border p-4 rounded flex items-center">
      <p className="text-gray-600">Defense</p>
      <span className={`ml-2 ${teamGrades?.defense === 'A' ? 'text-green-500' : teamGrades?.defense === 'B' ? 'text-yellow-500' : 'text-red-500'}`}>
        {teamGrades?.defense || 'N/A'}
      </span>
    </div>
    <div className="border p-4 rounded flex items-center">
      <p className="text-gray-600">Special Teams</p>
      <span className={`ml-2 ${teamGrades?.special_teams === 'A' ? 'text-green-500' : teamGrades?.special_teams === 'B' ? 'text-yellow-500' : 'text-red-500'}`}>
        {teamGrades?.special_teams || 'N/A'}
      </span>
    </div>
  </div>
</div>

// Update TeamPage to destructure teamGrades
const { team, seasonStats, lastGame, upcomingGame, depthChart, detailedStats, injuries, schedule, teamGrades } = teamData;
  const router = useRouter();
  const { teamId } = router.query;
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!teamId) return;
    const loadTeamData = async () => {
      const data = await fetchTeamData(teamId);
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

  if (!teamData) {
    return <div className="container mx-auto py-6">Loading...</div>;
  }

  const { team, seasonStats, lastGame, upcomingGame, depthChart, detailedStats, injuries, schedule } = teamData;

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={team?.logo_url || '/placeholder-logo.png'}
            alt={`${team?.team_name || 'Team'} logo`}
            className="w-16 h-16"
            onError={(e) => (e.target.src = '/placeholder-logo.png')}
          />
          <div>
            <h1 className="text-3xl font-bold text-blue-600">{team?.team_name || 'Unknown Team'}</h1>
            <p className="text-lg text-gray-600">
              Record: {seasonStats ? `${seasonStats.wins}-${seasonStats.losses}` : 'Loading...'}
            </p>
          </div>
        </div>
        <nav className="flex space-x-4 mt-2">
          {['overview', 'depthChart', 'schedule', 'injuries', 'stats'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-blue-600 hover:underline ${activeTab === tab ? 'font-bold' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('Chart', ' Chart')}
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
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">2024 Season Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="border p-4 rounded">
                  <p className="text-gray-600">Division</p>
                  <p className="text-lg font-semibold">{team?.division || 'N/A'}</p>
                </div>
                <div className="border p-4 rounded">
                  <p className="text-gray-600">Record</p>
                  <p className="text-lg font-semibold">
                    {seasonStats ? `${seasonStats.wins}-${seasonStats.losses}` : 'Loading...'}
                  </p>
                </div>
                <div className="border p-4 rounded">
                  <p className="text-gray-600">Points Scored</p>
                  <p className="text-lg font-semibold">
                    {seasonStats?.points_scored || 'Loading...'}
                  </p>
                </div>
                <div className="border p-4 rounded">
                  <p className="text-gray-600">Points Allowed</p>
                  <p className="text-lg font-semibold">
                    {seasonStats?.points_allowed || 'Loading...'}
                  </p>
                </div>
              </div>
            </div>

            {/* 2024 Team Grades (Placeholder) */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">2024 Team Grades</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="border p-4 rounded">
                  <p className="text-gray-600">Overall</p>
                  <p className="text-lg font-semibold">A-</p> {/* Replace with real data */}
                </div>
                <div className="border p-4 rounded flex items-center">
                  <p className="text-gray-600">Offense</p>
                  <span className="ml-2 text-green-500">A</span>
                </div>
                <div className="border p-4 rounded flex items-center">
                  <p className="text-gray-600">Defense</p>
                  <span className="ml-2 text-yellow-500">B</span>
                </div>
                <div className="border p-4 rounded flex items-center">
                  <p className="text-gray-600">Special Teams</p>
                  <span className="ml-2 text-red-500">C</span>
                </div>
              </div>
            </div>

            {/* Last Game */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Last Game</h2>
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
                      src={teamLogos[lastGame.home_team_id] || team?.logo_url || '/placeholder-logo.png'}
                      alt={`${lastGame.home_team_id} logo`}
                      className="w-12 h-12"
                      onError={(e) => (e.target.src = '/placeholder-logo.png')}
                    />
                    <p className="text-xl font-semibold">
                      {lastGame.home_score} - {lastGame.away_score}
                    </p>
                    <img
                      src={teamLogos[lastGame.away_team_id] || team?.logo_url || '/placeholder-logo.png'}
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
            <div className="bg-white p-4 rounded shadow relative">
              <h2 className="text-xl font-semibold mb-4">PFF Betting Odds</h2>
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
                      src={teamLogos[upcomingGame.home_team_id] || team?.logo_url || '/placeholder-logo.png'}
                      alt={`${upcomingGame.home_team_id} logo`}
                      className="w-12 h-12"
                      onError={(e) => (e.target.src = '/placeholder-logo.png')}
                    />
                    <p className="text-xl font-semibold">vs</p>
                    <img
                      src={teamLogos[upcomingGame.away_team_id] || team?.logo_url || '/placeholder-logo.png'}
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
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Fantasy Projections</h2>
              <p className="text-gray-600">Coming Soon</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-1">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Latest News</h2>
              {newsItems.length === 0 ? (
                <p className="text-gray-500">Loading latest news...</p>
              ) : (
                <div className="space-y-4">
                  {newsItems.slice(0, 6).map((news, idx) => (
                    <div key={idx} className="border-b pb-4 last:border-b-0">
                      <h4 className="text-md font-semibold text-gray-800 mb-2">
                        {news.title}
                      </h4>
                      <div className="flex justify-between items-center">
                        <a
                          href={news.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Read More
                        </a>
                        <span className="text-xs text-gray-600">{news.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Render other tabs */}
      {activeTab === 'depthChart' && <TeamDepthChart depthChart={depthChart} />}
      {activeTab === 'stats' && <TeamStatsTable detailedStats={detailedStats} />}
      {activeTab === 'injuries' && <TeamInjuries injuries={injuries} />}
      {activeTab === 'schedule' && <TeamSchedule schedule={schedule} />}
    </div>
  );
};

export default TeamPage;
