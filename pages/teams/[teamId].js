// pages/teams/[teamId].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const TeamPage = () => {
  const router = useRouter();
  const { teamId } = router.query;
  const [teamData, setTeamData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [news, setNews] = useState([]);
  const [seasonGames, setSeasonGames] = useState([]);
  const [showAllGames, setShowAllGames] = useState(false);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [rushDefense, setRushDefense] = useState(null);
  const [showRushDef, setShowRushDef] = useState(false);

  useEffect(() => {
    if (!teamId) return;
    const fetchData = async () => {
      try {
        const newsRes = await fetch(`/api/news?team=${teamId.toUpperCase()}`);
        const newsJson = await newsRes.json();
        if (newsRes.ok) setNews(newsJson.slice(0, 5));

        const rushDefRes = await fetch('/api/team-stats/rush-defense');
        const rushDefJson = await rushDefRes.json();
        if (rushDefRes.ok) setRushDefense(rushDefJson);

        const teamRes = await fetch(`/api/teams/${teamId}`);
        const teamJson = await teamRes.json();
        if (!teamRes.ok) throw new Error(teamJson.error || 'Failed to load team data');
        setTeamData(teamJson);
        setSeasonGames(teamJson.seasonGames || []);
        setUpcomingSchedule(teamJson.upcomingSchedule || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [teamId]);

  const formatStat = (num, decimals = 0) =>
    num != null && !isNaN(num) ? Number(num).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) : '—';

  const stadiumImages = {
    DAL: '/stadiums/att_stadium_DAL.jpg',
    SEA: '/stadiums/centurylink_field_SEA.jpg',
    KC: '/stadiums/chiefs_kingdom_KC.jpg',
    MIA: '/stadiums/hardrock_stadium_MIA.jpg',
    SF: '/stadiums/levis_stadium_SF.jpg',
    DEN: '/stadiums/mile_high_DEN.jpg',
    MIN: '/stadiums/usbank_stadium_MIN.jpg',
  };


  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!teamData || !teamData.team) return <div className="p-4">Loading...</div>;

  const { team, lastGame, upcomingGame, teamLogos, offenseStats, defenseStats } = teamData;
  const stadiumBg = stadiumImages[team?.team_abbr];

  return (
    <div
      className="min-h-screen p-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: stadiumBg ? `url(${stadiumBg})` : undefined,
        backgroundColor: stadiumBg ? 'rgba(255, 255, 255, 0.85)' : undefined,
        backgroundBlendMode: stadiumBg ? 'overlay' : undefined,
      }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3 mb-6">
          {/* Header */}
          {team && (
            <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-4">
                <img src={team.team_logo_espn} alt={`${team.team_name} logo`} className="w-16 h-16 rounded-full" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{team.team_name}</h1>
                  <p className="text-sm text-gray-500">{team.team_division} • Est. {team.founded_year}</p>
                  <p className="text-sm text-gray-500">Stadium: {team.stadium_name} ({team.stadium_capacity?.toLocaleString() ?? '—'} Capacity)</p>
                  <p className="text-sm text-gray-500">City: {team.city}</p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-600 space-y-1">
                <p className="font-semibold">Head Coach: {team.head_coach}</p>
                <p className="text-sm">Offensive Coord: {team.o_coord ?? '—'}</p>
                <p className="text-sm">Defensive Coord: {team.d_coord ?? '—'}</p>
              </div>
            </div>
          )}
        </div>
        <div className="md:col-span-3">
          <nav className="flex overflow-x-auto scrollbar-none space-x-4 border-b border-gray-200 pb-2 whitespace-nowrap">
            {['overview', 'depthChart', 'schedule', 'injuries', 'stats'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-blue-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        <div className="md:col-span-2 space-y-6">
          {/* Team Stats */}
          {(offenseStats || defenseStats) && (
            <div className="bg-white rounded-md shadow p-4 border border-gray-200 text-sm">
              <h2 className="text-base font-bold text-gray-700 uppercase tracking-wide mb-2 border-b pb-1">Team Stats (2024)</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-r border-b pr-4 pb-4">
                  <h3 className="font-semibold text-gray-700 mb-1">Pass Offense</h3>
                  <p>Yards: {formatStat(offenseStats?.pass_yards)}</p>
                  <p>TDs: {formatStat(offenseStats?.pass_tds)}</p>
                  <p>NFL Rank: —</p>
                </div>
                <div className="border-b pl-4 pb-4">
                  <h3 className="font-semibold text-gray-700 mb-1">Pass Defense</h3>
                  <p>Yards: {formatStat(defenseStats?.pass_yards_allowed)}</p>
                  <p>TDs: {formatStat(defenseStats?.pass_td_allowed)}</p>
                  <p>NFL Rank: —</p>
                </div>
                <div className="border-r pt-4 pr-4">
                  <h3 className="font-semibold text-gray-700 mb-1">Total Offense</h3>
                  <p>Yards: {formatStat(offenseStats?.total_off_yards)}</p>
                  <p>TDs: {formatStat((offenseStats?.pass_tds ?? 0) + (offenseStats?.rush_tds ?? 0))}</p>
                  <p>NFL Rank: —</p>
                </div>
                <div className="pt-4 pl-4">
                  <h3 className="font-semibold text-gray-700 mb-1">Total Defense</h3>
                  <p>Yards: —</p>
                  <p>TDs: —</p>
                  <p>NFL Rank: —</p>
                </div>
              </div>
            </div>
          )}

          {/* Last Game */}
          <div className="bg-white rounded-md shadow p-4 border border-gray-200 text-sm">
            <h2 className="text-base font-bold text-gray-700 uppercase tracking-wide mb-2 border-b pb-1">Last Game{showAllGames && 's'}</h2>
            <div className="flex items-center justify-between mb-2">
              {seasonGames.length > 1 && (
                <button
                  onClick={() => setShowAllGames(!showAllGames)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  {showAllGames ? 'Hide All' : 'Show All'}
                </button>
              )}
            </div>
            {seasonGames && seasonGames.length > 0 ? (
              <div className="space-y-3">
                {(showAllGames ? seasonGames : [seasonGames[0]]).map((game, idx) => (
                  <div key={idx} className="flex items-center justify-between border rounded p-2">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        {teamLogos?.[game.home_team_abbr] && (
                          <img src={teamLogos[game.home_team_abbr]} className="w-6 h-6" />
                        )}
                        <span className="text-sm font-medium">{game.home_team_abbr}</span>
                        <span className="text-sm">{game.home_score}</span>
                      </div>
                      <span className="text-xs text-gray-500">vs</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">{game.away_score}</span>
                        <span className="text-sm font-medium">{game.away_team_abbr}</span>
                        {teamLogos?.[game.away_team_abbr] && (
                          <img src={teamLogos[game.away_team_abbr]} className="w-6 h-6" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{new Date(game.game_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No recent game</p>
            )}
          </div>

          {/* Upcoming Games */}
          <div className="bg-white rounded-md shadow p-4 border border-gray-200 text-sm">
            <h2 className="text-base font-bold text-gray-700 uppercase tracking-wide mb-2 border-b pb-1">Upcoming Game{showAllUpcoming && 's'}</h2>
            <div className="flex items-center justify-between mb-2">
              {upcomingSchedule.length > 1 && (
                <button
                  onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  {showAllUpcoming ? 'Hide All' : 'Show All'}
                </button>
              )}
            </div>
            {upcomingSchedule && upcomingSchedule.length > 0 ? (
              <div className="space-y-3">
                {(showAllUpcoming ? upcomingSchedule : [upcomingSchedule[0]]).map((game, idx) => (
                  <div key={idx} className="border rounded p-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={teamLogos[game.away_team]} className="w-6 h-6" />
                        <span className="text-sm font-medium">{game.away_team_name || game.away_team}</span>
                        <span className="text-xs text-gray-500">at</span>
                        <span className="text-sm font-medium">{game.home_team_name || game.home_team}</span>
                        <img src={teamLogos[game.home_team]} className="w-6 h-6" />
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(game.gameday).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {game.stadium || 'Stadium TBD'}
                    </div>
                    {(game.spread_line != null || game.total_line != null) && (
                      <div className="text-xs text-gray-700 mt-1">
                        {game.spread_line != null && (
                          <span className="mr-4 text-red-600 font-medium">
                            Spread: {game.spread_line > 0 ? '+' : ''}{game.spread_line} 
                            <span className="ml-1 text-gray-500">({game.home_spread_odds ?? '—'} / {game.away_spread_odds ?? '—'})</span>
                          </span>
                        )}
                        {game.total_line != null && (
                          <span className="text-blue-700 font-medium">
                            O/U: {game.total_line}
                            <span className="ml-1 text-gray-500">({game.over_odds ?? '—'} / {game.under_odds ?? '—'})</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No upcoming games scheduled.</p>
            )}
          </div>
        </div>
        <div className="space-y-6">
          {/* Team Overview */}
          <div className="bg-white rounded-md shadow p-4 border border-gray-200 text-sm">
            <h2 className="text-base font-bold text-gray-700 uppercase tracking-wide mb-2 border-b pb-1">2024 Season Overview</h2>
            <div className="space-y-1">
              <p><strong>Division:</strong> {team.team_division}</p>
              <p><strong>Record:</strong> {team.record ?? '—'}</p>
              <p><strong>Points Scored:</strong> {team.points_scored ?? '—'}</p>
              <p><strong>Points Allowed:</strong> {team.points_allowed ?? '—'}</p>
            </div>
          </div>

          {/* Betting Info */}
          <div className="bg-white rounded-md shadow p-4 border border-gray-200 text-sm">
            <h2 className="text-base font-bold text-gray-700 uppercase tracking-wide mb-2 border-b pb-1">Betting Info</h2>
            {upcomingSchedule && upcomingSchedule.length > 0 ? (
              <div className="space-y-1">
                <p>
                  <strong>Spread:</strong> {upcomingSchedule[0].spread_line != null ? `${upcomingSchedule[0].spread_line > 0 ? '+' : ''}${upcomingSchedule[0].spread_line}` : '—'}
                  <span className="ml-1 text-gray-500 text-xs">({upcomingSchedule[0].home_spread_odds ?? '—'} / {upcomingSchedule[0].away_spread_odds ?? '—'})</span>
                </p>
                <p>
                  <strong>O/U:</strong> {upcomingSchedule[0].total_line ?? '—'}
                  <span className="ml-1 text-gray-500 text-xs">({upcomingSchedule[0].over_odds ?? '—'} / {upcomingSchedule[0].under_odds ?? '—'})</span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No upcoming betting data available.</p>
            )}
          </div>

          {/* News */}
          <div className="bg-white rounded-md shadow p-4 border border-gray-200 text-sm">
            <h2 className="text-base font-bold text-gray-700 uppercase tracking-wide mb-2 border-b pb-1">Latest News</h2>
            {news.length === 0 ? (
              <p className="text-sm text-gray-500">No recent news available.</p>
            ) : (
              <ul className="space-y-4">
                {news.map((article, idx) => (
                  <li key={idx} className="text-sm">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
                      {article.title}
                    </a>
                    <p className="text-gray-500 text-xs">{new Date(article.publishedAt).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
