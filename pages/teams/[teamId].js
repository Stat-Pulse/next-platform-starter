import Image from 'next/image';
import { notFound } from 'next/navigation';
import TeamDepthChart from '@/components/team/TeamDepthChart';
import TeamStatsTable from '@/components/team/TeamStatsTable';
import TeamInjuries from '@/components/team/TeamInjuries';
import TeamSchedule from '@/components/team/TeamSchedule';
import mysql from 'mysql2/promise';
import { useState } from 'react';

async function getTeamData(teamId) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/teams/${teamId}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching team data:', error);
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
  if (!teamData || !teamData.team) return { notFound: true };

  // Fetch logos for lastGame and upcomingGame
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

  return { props: { teamData, teamLogos } };
}

export default function TeamPage({ teamData, teamLogos }) {
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
                    />
                    <p className="text-xl font-semibold">
                      {lastGame.home_score} - {lastGame.away_score}
                    </p>
                    <Image
                      src={teamLogos[lastGame.away_team_id] || '/placeholder-logo.png'}
                      alt={`${lastGame.away_team_id} logo`}
                      width={48}
                      height={48}
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

            {/* Upcoming Game */}
            <div className="bg-white p-4 rounded shadow relative">
              <h2 className="text-xl font-semibold mb-4">Next Game</h2>
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
                    />
                    <p className="text-xl font-semibold">vs</p>
                    <Image
                      src={teamLogos[upcomingGame.away_team_id] || '/placeholder-logo.png'}
                      alt={`${upcomingGame.away_team_id} logo`}
                      width={48}
                      height={48}
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
                  />
                  <p className="text-gray-600 text-center">No Upcoming Game</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-1">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Team Info</h2>
              <p className="text-gray-600">City: {team?.city || 'N/A'}</p>
              <p className="text-gray-600">Conference: {team?.conference || 'N/A'}</p>
              <p className="text-gray-600">Division: {team?.division || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'depthChart' && <TeamDepthChart depthChart={depthChart} />}
      {activeTab === 'stats' && <TeamStatsTable detailedStats={detailedStats} />}
      {activeTab === 'injuries' && <TeamInjuries injuries={injuries} />}
      {activeTab === 'schedule' && <TeamSchedule schedule={schedule} />}
    </div>
  );
}