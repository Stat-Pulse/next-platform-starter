import mysql from 'mysql2/promise';
import teams from '../../../data/teams';

export default async function handler(req, res) {
  const { team } = req.query;
  console.log("🔥 API HIT: Team slug:", team);

  // Validate team slug
  if (!team || typeof team !== 'string') {
    console.log("❌ Invalid team param:", team);
    return res.status(400).json({ error: 'Missing or invalid team slug' });
  }

  // Check team metadata
  const teamMeta = teams.find(t => t.slug === team.toLowerCase());
  if (!teamMeta) {
    console.log("❌ Team slug not found in teams.js:", team);
    return res.status(404).json({ error: 'Team slug not found' });
  }

  // Map slug to abbreviation
  const slugToAbbreviation = {
    bills: 'BUF', dolphins: 'MIA', patriots: 'NE', jets: 'NYJ',
    ravens: 'BAL', bengals: 'CIN', browns: 'CLE', steelers: 'PIT',
    texans: 'HOU', colts: 'IND', jaguars: 'JAX', titans: 'TEN',
    broncos: 'DEN', chiefs: 'KC', raiders: 'LV', chargers: 'LAC',
    cowboys: 'DAL', giants: 'NYG', eagles: 'PHI', commanders: 'WSH',
    bears: 'CHI', lions: 'DET', packers: 'GB', vikings: 'MIN',
    falcons: 'ATL', panthers: 'CAR', saints: 'NO', buccaneers: 'TB',
    cardinals: 'ARI', rams: 'LAR', '49ers': 'SF', seahawks: 'SEA'
  };

  const teamId = slugToAbbreviation[team.toLowerCase()];
  if (!teamId) {
    console.log("❌ No abbreviation found for slug:", team);
    return res.status(404).json({ error: 'Team ID could not be resolved' });
  }

  console.log("✅ Resolved teamId:", teamId);

  let connection;
  try {
    // Connect to MySQL (use nfl_analytics if renamed, otherwise stat_pulse_analytics_db)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'stat-pulse-analytics-db.ci1uue2w2sxp.us-east-1.rds.amazonaws.com',
      user: process.env.DB_USER || 'StatadminPULS3',
      password: process.env.DB_PASSWORD, // Ensure this is set in environment
      database: process.env.DB_NAME || 'nfl_analytics' // Adjust to nfl_analytics if renamed
    });

    // Fetch team details
    const [teamRows] = await connection.execute(
      `SELECT t.team_name, t.team_abbr, t.division, t.conference,
              COALESCE(b.team_color, '#000000') AS team_color,
              COALESCE(b.team_color2, '#FFFFFF') AS team_color2,
              COALESCE(b.team_logo_espn, b.team_logo_wikipedia, '') AS team_logo
       FROM Teams t
       LEFT JOIN Teams_2024 b ON t.team_id = b.team_abbr
       WHERE t.team_id = ?`,
      [teamId]
    );

    if (!teamRows.length) {
      console.log("❌ Team not found in database:", teamId);
      await connection.end();
      return res.status(404).json({ error: 'Team not found in database' });
    }

    const teamRow = teamRows[0];

    // Fetch roster
    const [roster] = await connection.execute(
      `SELECT gsis_id AS id, full_name AS name, position, COALESCE(headshot_url, '') AS headshot_url, years_exp
       FROM Rosters_2024
       WHERE team = ? AND week = (
         SELECT MAX(week) FROM Rosters_2024 WHERE team = ?
       )`,
      [teamId, teamId]
    );

    // Fetch depth chart
    const [depthRows] = await connection.execute(
      `SELECT position, full_name, depth_team
       FROM Depth_Charts_2024
       WHERE club_code = ? AND week = (
         SELECT MAX(week) FROM Depth_Charts_2024 WHERE club_code = ?
       )
       ORDER BY depth_team ASC`,
      [teamId, teamId]
    );

    const depthChart = {};
    for (const row of depthRows) {
      if (!depthChart[row.position]) depthChart[row.position] = [];
      depthChart[row.position].push({ name: row.full_name, depth: row.depth_team });
    }

    // Fetch schedule
    const [schedule] = await connection.execute(
      `SELECT game_id, week, game_date AS date,
              home_team_id, away_team_id, home_score, away_score, is_final
       FROM Games
       WHERE home_team_id = ? OR away_team_id = ?
       ORDER BY game_date ASC`,
      [teamId, teamId]
    );

    const formattedGames = schedule.map(g => {
      const isHome = g.home_team_id === teamId;
      const opponent = isHome ? g.away_team_id : g.home_team_id;
      const score = g.is_final ? `${g.home_score} - ${g.away_score}` : 'TBD';
      let result = '';
      if (g.is_final) {
        if (g.home_score === g.away_score) {
          result = 'T'; // Handle ties
        } else if ((isHome && g.home_score > g.away_score) || (!isHome && g.away_score > g.home_score)) {
          result = 'W';
        } else {
          result = 'L';
        }
      }
      return {
        gameId: g.game_id,
        week: g.week,
        date: new Date(g.date).toISOString(),
        opponent: opponent || 'Unknown', // Fallback for invalid opponent
        homeAway: isHome ? 'H' : 'A',
        score,
        result
      };
    });

    // Fetch stats
    const [statsRows] = await connection.execute(
      `SELECT games_played, points_allowed, total_yards_allowed, pass_yards_allowed,
              rush_yards_allowed, turnovers, interceptions, sacks, red_zone_pct,
              third_down_pct, epa_per_play_allowed, dvoa_rank
       FROM Team_Defense_Stats_2024
       WHERE team_id = ?`,
      [teamId]
    );

    const stats = statsRows[0] || {
      gamesPlayed: 0, pointsAllowed: 0, totalYardsAllowed: 0, passYardsAllowed: 0,
      rushYardsAllowed: 0, turnovers: 0, interceptions: 0, sacks: 0, redZonePct: 0,
      thirdDownPct: 0, epaPerPlayAllowed: 0, dvoaRank: null
    };

    await connection.end();

    // Build response
    const response = {
      id: teamId,
      name: teamRow.team_name || teamMeta.name,
      abbreviation: teamRow.team_abbr || teamId,
      division: teamRow.division || teamMeta.division,
      conference: teamRow.conference || teamMeta.conference,
      branding: {
        colorPrimary: teamRow.team_color,
        colorSecondary: teamRow.team_color2,
        logo: teamRow.team_logo
      },
      roster: roster.map(player => ({
        id: player.id,
        name: player.name,
        position: player.position,
        headshot_url: player.headshot_url || null,
        years_exp: player.years_exp
      })),
      depthChart,
      schedule: formattedGames,
      stats: {
        gamesPlayed: stats.games_played,
        pointsAllowed: stats.points_allowed,
        totalYardsAllowed: stats.total_yards_allowed,
        passYardsAllowed: stats.pass_yards_allowed,
        rushYardsAllowed: stats.rush_yards_allowed,
        turnovers: stats.turnovers,
        interceptions: stats.interceptions,
        sacks: stats.sacks,
        redZonePct: stats.red_zone_pct,
        thirdDownPct: stats.third_down_pct,
        epaPerPlayAllowed: stats.epa_per_play_allowed,
        dvoaRank: stats.dvoa_rank
      },
      recentNews: [
        {
          title: `${teamRow.team_name || teamMeta.name} preparing for upcoming matchup`,
          date: new Date().toISOString().split('T')[0]
        }
      ]
    };

    console.log("✅ API response prepared for team:", teamId);
    return res.status(200).json(response);

  } catch (err) {
    console.error('❌ API error:', {
      message: err.message,
      stack: err.stack,
      teamId
    });
    if (connection) await connection.end();
    return res.status(500).json({
      error: 'Internal server error',
      details: err.message
    });
  }
}
