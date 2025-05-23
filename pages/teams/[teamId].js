import Image from 'next/image';
import { notFound } from 'next/navigation';
import mysql from 'mysql2/promise';
import { useState } from 'react';

// Placeholder components until implemented
const TeamDepthChart = ({ depthChart }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Depth Chart</h2>
    {depthChart?.length > 0 ? (
      <ul className="space-y-2">
        {depthChart.map((player, idx) => (
          <li key={idx} className="border-b py-2">
            {player.position}: {player.full_name} (Jersey: {player.jersey_number || 'N/A'})
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No depth chart available.</p>
    )}
  </div>
);

const TeamStatsTable = ({ detailedStats }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Team Stats</h2>
    {detailedStats?.total_passing_yards !== undefined ? (
      <div className="space-y-2">
        <p>Total Passing Yards: {detailedStats.total_passing_yards || 0}</p>
        <p>Total Rushing Yards: {detailedStats.total_rushing_yards || 0}</p>
        <p>Total Receiving Yards: {detailedStats.total_receiving_yards || 0}</p>
      </div>
    ) : (
      <p className="text-gray-500">No stats available.</p>
    )}
  </div>
);

const TeamInjuries = ({ injuries }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Injuries</h2>
    {injuries?.length > 0 ? (
      <ul className="space-y-2">
        {injuries.map((injury, idx) => (
          <li key={idx} className="border-b py-2">
            {injury.full_name} ({injury.position}): {injury.report_primary_injury || 'N/A'}, 
            Status: {injury.report_status || 'N/A'}, 
            Last Updated: {new Date(injury.date_modified).toLocaleDateString()}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No injuries reported.</p>
    )}
  </div>
);

const TeamSchedule = ({ schedule }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-4">Schedule</h2>
    {schedule?.length > 0 ? (
      <ul className="space-y-2">
        {schedule.map((game, idx) => (
          <li key={idx} className="border-b py-2">
            {new Date(game.game_date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}, {game.game_time?.slice(0, 5) || 'N/A'}: 
            {game.home_team_id} vs {game.away_team_id} at {game.stadium_name || 'N/A'}
            {game.is_final ? ` (Final: ${game.home_score} - ${game.away_score})` : ' (Upcoming)'}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No games scheduled.</p>
    )}
  </div>
);

async function getTeamData(teamId) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/teams/${teamId}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.log(`Failed to fetch team data for ${teamId}: ${res.status}`);
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching team data for ${teamId}:`, error);
    return null;
  }
}

export async function getStaticPaths() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'stat_pulse_analytics_db',
    });
    const [rows] = await connection.execute('SELECT team_abbr FROM Teams');
    await connection.end();
    const paths = rows.map((row) => ({
      params: { teamId: row.team_abbr.toLowerCase() },
    }));
    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  const teamId = params.teamId;
  const teamData = await getTeamData(teamId);
  if (!teamData || !teamData.team) {
    console.log(`No team data found for teamId: ${teamId}`);
    return { notFound: true };
  }

  // Fetch logos for lastGame teams if available
  const teamLogos = { [teamData.team.team_abbr]: teamData.team.logo_url };
  const teamsToFetch = [];

  if (teamData.lastGame) {
    teamsToFetch.push(
      teamData.lastGame.home_team_id !== teamData.team.team_abbr ? teamData.lastGame.home_team_id : null,
      teamData.lastGame.away_team_id !== teamData.team.team_abbr ? teamData.lastGame.away_team_id : null
    );
  }
  if (teamData.upcomingGame) {
    teamsToFetch.push(
      teamData.upcomingGame.home_team_id !== teamData.team.team_abbr ? teamData.upcomingGame.home_team_id : null,
      teamData.upcomingGame.away_team_id !== teamData.team.team_abbr ? teamData.upcomingGame.away_team_id : null
    );
  }

  for (const id of teamsToFetch.filter(Boolean)) {
    const data = await getTeamData(id.toLowerCase());
    if (data?.team) teamLogos[id] = data.team.logo_url;
  }

  // Fetch news (placeholder until you provide an API endpoint)
  const newsItems = [
    { title: 'News 1', link: '#', timestamp: '1 hour ago' },
    { title: 'News 2', link: '#', timestamp: '2 hours ago' },
    { title: 'News 3', link: '#', timestamp: '3 hours ago' },
    { title: 'News 4', link: '#', timestamp: '4 hours ago' },
    { title: 'News 5', link: '#', timestamp: '5 hours ago' },
    { title: 'News 6', link: '#', timestamp: '6 hours ago' },
  ];

  return {
    props: {
      teamData,
      teamLogos,
      newsItems,
    },
  };
}

export default function TeamPage({ teamData, teamLogos, newsItems }) {
  const [activeTab, setActiveTab] = useState('overview');

  const { team, seasonStats, lastGame, upcomingGame, depthChart, detailedStats, injuries, schedule } = teamData;

  return (
    <div className="container mx-auto py-6">
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
              Record: {seasonStats?.wins !== undefined && seasonStats?.losses !== undefined
                ? `${seasonStats.wins}-${seasonStats.losses}`
                : 'N/A'}
            </p>
          </div>
        </div>
        <nav className="flex space-x-4 mt-2">
          {['overview', 'depthChart', 'schedule', 'injuries', 'stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-blue-600 hover:underline ${activeTab === tab ? 'font-bold' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                    {seasonStats?.wins !== undefined && seasonStats?.losses !== undefined
                      ? `${seasonStats.wins}-${seasonStats.losses}`
                      : 'N/A'}
                  </p>
                </div>
                <div className="border p-4 rounded">
                  <p className="text-gray-600">Points Scored</p>
                  <p className="text-lg font-semibold">
                    {seasonStats?.points_scored !== undefined ? seasonStats.points_scored : 'N/A'}
                  </p>
                </div>
                <div className="border p-4 rounded">
                  <p className="text-gray-600">Points Allowed</p>
                  <p className="text-lg font-semibold">
                    {seasonStats?.points_allowed !== undefined ? seasonStats.points_allowed : 'N/A'}
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
                    })}, {lastGame.game_time?.slice(0, 5) || 'N/A'}
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
                    })}, {upcomingGame.game_time?.slice(0, 5) || 'N/A'}
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

            {/* Fantasy Projections (Placeholder) */}
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
}
