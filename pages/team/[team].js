import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Placeholder for fetching data (replace with your actual API calls)
const fetchTeamData = async (teamId) => {
  // Simulate API calls with provided data for DET
  if (teamId === 'DET') {
    return {
      team: {
        team_name: 'Detroit Lions',
        division: 'NFC North',
        logo_url: 'path/to/detroit-lions-logo.png',
      },
      seasonStats: {
        wins: 32,
        losses: 21,
        points_scored: 564,
        points_allowed: 342,
      },
      lastGame: {
        game_date: '2025-01-18',
        game_time: '20:00:00',
        home_team_id: 'DET',
        away_team_id: 'WAS',
        home_score: 31,
        away_score: 45,
      },
      upcomingGame: null,
    };
  }
  // Add logic for other teams or actual API calls
  return {};
};

// Placeholder for team logos (fetch dynamically from Teams table)
const teamLogos = {
  DET: 'path/to/detroit-lions-logo.png',
  WAS: 'path/to/washington-commanders-logo.png',
  // Add more team logos as needed
};

const TeamPage = ({ newsItems }) => {
  const { teamId } = useParams(); // Get teamId from URL (e.g., /teams/DET)
  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
    const loadTeamData = async () => {
      const data = await fetchTeamData(teamId);
      setTeamData(data);
    };
    loadTeamData();
  }, [teamId]);

  if (!teamData) {
    return <div className="container mx-auto py-6">Loading...</div>;
  }

  const { team, seasonStats, lastGame, upcomingGame } = teamData;

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">{team.team_name}</h1>
        <p className="text-lg text-gray-600">
          Record: {seasonStats ? `${seasonStats.wins}-${seasonStats.losses}` : 'Loading...'}
        </p>
        <nav className="flex space-x-4 mt-2">
          <a href="#" className="text-blue-600 hover:underline">Depth Chart</a>
          <a href="#" className="text-blue-600 hover:underline">Schedule</a>
          <a href="#" className="text-blue-600 hover:underline">Injuries</a>
          <a href="#" className="text-blue-600 hover:underline">Transactions</a>
        </nav>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left/Middle Column */}
        <div className="md:col-span-2 space-y-6">
          {/* 2024 Season Stats */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">2024 Season Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border p-4 rounded">
                <p className="text-gray-600">Division</p>
                <p className="text-lg font-semibold">{team.division}</p>
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
                  {seasonStats ? seasonStats.points_scored : 'Loading...'}
                </p>
              </div>
              <div className="border p-4 rounded">
                <p className="text-gray-600">Points Allowed</p>
                <p className="text-lg font-semibold">
                  {seasonStats ? seasonStats.points_allowed : 'Loading...'}
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
                    src={teamLogos[lastGame.home_team_id]}
                    alt={`${lastGame.home_team_id} logo`}
                    className="w-12 h-12"
                  />
                  <p className="text-xl font-semibold">
                    {lastGame.home_score} - {lastGame.away_score}
                  </p>
                  <img
                    src={teamLogos[lastGame.away_team_id]}
                    alt={`${lastGame.away_team_id} logo`}
                    className="w-12 h-12"
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
                    src={teamLogos[upcomingGame.home_team_id]}
                    alt={`${upcomingGame.home_team_id} logo`}
                    className="w-12 h-12"
                  />
                  <p className="text-xl font-semibold">vs</p>
                  <img
                    src={teamLogos[upcomingGame.away_team_id]}
                    alt={`${upcomingGame.away_team_id} logo`}
                    className="w-12 h-12"
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={team.logo_url}
                  alt={`${team.team_name} logo`}
                  className="absolute inset-0 w-full h-full object-cover opacity-10"
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
    </div>
  );
};

export default TeamPage;