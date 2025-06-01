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
    <div className="bg-gradient-to-r from-blue-50 via-white to-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4 shadow-sm mb-6">
          <div className="flex items-center space-x-4">
            <img src={team.team_logo_espn} alt={`${team.team_name} logo`} className="w-16 h-16 rounded-full" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{team.team_name}</h1>
              <p className="text-sm text-gray-500">{team.division} • Est. {team.founded_year}</p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p className="font-semibold">Coach: {team.head_coach}</p>
            <p className="text-xs italic">{team.city}</p>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex space-x-4 border-b border-gray-200 mb-6">
          {['overview', 'depthChart', 'schedule', 'injuries', 'stats'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Snapshot */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Team Snapshot</h2>
                <p className="text-sm text-gray-700">Record: {seasonStats?.wins}-{seasonStats?.losses}</p>
                <p className="text-sm text-gray-700">Points Scored: {seasonStats?.points_scored}</p>
                <p className="text-sm text-gray-700">Points Allowed: {seasonStats?.points_allowed}</p>
              </div>

              {/* Last Game */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Last Game</h2>
                {lastGame ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={teamLogos[lastGame.home_team_id]} className="w-10 h-10" />
                      <span className="text-sm">{lastGame.home_score}</span>
                      <span className="text-xs text-gray-500">vs</span>
                      <span className="text-sm">{lastGame.away_score}</span>
                      <img src={teamLogos[lastGame.away_team_id]} className="w-10 h-10" />
                    </div>
                    <span className="text-sm text-gray-500">{lastGame.game_date}</span>
                  </div>
                ) : <p>No recent game</p>}
              </div>

              {/* Upcoming Game */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Upcoming Game</h2>
                {upcomingGame ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={teamLogos[upcomingGame.home_team_id]} className="w-10 h-10" />
                      <span className="text-xs text-gray-500">vs</span>
                      <img src={teamLogos[upcomingGame.away_team_id]} className="w-10 h-10" />
                    </div>
                    <span className="text-sm text-gray-500">{upcomingGame.game_date}</span>
                  </div>
                ) : <p>No upcoming game</p>}
              </div>
            </div>

            {/* News */}
            <div className="bg-white p-4 rounded-lg shadow h-fit">
              <h2 className="text-lg font-semibold mb-4">Latest News</h2>
              <p className="text-sm text-gray-500">Coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
