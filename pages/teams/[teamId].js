// pages/api/teams/[teamId].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const {
    query: { teamId },
  } = req;

  if (!teamId) return res.status(400).json({ error: 'Missing teamId' });

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [teamRows] = await connection.execute(
      `SELECT * FROM Teams WHERE team_id = ? LIMIT 1`,
      [teamId]
    );
    if (teamRows.length === 0) return res.status(404).json({ error: 'Team not found' });
    const team = teamRows[0];

    const [statsRows] = await connection.execute(
      `SELECT wins, losses, points_scored, points_allowed
       FROM Team_Stats_2024
       WHERE team_id = ? LIMIT 1`,
      [teamId]
    );
    const seasonStats = statsRows[0] || null;

    const [lastGameRows] = await connection.execute(
      `SELECT * FROM Games
       WHERE (home_team_id = ? OR away_team_id = ?) AND season_id = 2024
       ORDER BY game_date DESC, game_time DESC
       LIMIT 1`,
      [teamId, teamId]
    );
    const lastGame = lastGameRows[0] || null;

    const [upcomingGameRows] = await connection.execute(
      `SELECT * FROM Games
       WHERE (home_team_id = ? OR away_team_id = ?) AND season_id = 2024 AND game_date > CURRENT_DATE()
       ORDER BY game_date ASC, game_time ASC
       LIMIT 1`,
      [teamId, teamId]
    );
    const upcomingGame = upcomingGameRows[0] || null;

    // Get team logos for opponents
    const teamIds = [lastGame?.home_team_id, lastGame?.away_team_id, upcomingGame?.home_team_id, upcomingGame?.away_team_id].filter(Boolean);
    const [logoRows] = await connection.query(
      `SELECT team_id, team_logo_espn FROM Teams WHERE team_id IN (${teamIds.map(() => '?').join(',')})`,
      teamIds
    );
    const teamLogos = Object.fromEntries(logoRows.map(t => [t.team_id, t.team_logo_espn]));

    res.status(200).json({
      team,
      seasonStats,
      lastGame,
      upcomingGame,
      teamLogos,
    });
  } catch (error) {
    console.error('Team API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// pages/teams/[teamId].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const TeamPage = () => {
  const router = useRouter();
  const { teamId } = router.query;
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!teamId) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/teams/${teamId}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load team data');
        setTeamData(json);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [teamId]);

  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!teamData) return <div className="p-4">Loading...</div>;

  const { team, seasonStats, lastGame, upcomingGame, teamLogos } = teamData;

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">{team.team_name}</h1>
        <p className="text-lg text-gray-600">{team.division}</p>
        <div className="text-sm text-gray-500">Founded: {team.founded_year}, Coach: {team.head_coach}</div>
        <nav className="mt-4 space-x-4">
          {['overview', 'depthChart', 'schedule', 'injuries', 'stats'].map(tab => (
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

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">2024 Season Stats</h2>
              <p>Record: {seasonStats ? `${seasonStats.wins}-${seasonStats.losses}` : 'N/A'}</p>
              <p>Points Scored: {seasonStats?.points_scored}</p>
              <p>Points Allowed: {seasonStats?.points_allowed}</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Stadium</h2>
              <p>{team.stadium_name} ({team.city})</p>
              <p>Capacity: {team.stadium_capacity?.toLocaleString()}</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Last Game</h2>
              {lastGame ? (
                <div>
                  <p>{lastGame.game_date} - {lastGame.game_time}</p>
                  <div className="flex items-center gap-4">
                    <img src={teamLogos[lastGame.home_team_id]} alt="Home Logo" className="w-12 h-12" />
                    <p>{lastGame.home_score} - {lastGame.away_score}</p>
                    <img src={teamLogos[lastGame.away_team_id]} alt="Away Logo" className="w-12 h-12" />
                  </div>
                </div>
              ) : 'No recent games.'}
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">Upcoming Game</h2>
              {upcomingGame ? (
                <div>
                  <p>{upcomingGame.game_date} - {upcomingGame.game_time}</p>
                  <div className="flex items-center gap-4">
                    <img src={teamLogos[upcomingGame.home_team_id]} alt="Home Logo" className="w-12 h-12" />
                    <span>vs</span>
                    <img src={teamLogos[upcomingGame.away_team_id]} alt="Away Logo" className="w-12 h-12" />
                  </div>
                </div>
              ) : 'No upcoming games.'}
            </div>
          </div>

          <div className="md:col-span-1 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Latest News</h2>
            <p>Coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;