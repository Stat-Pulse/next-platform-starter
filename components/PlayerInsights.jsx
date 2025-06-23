import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Chart from 'chart.js/auto';
import { FaChartLine, FaFootballBall, FaShieldAlt } from 'react-icons/fa'; // For section icons

// Mock data (replace with API call in production)
const mockPlayerData = {
  player_id: '1',
  player_name: 'Dak Prescott',
  position: 'QB',
  team_abbr: 'DAL',
  jersey_number: 4,
  recent_games: [
    { week: 1, passing_yards: 300, passing_tds: 2, fantasy_points: 22.5 },
    { week: 2, passing_yards: 250, passing_tds: 1, fantasy_points: 18.0 },
    { week: 3, passing_yards: 320, passing_tds: 3, fantasy_points: 28.0 },
    { week: 4, passing_yards: 280, passing_tds: 2, fantasy_points: 24.5 },
    { week: 5, passing_yards: 200, passing_tds: 1, fantasy_points: 15.5 },
  ],
  season_stats: { passing_yards: 1350, passing_tds: 9, fantasy_points: 108.5 },
  upcoming_game: { opponent: 'PHI', location: 'away', time: '2025-06-28 13:00' },
  bye_week: 7,
  injury_status: 'Questionable - Ankle',
  ats_performance: { team_ats: '8-4', favorite: '5-2', underdog: '3-2', home: '4-2', away: '4-2' },
  ou_performance: { team_ou: '7-5', favorite: '4-3', underdog: '3-2', home: '4-2', away: '3-3' },
  prop_performance: { pass_yards_over: '6-4', td_over: '5-5', anytime_td: '3-2' },
  matchup_analysis: {
    def_strengths: 'Strong vs. RBs, Weak vs. QBs',
    historical_vs_opponent: 'Avg 280 yards, 2 TDs vs. PHI',
    game_script: 'Favored, likely pass-heavy',
    weather: 'Clear, 75°F',
    implied_total: 27.5,
  },
  fantasy_trends: { weekly_points: [22.5, 18.0, 28.0, 24.5, 15.5], consistency: 4.2, home_points: 23.0, away_points: 19.5 },
  matchup_fantasy: {
    def_rank_vs_pos: 15,
    target_share: 0.28,
    snap_share: 0.95,
    red_zone_targets: 8,
    air_yards: 1200,
  },
  efficiency_metrics: { ypa: 7.5, ypr: 12.0, td_rate: 0.05 },
  rest_of_season: 'Projected to improve with ankle recovery',
  fantasy_news: 'Ranked #3 QB by experts, expected to start vs. PHI',
  proprietary_metrics: {
    clutch_score: 85,
    matchup_advantage: 72,
    opportunity_index: 90,
  },
};

const PlayerInsights = ({ playerId }) => {
  const [playerData, setPlayerData] = useState(mockPlayerData);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'betting', 'fantasy'
  const chartRefs = useRef([]);

  // Mock API call (replace with real fetch)
  useEffect(() => {
    // Simulate API call
    setPlayerData(mockPlayerData);
  }, [playerId]);

  // Initialize charts
  useEffect(() => {
    if (chartRefs.current.length) {
      chartRefs.current.forEach((chart, index) => {
        if (chart) {
          new Chart(chart.getContext('2d'), {
            type: index === 0 ? 'line' : 'scatter',
            data: {
              labels: playerData.recent_games.map((g) => `Week ${g.week}`),
              datasets: [
                {
                  label: index === 0 ? 'Fantasy Points' : 'Efficiency (Yards vs. TDs)',
                  data: index === 0
                    ? playerData.recent_games.map((g) => g.fantasy_points)
                    : playerData.recent_games.map((g, i) => ({ x: g.passing_yards, y: g.passing_tds })),
                  borderColor: '#00eaff',
                  backgroundColor: 'rgba(0, 234, 255, 0.2)',
                  pointBackgroundColor: '#ffd700',
                  fill: index === 0,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: { legend: { labels: { color: '#ffd700' } }, tooltip: { mode: 'index' } },
              scales: { y: { beginAtZero: true, title: { color: '#00eaff' } } },
            },
          });
        }
      });
    }
  }, [playerData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-cyan-900 p-6 text-gray-100 font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto"
      >
        <h1 className="text-4xl font-extrabold text-cyan-300 mb-6 flex items-center">
          <FaChartLine className="mr-2" /> {playerData.player_name} Insights
        </h1>

        {/* View Mode Toggle */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'all' ? 'bg-cyan-700' : 'bg-purple-800'} text-white`}
          >
            All
          </button>
          <button
            onClick={() => setViewMode('betting')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'betting' ? 'bg-cyan-700' : 'bg-purple-800'} text-white`}
          >
            Betting
          </button>
          <button
            onClick={() => setViewMode('fantasy')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'fantasy' ? 'bg-cyan-700' : 'bg-purple-800'} text-white`}
          >
            Fantasy
          </button>
        </div>

        {/* Core Information */}
        <motion.section
          className="bg-gray-800/70 p-6 rounded-lg shadow-lg border border-cyan-500 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center"><FaFootballBall className="mr-2" /> Core Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Name:</strong> {playerData.player_name}</p>
            <p><strong>Position:</strong> {playerData.position}</p>
            <p><strong>Team:</strong> {playerData.team_abbr}</p>
            <p><strong>Jersey #:</strong> {playerData.jersey_number}</p>
            <p><strong>Recent Games:</strong> {playerData.recent_games.map((g) => `${g.week}: ${g.passing_yards} yds`).join(', ')}</p>
            <p><strong>Season Stats:</strong> {playerData.season_stats.passing_yards} yds, {playerData.season_stats.passing_tds} TDs</p>
            <p><strong>Upcoming Game:</strong> {playerData.upcoming_game.opponent} ({playerData.upcoming_game.location}) at {playerData.upcoming_game.time}</p>
            <p><strong>Bye Week:</strong> Week {playerData.bye_week}</p>
            <p><strong>Injury Status:</strong> {playerData.injury_status}</p>
          </div>
        </motion.section>

        {/* Betting Insights */}
        {viewMode !== 'fantasy' && (
          <motion.section
            className="bg-gray-800/70 p-6 rounded-lg shadow-lg border border-cyan-500 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center"><FaShieldAlt className="mr-2" /> Betting Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gold-300">ATS Performance</h3>
                <p>Team ATS: {playerData.ats_performance.team_ats}</p>
                <p>As Favorite: {playerData.ats_performance.favorite}</p>
                <p>As Underdog: {playerData.ats_performance.underdog}</p>
                <p>Home: {playerData.ats_performance.home}</p>
                <p>Away: {playerData.ats_performance.away}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gold-300">O/U Performance</h3>
                <p>Team O/U: {playerData.ou_performance.team_ou}</p>
                <p>As Favorite: {playerData.ou_performance.favorite}</p>
                <p>As Underdog: {playerData.ou_performance.underdog}</p>
                <p>Home: {playerData.ou_performance.home}</p>
                <p>Away: {playerData.ou_performance.away}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gold-300">Player Props</h3>
                <p>Pass Yards Over: {playerData.prop_performance.pass_yards_over}</p>
                <p>TD Over: {playerData.prop_performance.td_over}</p>
                <p>Anytime TD: {playerData.prop_performance.anytime_td}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gold-300">Matchup Analysis</h3>
                <p>Def Strengths: {playerData.matchup_analysis.def_strengths}</p>
                <p>Vs Opponent: {playerData.matchup_analysis.historical_vs_opponent}</p>
                <p>Game Script: {playerData.matchup_analysis.game_script}</p>
                <p>Weather: {playerData.matchup_analysis.weather}</p>
                <p>Implied Total: {playerData.matchup_analysis.implied_total}</p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Fantasy Insights */}
        {viewMode !== 'betting' && (
          <motion.section
            className="bg-gray-800/70 p-6 rounded-lg shadow-lg border border-cyan-500 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center"><FaFootballBall className="mr-2" /> Fantasy Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gold-300">Fantasy Trends</h3>
                <canvas ref={(ref) => (chartRefs.current[0] = ref)} className="w-full h-40" />
                <p>Consistency: {playerData.fantasy_trends.consistency}</p>
                <p>Home: {playerData.fantasy_trends.home_points}</p>
                <p>Away: {playerData.fantasy_trends.away_points}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gold-300">Matchup Analysis</h3>
                <p>Def Rank vs Pos: {playerData.matchup_fantasy.def_rank_vs_pos}</p>
                <p>Target Share: {playerData.matchup_fantasy.target_share}</p>
                <p>Snap Share: {playerData.matchup_fantasy.snap_share}</p>
                <p>Red Zone Targets: {playerData.matchup_fantasy.red_zone_targets}</p>
                <p>Air Yards: {playerData.matchup_fantasy.air_yards}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gold-300">Efficiency Metrics</h3>
                <canvas ref={(ref) => (chartRefs.current[1] = ref)} className="w-full h-40" />
                <p>Yards/Attempt: {playerData.efficiency_metrics.ypa}</p>
                <p>Yards/Reception: {playerData.efficiency_metrics.ypr}</p>
                <p>TD Rate: {playerData.efficiency_metrics.td_rate}</p>
              </div>
              <div>
                <p><strong>Outlook:</strong> {playerData.rest_of_season}</p>
                <p><strong>News:</strong> {playerData.fantasy_news}</p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Advanced Insights */}
        {(viewMode === 'all' || viewMode === 'betting' || viewMode === 'fantasy') && (
          <motion.section
            className="bg-gray-800/70 p-6 rounded-lg shadow-lg border border-cyan-500 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center"><FaChartLine className="mr-2" /> Advanced Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gold-300">Proprietary Metrics</h3>
                <p>Clutch Score: {playerData.proprietary_metrics.clutch_score}</p>
                <p>Matchup Advantage: {playerData.proprietary_metrics.matchup_advantage}</p>
                <p>Opportunity Index: {playerData.proprietary_metrics.opportunity_index}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gold-300">Analyst Corner</h3>
                <p>Dak’s ankle recovery boosts his outlook; bet on passing props vs. PHI’s weak secondary.</p>
              </div>
            </div>
          </motion.section>
        )}
      </motion.div>
    </div>
  );
};

export default PlayerInsights;