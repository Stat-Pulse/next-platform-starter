// pages/teams/[teamId].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Placeholder components until the actual ones are implemented
const TeamDepthChart = ({ depthChart }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Depth Chart</h2>
    {depthChart.length > 0 ? (
      <ul>
        {depthChart.map((player, idx) => (
          <li key={idx}>
            {player.position}: {player.first_name} {player.last_name} (Depth: {player.depth})
          </li>
        ))}
      </ul>
    ) : (
      <p>No depth chart available.</p>
    )}
  </div>
);

const TeamStatsTable = ({ detailedStats }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Team Stats</h2>
    {detailedStats.total_passing_yards !== undefined ? (
      <div>
        <p>Total Passing Yards: {detailedStats.total_passing_yards}</p>
        <p>Total Rushing Yards: {detailedStats.total_rushing_yards}</p>
        <p>Total Receiving Yards: {detailedStats.total_receiving_yards}</p>
      </div>
    ) : (
      <p>No stats available.</p>
    )}
  </div>
);

const TeamInjuries = ({ injuries }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Injuries</h2>
    {injuries.length > 0 ? (
      <ul>
        {injuries.map((injury, idx) => (
          <li key={idx}>
            {injury.first_name} {injury.last_name} ({injury.position}): {injury.injury_type}, Out since {injury.date_out}, Expected return: {injury.expected_return}
          </li>
        ))}
      </ul>
    ) : (
      <p>No injuries reported.</p>
    )}
  </div>
);

const TeamSchedule = ({ schedule }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Schedule</h2>
    {schedule.length > 0 ? (
      <ul>
        {schedule.map((game, idx) => (
          <li key={idx}>
            {new Date(game.game_date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}, {game.game_time.slice(0, 5)}: {game.home_team_id} vs {game.away_team_id} at {game.stadium_name}
            {game.is_final ? ` (Final: ${game.home_score} - ${game.away_score})` : ' (Upcoming)'}
          </li>
        ))}
      </ul>
    ) : (
      <p>No games scheduled.</p>
    )}
  </div>
);

const TeamPage = () => {
  const router = useRouter();
  const { teamId } = router.query;
  const [teamData, setTeamData] = useState(null);
  const [teamLogos, setTeamLogos] = useState({});
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!teamId) return;

    const fetchTeamData = async () => {
      try {
        const response = await fetch(`/api/teams/${teamId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch team data');
        }
        const data = await response.json();
        setTeamData(data);
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError('Failed to load team data.');
      }
    };

    fetchTeamData();
  }, [teamId]);

  useEffect(() => {
    if (!teamData || !teamData.lastGame) return;

    const fetchLogos = async () => {
      const logoData = {};
      logoData[teamId] = teamData.team.logo_url;

      const lastGame = teamData.lastGame;
      if (lastGame) {
        const teamsToFetch = [lastGame.home_team_id, lastGame.away_team_id].filter(
          (id) => id !== teamId
        );
        for (const id of teamsToFetch) {
          try {
            const response = await fetch(`/api/teams/${id}`);
            if (response.ok) {
              const data = await response.json();
              logoData[id] = data.team.logo_url;
            }
          } catch (error) {
            console.error(`Error fetching logo for team ${id}:`, error);
          }
        }
      }

      setTeamLogos(logoData);
    };

    fetchLogos();
  }, [teamData, teamId]);

  if (error) {
    return <div className="container mx-auto py-6 text-red-600">{error}</div>;
  }

  if (!teamData) {
    return <div className="container mx-auto py-6">Loading...</div>;
  }

  const { team, seasonStats, lastGame, upcomingGame, depthChart, detailedStats, injuries, schedule, news } = teamData;

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">{team?.team_name || 'Unknown Team'}</h1>
        <p className="text-lg text-gray-600">
          Record: {seasonStats?.wins !== undefined && seasonStats?.losses !== undefined
            ? `${seasonStats.wins}-${seasonStats.losses}`
            : 'N/A'}
        </p>
        <nav className="flex space-x-4 mt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`text-blue-600 hover:underline ${activeTab === 'overview' ? 'font-bold' : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('depthChart')}
            className={`text-blue-600 hover:underline ${activeTab === 'depthChart' ? 'font-bold' : ''}`}
          >
            Depth Chart
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`text-blue-600 hover:underline ${activeTab === 'schedule' ? 'font-bold' : ''}`}
          >
            Schedule
          </button>
          <button
            onClick(() => setActiveTab('injuries')}
            className={`text-blue-600 hover:underline ${activeTab === 'injuries' ? 'font-bold' : ''}`}
          >
            Injuries
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`text-blue-600 hover:underline ${activeTab === 'stats' ? 'font-bold' : ''}`}
          >
            Stats
          </button>
        </nav>
      </div>
  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">{team?.team_name || 'Unknown Team'}</h1>
        <p className="text-lg text-gray-600">
          Record: {seasonStats?.wins !== undefined && seasonStats?.losses !== undefined
            ? `${seasonStats.wins}-${seasonStats.losses}`
            : 'N/A'}
        </p>
        <nav className="flex space-x-4 mt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`text-blue-600 hover:underline ${activeTab === 'overview' ? 'font-bold' : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('depthChart')}
            className={`text-blue-600 hover:underline ${activeTab === 'depthChart' ? 'font-bold' : ''}`}
          >
            Depth Chart
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`text-blue-600 hover:underline ${activeTab === 'schedule' ? 'font-bold' : ''}`}
          >
            Schedule
          </button>
          <button
            onClick(() => setActiveTab('injuries')}
            className={`text-blue-600 hover:underline ${activeTab === 'injuries' ? 'font-bold' : ''}`}
          >
            Injuries
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`text-blue-600 hover:underline ${activeTab === 'stats' ? 'font-bold' : ''}`}
          >
            Stats
          </button>
        </nav>
      </div>
  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">{team?.team_name || 'Unknown Team'}</h1>
        <p className="text-lg text-gray-600">
          Record: {seasonStats?.wins !== undefined && seasonStats?.losses !== undefined
            ? `${seasonStats.wins}-${seasonStats.losses}`
            : 'N/A'}
        </p>
        <nav className="flex space-x-4 mt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`text-blue-600 hover:underline ${activeTab === 'overview' ? 'font-bold' : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('depthChart')}
            className={`text-blue-600 hover:underline ${activeTab === 'depthChart' ? 'font-bold' : ''}`}
          >
            Depth Chart
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`text-blue-600 hover:underline ${activeTab === 'schedule' ? 'font-bold' : ''}`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('injuries')} // Line 176, fixed syntax
            className={`text-blue-600 hover:underline ${activeTab === 'injuries' ? 'font-bold' : ''}`}
          >
            Injuries
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`text-blue-600 hover:underline ${activeTab === 'stats' ? 'font-bold' : ''}`}
          >
            Stats
          </button>
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
                    {seasonStats?.wins !== undefined && seasonStats?.losses !== undefined
                      ? `${seasonStats.wins}-${seasonStats.losses}`
                      : 'N/A'}
                  </p>
                </div>
                <div className="border p-4 rounded">
                  <p className="text-gray-600">Points Scored</p>
                  <p className="text-lg font-semibold">
                    {seasonStats?.points_scored !== undefined
                      ? seasonStats.points_scored
                      : 'N/A'}
                  </p>
                </div>
                <div className="border p-4 rounded">
                  <p className="text-gray-600">Points Allowed</p>
                  <p className="text-lg font-semibold">
                    {seasonStats?.points_allowed !== undefined
                      ? seasonStats.points_allowed
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* 2024 Team Grades */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">2024 Team Grades</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="border p-4 rounded">
                  <p className="text-gray-600">Overall</p>
                  <p className="text-lg font-semibold">N/A</p>
                </div>
                <div className="border p-4 rounded flex items-center">
                  <p className="text-gray-600">Offense</p>
                  <span className="ml-2 text-green-500">✔</span>
                </div>
                <div className="border p-4 rounded flex items-center">
                  <p className="text-gray-600">Defense</p>
                  <span className="ml-2 text-green-500">✔</span>
                </div>
                <div className="border p-4 rounded flex items-center">
                  <p className="text-gray-600">Special Teams</p>
                  <span className="ml-2 text-green-500">✔</span>
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
                    })}, {lastGame.game_time.slice(0, 5)}
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={teamLogos[lastGame.home_team_id] || '/placeholder-logo.png'}
                      alt={`${lastGame.home_team_id} logo`}
                      className="w-12 h-12"
                      onError={(e) => (e.target.src = '/placeholder-logo.png')}
                    />
                    <p className="text-xl font-semibold">
                      {lastGame.home_score} - {lastGame.away_score}
                    </p>
                    <img
                      src={teamLogos[lastGame.away_team_id] || '/placeholder-logo.png'}
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
                      src={teamLogos[upcomingGame.home_team_id] || '/placeholder-logo.png'}
                      alt={`${upcomingGame.home_team_id} logo`}
                      className="w-12 h-12"
                      onError={(e) => (e.target.src = '/placeholder-logo.png')}
                    />
                    <p className="text-xl font-semibold">vs</p>
                    <img
                      src={teamLogos[upcomingGame.away_team_id] || '/placeholder-logo.png'}
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
              {news && news.length > 0 ? (
                <div className="space-y-4">
                  {news.map((newsItem, idx) => (
                    <div key={idx} className="border-b pb-4 last:border-b-0">
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
                          Read More
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
      {activeTab === 'depthChart' && <TeamDepthChart depthChart={depthChart} />}
      {activeTab === 'stats' && <TeamStatsTable detailedStats={detailedStats} />}
      {activeTab === 'injuries' && <TeamInjuries injuries={injuries} />}
      {activeTab === 'schedule' && <TeamSchedule schedule={schedule} />}
    </div>
  );
};

export default TeamPage;
