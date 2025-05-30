import mysql from 'mysql2/promise';

export async function GET(request, { params }) {
  const { teamId } = params;
  const teamIdLower = teamId.toLowerCase(); // e.g., 'chiefs'

  // Database connection
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  try {
    // Fetch team data by nickname (case-insensitive)
    const [teamRows] = await connection.execute(
      `SELECT team_abbr, team_name, team_division AS division, team_conf AS conference, team_logo_espn AS logo_url, 
              primary_color, secondary_color, tertiary_color, quaternary_color, nickname, 
              city, stadium_name, head_coach, founded_year
       FROM Teams
       WHERE LOWER(nickname) = ?`,
      [teamIdLower]
    );

    if (!teamRows.length) {
      return new Response(JSON.stringify({ error: 'Team not found' }), { status: 404 });
    }

    const team = {
      ...teamRows[0],
      primary_color: teamRows[0].primary_color || '#1D2526', // Fallback
      secondary_color: teamRows[0].secondary_color || '#A5ACAF',
      city: teamRows[0].city || 'Unknown',
      nickname: teamRows[0].nickname || teamRows[0].team_name.split(' ').pop(), // Fallback to last word of team_name
      stadium_name: teamRows[0].stadium_name || 'N/A',
      head_coach: teamRows[0].head_coach || 'N/A',
      founded_year: teamRows[0].founded_year || null,
    };
    const teamAbbr = team.team_abbr;

    // Season stats
    const [statsRows] = await connection.execute(
      `SELECT 
         (SELECT COUNT(*) FROM Games WHERE (home_team_id = ? AND winning_team_id = ?) OR (away_team_id = ? AND winning_team_id = ?) AND season_type = 'REG' AND season_id = 2024) AS wins,
         (SELECT COUNT(*) FROM Games WHERE (home_team_id = ? AND losing_team_id = ?) OR (away_team_id = ? AND losing_team_id = ?) AND season_type = 'REG' AND season_id = 2024) AS losses,
         (SELECT SUM(CASE WHEN home_team_id = ? THEN home_score WHEN away_team_id = ? THEN away_score ELSE 0 END) FROM Games WHERE (home_team_id = ? OR away_team_id = ?) AND season_type = 'REG' AND season_id = 2024) AS points_scored,
         (SELECT SUM(CASE WHEN home_team_id = ? THEN away_score WHEN away_team_id = ? THEN home_score ELSE 0 END) FROM Games WHERE (home_team_id = ? OR away_team_id = ?) AND season_type = 'REG' AND season_id = 2024) AS points_allowed
       `,
      [teamAbbr, teamAbbr, teamAbbr, teamAbbr, teamAbbr, teamAbbr, teamAbbr, teamAbbr, teamAbbr, teamAbbr, teamAbbr, teamAbbr, teamAbbr, teamAbbr, teamAbbr, teamAbbr]
    );

    const seasonStats = statsRows[0] || { wins: 0, losses: 0, points_scored: 0, points_allowed: 0 };

    // Last game (with opponent logos)
    const [lastGameRows] = await connection.execute(
      `SELECT g.game_id, g.game_date, g.game_time, g.home_team_id, g.away_team_id, g.home_score, g.away_score, t1.team_logo_espn AS home_team_logo, t2.team_logo_espn AS away_team_logo
       FROM Games g
       LEFT JOIN Teams t1 ON g.home_team_id = t1.team_abbr
       LEFT JOIN Teams t2 ON g.away_team_id = t2.team_abbr
       WHERE (g.home_team_id = ? OR g.away_team_id = ?) AND g.is_final = 1
       ORDER BY g.game_date DESC, g.game_time DESC LIMIT 1`,
      [teamAbbr, teamAbbr]
    );

    const lastGame = lastGameRows[0] || null;

    // Upcoming game (with opponent logos)
    const [upcomingGameRows] = await connection.execute(
      `SELECT g.game_date, g.game_time, g.home_team_id, g.away_team_id, g.stadium_name, t1.team_logo_espn AS home_team_logo, t2.team_logo_espn AS away_team_logo
       FROM Games g
       LEFT JOIN Teams t1 ON g.home_team_id = t1.team_abbr
       LEFT JOIN Teams t2 ON g.away_team_id = t2.team_abbr
       WHERE (g.home_team_id = ? OR g.away_team_id = ?) AND g.is_final = 0
       ORDER BY g.game_date ASC LIMIT 1`,
      [teamAbbr, teamAbbr]
    );

    const upcomingGame = upcomingGameRows[0] || null;

    // News
    let newsItems = [
      { title: 'News 1', link: '#', timestamp: '1 hour ago', source: 'ESPN' },
      { title: 'News 2', link: '#', timestamp: '2 hours ago', source: 'NFL.com' },
    ];
    try {
      const [newsRows] = await connection.execute(
        `SELECT title, link, timestamp, source FROM News WHERE team_abbr = ? ORDER BY timestamp DESC LIMIT 5`,
        [teamAbbr]
      );
      if (newsRows.length) newsItems = newsRows;
    } catch (error) {
      console.log('News query failed:', error.message);
    }

    // Top players (using Player_Stats_Game_All)
    let topPlayers = { topPasser: { name: 'N/A', yards: 0 }, topRusher: { name: 'N/A', yards: 0 }, topReceiver: { name: 'N/A', yards: 0 } };
    try {
      const [topPlayersRows] = await connection.execute(
        `SELECT 
           (SELECT player_id FROM Player_Stats_Game_All WHERE team_abbr = ? AND season = 2024 ORDER BY passing_yards DESC LIMIT 1) AS top_passer,
           (SELECT passing_yards FROM Player_Stats_Game_All WHERE team_abbr = ? AND season = 2024 ORDER BY passing_yards DESC LIMIT 1) AS top_passing_yards,
           (SELECT player_id FROM Player_Stats_Game_All WHERE team_abbr = ? AND season = 2024 ORDER BY rushing_yards DESC LIMIT 1) AS top_rusher,
           (SELECT rushing_yards FROM Player_Stats_Game_All WHERE team_abbr = ? AND season = 2024 ORDER BY rushing_yards DESC LIMIT 1) AS top_rushing_yards,
           (SELECT player_id FROM Player_Stats_Game_All WHERE team_abbr = ? AND season = 2024 ORDER BY receiving_yards DESC LIMIT 1) AS top_receiver,
           (SELECT receiving_yards FROM Player_Stats_Game_All WHERE team_abbr = ? AND season = 2024 ORDER BY receiving_yards DESC LIMIT 1) AS top_receiving_yards
         `,
        [teamAbbr, teamAbbr, teamAbbr, teamAbbr, teamAbbr, teamAbbr]
      );

      topPlayers = {
        topPasser: { name: 'N/A', yards: topPlayersRows[0].top_passing_yards || 0 },
        topRusher: { name: 'N/A', yards: topPlayersRows[0].top_rushing_yards || 0 },
        topReceiver: { name: 'N/A', yards: topPlayersRows[0].top_receiving_yards || 0 },
      };

      if (topPlayersRows[0].top_passer) {
        const [playerRows] = await connection.execute(
          `SELECT player_name FROM Players WHERE player_id = ?`,
          [topPlayersRows[0].top_passer]
        );
        topPlayers.topPasser.name = playerRows[0]?.player_name || 'N/A';
      }
      if (topPlayersRows[0].top_rusher) {
        const [playerRows] = await connection.execute(
          `SELECT player_name FROM Players WHERE player_id = ?`,
          [topPlayersRows[0].top_rusher]
        );
        topPlayers.topRusher.name = playerRows[0]?.player_name || 'N/A';
      }
      if (topPlayersRows[0].top_receiver) {
        const [playerRows] = await connection.execute(
          `SELECT player_name FROM Players WHERE player_id = ?`,
          [topPlayersRows[0].top_receiver]
        );
        topPlayers.topReceiver.name = playerRows[0]?.player_name || 'N/A';
      }
    } catch (error) {
      console.log('Top players query failed:', error.message);
    }

    // Placeholders for other data
    const depthChart = [];
    const detailedStats = {};
    const injuries = [];
    const schedule = [];
    const teamGrades = { overall: 'N/A', offense: 'N/A', defense: 'N/A', special_teams: 'N/A' };

    return new Response(
      JSON.stringify({
        team,
        seasonStats,
        lastGame,
        upcomingGame,
        depthChart,
        detailedStats,
        injuries,
        schedule,
        teamGrades,
        news: newsItems,
        topPlayers,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to fetch team data', details: error.message }), { status: 500 });
  } finally {
    await connection.end();
  }
}
