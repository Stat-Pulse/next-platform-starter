import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'; // ✅ Import router

export default function TeamPage() {
  const router = useRouter();
  const { teamId } = router.query; // ✅ Get teamId from route

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added for debugging
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!teamId) return; // Wait for teamId to be available

    async function fetchData() {
      try {
        console.log(`Fetching data for teamId: ${teamId}`);
        const res = await fetch(`/api/team/${teamId}`);
        console.log(`Fetch response status: ${res.status}`);
        if (!res.ok) {
          const errorData = await res.json();
          console.log('Fetch error response:', errorData);
          throw new Error(errorData.error || 'Failed to fetch data');
        }
        const result = await res.json();
        console.log('Fetch result:', result);
        setData(result);
      } catch (error) {
        console.error('Fetch error:', error.message);
        setError(error.message);
        setData(null); // Ensure data is null on error
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [teamId]);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (error || !data) {
    return <div>Error: {error || 'Failed to load data'}</div>;
  }

  const { team, seasonStats, lastGame, upcomingGame, news, topPlayers } = data;
  const teamColors = {
    primary: team.primary_color || '#1D2526',
    secondary: team.secondary_color || '#A5ACAF',
  };

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>{team.team_name} | StatPulse Analytics</title>
      </Head>

      {/* Team Header */}
      <div className="flex items-center mb-6" style={{ backgroundColor: teamColors.primary, color: '#fff' }}>
        <img src={team.logo_url || '/placeholder-logo.png'} alt={`${team.team_name} logo`} className="w-16 h-16 mr-4" onError={(e) => (e.target.src = '/placeholder-logo.png')} />
        <div>
          <h1 className="text-3xl font-bold">{team.city} {team.nickname}</h1>
          <p>{team.division} | Founded: {team.founded_year || 'N/A'}</p>
        </div>
      </div>

      {/* Team Info */}
      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 mb-6" style={{ borderColor: teamColors.primary }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.primary }}>Team Information</h2>
        <p><strong>Stadium:</strong> {team.stadium_name || 'N/A'}</p>
        <p><strong>Head Coach:</strong> {team.head_coach || 'N/A'}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        {['overview', 'topPlayers'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 ${activeTab === tab ? 'border-b-2' : ''}`}
            style={{ borderColor: activeTab === tab ? teamColors.primary : 'transparent' }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' ? 'Overview' : 'Top Players'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Season Stats */}
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: teamColors.primary }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.primary }}>2024 Season Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <p>Wins: {seasonStats.wins}</p>
              <p>Losses: {seasonStats.losses}</p>
              <p>Points Scored: {seasonStats.points_scored}</p>
              <p>Points Allowed: {seasonStats.points_allowed}</p>
            </div>
          </div>

          {/* Last Game */}
          {lastGame && (
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: teamColors.primary }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.primary }}>Last Game</h2>
              <div className="flex items-center justify-between">
                <img src={lastGame.home_team_logo || '/placeholder-logo.png'} alt={`${lastGame.home_team_id} logo`} className="w-12 h-12" onError={(e) => (e.target.src = '/placeholder-logo.png')} />
                <p className="text-xl font-semibold">{lastGame.home_score} - {lastGame.away_score}</p>
                <img src={lastGame.away_team_logo || '/placeholder-logo.png'} alt={`${lastGame.away_team_id} logo`} className="w-12 h-12" onError={(e) => (e.target.src = '/placeholder-logo.png')} />
              </div>
            </div>
          )}

          {/* PFF Betting Odds (Upcoming Game) */}
          {upcomingGame && (
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: teamColors.primary }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.primary }}>PFF Betting Odds</h2>
              <div className="flex items-center justify-between">
                <img src={upcomingGame.home_team_logo || '/placeholder-logo.png'} alt={`${upcomingGame.home_team_id} logo`} className="w-12 h-12" onError={(e) => (e.target.src = '/placeholder-logo.png')} />
                <p className="text-xl font-semibold">vs</p>
                <img src={upcomingGame.away_team_logo || '/placeholder-logo.png'} alt={`${upcomingGame.away_team_id} logo`} className="w-12 h-12" onError={(e) => (e.target.src = '/placeholder-logo.png')} />
              </div>
              <p>{upcomingGame.game_date} at {upcomingGame.stadium_name}</p>
            </div>
          )}

          {/* News */}
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: teamColors.primary }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.primary }}>Recent News</h2>
            {news.map((item, index) => (
              <div key={index} className="border-b py-2 hover:bg-gray-100">
                <a href={item.link} className="text-blue-600 hover:underline">{item.title}</a>
                <p className="text-sm text-gray-600">{item.timestamp} - {item.source}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Players Tab */}
      {activeTab === 'topPlayers' && (
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: teamColors.primary }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: teamColors.primary }}>Top Players (2024 Season)</h2>
          <div className="space-y-4">
            <div className="border p-4 rounded bg-gray-50 hover:shadow-md transition-shadow">
              <p className="text-gray-600">Top Passer</p>
              <p className="text-lg font-semibold">{topPlayers.topPasser.name} - {topPlayers.topPasser.yards} yards</p>
            </div>
            <div className="border p-4 rounded bg-gray-50 hover:shadow-md transition-shadow">
              <p className="text-gray-600">Top Rusher</p>
              <p className="text-lg font-semibold">{topPlayers.topRusher.name} - {topPlayers.topRusher.yards} yards</p>
            </div>
            <div className="border p-4 rounded bg-gray-50 hover:shadow-md transition-shadow">
              <p className="text-gray-600">Top Receiver</p>
              <p className="text-lg font-semibold">{topPlayers.topReceiver.name} - {topPlayers.topReceiver.yards} yards</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}