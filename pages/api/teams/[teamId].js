// pages/api/teams/[teamId].js (temporary for testing)
export default async function handler(req, res) {
  const { teamId } = req.query;

  try {
    if (teamId === 'KC') {
      return res.status(200).json({
        team: {
          team_name: 'Kansas City Chiefs',
          division: 'AFC West',
          logo_url: 'https://github.com/nflverse/nflverse-pbp/raw/master/squared_logos/KC.png',
        },
        seasonStats: {
          wins: 17,
          losses: 3,
          points_scored: 462,
          points_allowed: 373,
        },
        lastGame: {
          game_date: '2025-02-09',
          game_time: '00:00:00',
          home_team_id: 'PHI',
          away_team_id: 'KC',
          home_score: 40,
          away_score: 22,
        },
        upcomingGame: null,
        depthChart: [],
        detailedStats: { total_passing_yards: 0, total_rushing_yards: 0, total_receiving_yards: 0 },
        injuries: [],
        schedule: [],
      });
    }
    return res.status(404).json({ error: 'Team not found' });
  } catch (error) {
    console.error('Error in /api/teams/[teamId]:', error.message);
    return res.status(500).json({ error: error.message || 'Failed to fetch team data' });
  }
}
