// pages/teams/[teamId].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Placeholder components until the actual ones are implemented
const TeamDepthChart = ({ depthChart }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Team Depth Chart</h2>
    {depthChart ? (
      <div>
        {/* Render depth chart data */}
        <p className="text-gray-600">Depth chart data loaded</p>
      </div>
    ) : (
      <p className="text-gray-600">Coming Soon</p>
    )}
  </div>
);

const TeamStatsTable = ({ detailedStats }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Team Stats</h2>
    {detailedStats ? (
      <div>
        {/* Render detailed stats */}
        <p className="text-gray-600">Detailed stats loaded</p>
      </div>
    ) : (
      <p className="text-gray-600">Coming Soon</p>
    )}
  </div>
);

const TeamInjuries = ({ injuries }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Team Injuries</h2>
    {injuries && injuries.length > 0 ? (
      <div className="space-y-2">
        {injuries.map((injury, idx) => (
          <div key={idx} className="border-b pb-2">
            <p className="font-semibold">{injury.player_name}</p>
            <p className="text-sm text-gray-600">{injury.injury_status} - {injury.injury_description}</p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-600">No injuries reported</p>
    )}
  </div>
);

const TeamSchedule = ({ schedule }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Team Schedule</h2>
    {schedule && schedule.length > 0 ? (
      <div className="space-y-4">
        {schedule.map((game, idx) => (
          <div key={idx} className="border p-4 rounded">
            <p className="font-semibold">
              Week {game.week}: vs {game.opponent}
            </p>
            <p className="text-sm text-gray-600">
              {new Date(game.game_date).toLocaleDateString()} at {game.game_time}
            </p>
            {game.final_score && (
              <p className="text-sm">Final: {game.final_score}</p>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-600">Coming Soon</p>
    )}
  </div>
);

const TeamPage = () => {
  const router = useRouter();
  const { teamId } = router.query;
  const [teamData, setTeamData] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [teamLogos, setTeamLogos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!teamId) return;

    const fetchTeamData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch main team data
        const teamResponse = await fetch(`/api/teams/${teamId}`);
        
        if (!teamResponse.ok) {
          throw new Error(`Failed to fetch team data: ${teamResponse.status}`);
        }
        
        const data = await teamResponse.json();
        setTeamData(data);

        // Fetch team logos for opponent teams
        const teamsToFetch = new Set([teamId]);
        
        if (data.lastGame) {
          teamsToFetch.add(data.lastGame.home_team_id);
          teamsToFetch.add(data.lastGame.away_team_id);
        }
        
        if (data.upcomingGame) {
          teamsToFetch.add(data.upcomingGame.home_team_id);
          teamsToFetch.add(data.upcomingGame.away_team_id);
        }

        // Fetch logos
        const logoPromises = Array.from(teamsToFetch).map(async (abbr) => {
          try {
            const logoResponse = await fetch(`/api/teams/${abbr}`);
            if (logoResponse.ok) {
              const logoData = await logoResponse.json();
              return { abbr, logo_url: logoData.team?.logo_url };
            }
          } catch (error) {
            console.error(`Error fetching logo for ${abbr}:`, error);
          }
          return { abbr, logo_url: '/placeholder-logo.png' };
        });
        
        const logoResults = await Promise.all(logoPromises);
        const logos = {};
        logoResults.forEach(({ abbr, logo_url }) => {
          logos[abbr] = logo_url || '/placeholder-logo.png';
        });
        setTeamLogos(logos);

        // Fetch news
        try {
          const newsResponse = await fetch(`/api/news?team=${teamId}&limit=6`);
          if (newsResponse.ok) {
            const news = await newsResponse.json();
            setNewsItems(news);
          } else {
            // Fallback news
            setNewsItems([
              { title: `${data.team.team_name} News 1`, link: '#', timestamp: '1 hour ago' },
              { title: `${data.team.team_name} News 2`, link: '#', timestamp: '2 hours ago' },
            ]);
          }
        } catch (newsError) {
          console.error('Error fetching news:', newsError);
          setNewsItems([]);
        }

      } catch (error) {
        console.error('Error fetching team data:', error);
        setError('Failed to load team data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId]);

  if (loading) {
    return <div className="container mx-auto py-6">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-6 text-red-600">{error}</div>;
  }

  if (!teamData || !teamData.team) {
    return <div className="container mx-auto py-6">Team not found.</div>;
  }

  const { team, seasonStats, lastGame, upcomingGame, depthChart, detailedStats, injuries, schedule } = teamData;

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">{team?.team_name || 'Unknown Team'}</h1>
        <p className="text-lg text-gray-600">
          Record: {seasonStats ? `${seasonStats.wins}-${seasonStats.losses}` : 'Loading...'}
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
            onClick={() => setActiveTab('injuries')}
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

            {/* 2024 Team Grades */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">2024 Team Grades</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="border p-4 rounded">
                  <p className="text-gray-600">Overall</p>
                  <p className="text-lg font-semibold">{seasonStats?.overall_grade || 'N/A'}</p>
                </div>
                <div className="border p-4 rounded flex items-center">
                  <p className="text-gray-600">Offense</p>
                  <span className="ml-2 text-green-500">{seasonStats?.offense_grade || 'N/A'}</span>
                </div>
                <div className="border p-4 rounded flex items-center">
                  <p className="text-gray-600">Defense</p>
                  <span className="ml-2 text-green-500">{seasonStats?.defense_grade || 'N/A'}</span>
                </div>
                <div className="border p-4 rounded flex items-center">
                  <p className="text-gray-600">Special Teams</p>
                  <span className="ml-2 text-green-500">{seasonStats?.special_teams_grade || 'N/A'}</span>
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

            {/* Betting Odds */}
            <div className="bg-white p-4 rounded shadow relative">
              <h2 className="text-xl font-semibold mb-4"> Betting Odds</h2>
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
              {!newsItems || newsItems.length === 0 ? (
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

// Generate static paths for all teams
export async function getStaticPaths() {
  // For Netlify deployment, provide common team paths
  // You can expand this list or make it dynamic once your API is deployed
  const commonTeams = [
    'ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE',
    'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAX', 'KC',
    'LV', 'LAC', 'LAR', 'MIA', 'MIN', 'NE', 'NO', 'NYG',
    'NYJ', 'PHI', 'PIT', 'SF', 'SEA', 'TB', 'TEN', 'WAS'
  ];
  
  const paths = commonTeams.map(teamId => ({
    params: { teamId }
  }));

  return {
    paths,
    fallback: 'blocking' // This allows for additional teams not in the list
  };
}

// No getStaticProps needed - data fetching happens client-side
export default TeamPage;
