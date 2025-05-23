import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

// Components
const TeamDepthChart = ({ depthChart }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Team Depth Chart</h2>
    {depthChart && depthChart.length > 0 ? (
      <div className="space-y-2">
        {depthChart.map((player, idx) => (
          <div key={idx} className="border-b pb-2">
            <p className="font-semibold">{player.full_name}</p>
            <p className="text-sm text-gray-600">
              Position: {player.position}, Jersey: {player.jersey_number || 'N/A'}
            </p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-600">No depth chart available.</p>
    )}
  </div>
);

const TeamStatsTable = ({ detailedStats }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Team Stats</h2>
    {detailedStats ? (
      <div className="space-y-2">
        <p>Passing Yards: {detailedStats.total_passing_yards || 0}</p>
        <p>Rushing Yards: {detailedStats.total_rushing_yards || 0}</p>
        <p>Receiving Yards: {detailedStats.total_receiving_yards || 0}</p>
      </div>
    ) : (
      <p className="text-gray-600">No stats available.</p>
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
            <p className="text-sm text-gray-600">
              {injury.injury_status} - {injury.injury_description}
            </p>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-600">No injuries reported.</p>
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
              {new Date(game.game_date).toLocaleDateString()} at {game.game_time?.slice(0, 5) || 'TBD'}
            </p>
            {game.final_score && (
              <p className="text-sm">Final: {game.final_score}</p>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-600">No games scheduled.</p>
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
    if (!teamId || !router.isReady) return;

    const fetchTeamData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (typeof window === 'undefined') {
          return;
        }

        const teamResponse = await fetch(`/api/teams/${teamId}`);
        
        if (!teamResponse.ok) {
          if (teamResponse.status === 404) {
            throw new Error('Team not found');
          }
          throw new Error(`Failed to fetch team data: ${teamResponse.status}`);
        }
        
        const data = await teamResponse.json();
        setTeamData(data);

        const teamsToFetch = new Set([teamId]);
        
        if (data.lastGame) {
          teamsToFetch.add(data.lastGame.home_team_id);
          teamsToFetch.add(data.lastGame.away_team_id);
        }
        
        if (data.upcomingGame) {
          teamsToFetch.add(data.upcomingGame.home_team_id);
          teamsToFetch.add(data.upcomingGame.away_team_id);
        }

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
        
        const logoResults = await Promise.allSettled(logoPromises);
        const logos = {};
        logoResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            const { abbr, logo_url } = result.value;
            logos[abbr] = logo_url || '/placeholder-logo.png';
          }
        });
        setTeamLogos(logos);

        try {
          const newsResponse = await fetch(`/api/news?team=${teamId}&limit=6`);
          if (newsResponse.ok) {
            const news = await newsResponse.json();
            setNewsItems(Array.isArray(news) ? news : []);
          } else {
            setNewsItems([
              { title: `${data.team?.team_name || 'Team'} News 1`, link: '#', timestamp: '1 hour ago' },
              { title: `${data.team?.team_name || 'Team'} News 2`, link: '#', timestamp: '2 hours ago' },
            ]);
          }
        } catch (newsError) {
          console.error('Error fetching news:', newsError);
          setNewsItems([]);
        }

      } catch (error) {
        console.error('Error fetching team data:', error);
        setError(error.message || 'Failed to load team data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId, router.isReady]);

  if (!router.isReady || loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
          <button 
            onClick={() => router.reload()} 
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!teamData || !teamData.team) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Team not found</h1>
          <p className="text-gray-600">The team "{teamId}" could not be found.</p>
          <button 
            onClick={() => router.push('/')} 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const { team, seasonStats, lastGame, upcomingGame, depthChart, detailedStats, injuries, schedule } = teamData;

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {team?.logo_url && (
            <Image
              src={team.logo_url}
              alt={team.team_name}
              width={80}
              height={80}
              className="rounded-full"
              onError={(e) => (e.target.src = '/placeholder-logo.png')}
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-blue-600">{team?.team_name || 'Unknown Team'}</h1>
            <p className="text-lg text-gray-600">
              Record: {seasonStats ? `${seasonStats.wins}-${seasonStats.losses}` : 'Loading...'}
            </p>
          </div>
        </div>
        <nav className="flex space-x-4 mt-2 overflow-x-auto">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'depthChart', label: 'Depth Chart' },
            { key: 'schedule', label: 'Schedule' },
            { key: 'injuries', label: 'Injuries' },
            { key: 'stats', label: 'Stats' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-blue-600 hover:underline whitespace-nowrap ${
                activeTab === tab.key ? 'font-bold' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left/Middle Column */}
          <div className="lg:col-span-2 space-y-6">
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
                  <span className={`ml-2 ${seasonStats?.offense_grade ? 'text-green-500' : 'text-gray-500'}`}>
                    {seasonStats?.offense_grade || 'N/A'}
                  </span>
                </div>
                <div className="border p-4 rounded flex items-center">
                  <p className="text-gray-600">Defense</p>
                  <span className={`ml-2 ${seasonStats?.defense_grade ? 'text-green-500' : 'text-gray-500'}`}>
                    {seasonStats?.defense_grade || 'N/A'}
                  </span>
                </div>
                <div className="border p-4 rounded flex items-center">
                  <p className="text-gray-600">Special Teams</p>
                  <span className={`ml-2 ${seasonStats?.special_teams_grade ? 'text-green-500' : 'text-gray-500'}`}>
                    {seasonStats?.special_teams_grade || 'N/A'}
                  </span>
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
                    })}, {lastGame.game_time?.slice(0, 5) || 'TBD'}
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <Image
                      src={teamLogos[lastGame.home_team_id] || '/placeholder-logo.png'}
                      alt={`${lastGame.home_team_id} logo`}
                      width={48}
                      height={48}
                      onError={(e) => (e.target.src = '/placeholder-logo.png')}
                    />
                    <p className="text-xl font-semibold">
                      {lastGame.home_score} - {lastGame.away_score}
                    </p>
                    <Image
                      src={teamLogos[lastGame.away_team_id] || '/placeholder-logo.png'}
                      alt={`${lastGame.away_team_id} logo`}
                      width={48}
                      height={48}
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
              <h2 className="text-xl font-semibold mb-4">Betting Odds</h2>
              {upcomingGame ? (
                <div>
                  <p className="text-gray-600 mb-2">
                    {new Date(upcomingGame.game_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}, {upcomingGame.game_time?.slice(0, 5) || 'TBD'}
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <Image
                      src={teamLogos[upcomingGame.home_team_id] || '/placeholder-logo.png'}
                      alt={`${upcomingGame.home_team_id} logo`}
                      width={48}
                      height={48}
                      onError={(e) => (e.target.src = '/placeholder-logo.png')}
                    />
                    <p className="text-xl font-semibold">vs</p>
                    <Image
                      src={teamLogos[upcomingGame.away_team_id] || '/placeholder-logo.png'}
                      alt={`${upcomingGame.away_team_id} logo`}
                      width={48}
                      height={48}
                      onError={(e) => (e.target.src = '/placeholder-logo.png')}
                    />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Image
                    src={team?.logo_url || '/placeholder-logo.png'}
                    alt={`${team?.team_name || 'Team'} logo`}
                    width={100}
                    height={100}
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
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Latest News</h2>
              {!newsItems || newsItems.length === 0 ? (
                <p className="text-gray-500">Loading latest news...</p>
              ) : (
                <div className="space-y-4">
                  {newsItems.slice(0, 6).map((news, idx) => (
                    <div key={idx} className="border-b pb-4 last:border-b-0">
                      <h4 className="text-md font-semibold text-gray-800 mb-2">{news.title}</h4>
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
