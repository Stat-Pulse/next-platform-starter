// pages/api/team/[team].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const { team } = req.query;
  if (!team || typeof team !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid team ID' });
  }

  let connection;
  let teamId;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Resolve team abbreviation from nickname or full team name
    const [abbrRows] = await connection.execute(
      `SELECT team_abbr FROM Teams WHERE LOWER(nickname) = ? OR LOWER(team_name) LIKE ?`,
      [team.toLowerCase(), `%${team.toLowerCase()}%`]
    );

    if (!abbrRows.length) {
      await connection.end();
      return res.status(404).json({ error: 'Team slug could not be resolved' });
    }

    teamId = abbrRows[0].team_abbr;

    // Fetch core team information
    const [teamRows] = await connection.execute(
      `SELECT
        team_name,
        team_abbr,
        nickname,
        team_conf,
        team_division,
        primary_color,
        secondary_color,
        tertiary_color,
        quaternary_color,
        team_logo_espn,
        team_logo_wikipedia,
        team_wordmark,
        city,
        stadium_name,
        head_coach,
        founded_year,
        o_coord,
        d_coord,
        stadium_capacity,
        team_id
       FROM Teams
       WHERE team_abbr = ?`,
      [teamId]
    );
    if (!teamRows.length) {
      await connection.end();
      return res.status(404).json({ error: 'Team not found' });
    }
    const teamRow = teamRows[0];
    const fullTeamId = teamRow.team_id || teamId; // Use team_id if available, otherwise team_abbr

    // Fetch roster (2025 season)
    const [roster] = await connection.execute(
      `SELECT
         gsis_id        AS id,
         full_name      AS name,
         position,
         jersey_number  AS number,
         rookie_year,
         headshot_url
       FROM Rosters_2025
       WHERE team   = ?
         AND season = 2025`,
      [teamId]
    );

    // Fetch depth chart (2025 season, latest week)
    const [depthRows] = await connection.execute(
      `SELECT
         dc.position,
         r.full_name AS name,
         dc.depth_rank
       FROM Depth_Charts dc
       JOIN Rosters_2025 r
         ON r.gsis_id COLLATE utf8mb4_unicode_ci = dc.player_id
        AND r.season  = 2025
       WHERE dc.team   = ?
         AND dc.season = 2025
         AND dc.week   = (
           SELECT MAX(week)
             FROM Depth_Charts
            WHERE team   = ?
              AND season = 2025
         )
       ORDER BY dc.depth_rank ASC`,
      [teamId, teamId]
    );

    const depthChart = {};
    for (const row of depthRows) {
      if (!depthChart[row.position]) depthChart[row.position] = [];
      depthChart[row.position].push({ name: row.name, depth: row.depth_rank });
    }

    // Fetch past season games (all games where the team played)
    const [seasonGamesRaw] = await connection.execute(
      `SELECT game_id, week, game_date AS date, game_time,
              home_team_id, away_team_id, home_score, away_score, is_final,
              stadium_name, spread_line, total_line, referee, weather_summary
       FROM Games
       WHERE home_team_id = ? OR away_team_id = ?
       ORDER BY game_date DESC`, // Order by descending to get most recent first
      [teamId, teamId]
    );

    const formattedSeasonGames = seasonGamesRaw.map(g => ({
      gameId: g.game_id,
      week: g.week,
      game_date: g.date, // Use game_date for consistency with upcomingSchedule
      home_team_abbr: g.home_team_id,
      away_team_abbr: g.away_team_id,
      home_score: g.home_score,
      away_score: g.away_score,
      is_final: g.is_final,
    }));

    // Fetch upcoming schedule for 2025 season
    const [upcomingSchedule] = await connection.execute(
      `SELECT game_id,
              gameday,
              weekday,
              week,
              gametime,
              home_team AS home_team_abbr, -- Renamed for consistency
              away_team AS away_team_abbr, -- Renamed for consistency
              location,
              stadium,
              spread_line,
              total_line,
              home_spread_odds,
              away_spread_odds,
              over_odds,
              under_odds
         FROM Schedules_2025
        WHERE (home_team = ? OR away_team = ?)
          AND gameday >= CURDATE()
        ORDER BY gameday ASC`,
      [teamId, teamId]
    );

    /* -------------------------------------------------- *
     * Fetch Season Stats (assuming tables exist)        *
     * These are hypothetical tables for demonstration.  *
     * You might need to adjust table/column names.      *
     * -------------------------------------------------- */
    let offenseStats = null;
    let defenseStats = null;

    try {
      const [offenseStatsRows] = await connection.execute(
        `SELECT
           total_off_yards,
           pass_tds,
           rush_tds,
           passing_yards AS pass_yards,  -- Added for 'Pass Offense'
           rushing_yards AS rush_yards   -- Added for 'Rush Offense'
         FROM Team_Offense_Season_Stats_2024 -- Placeholder table name
         WHERE team_abbr = ? AND season = 2024`,
        [teamId]
      );
      offenseStats = offenseStatsRows.length ? offenseStatsRows[0] : null;

      const [defenseStatsRows] = await connection.execute(
        `SELECT
           pass_yards_allowed,
           pass_td_allowed,
           rush_yards_allowed,
           rush_td_allowed,
           total_defense_yards_allowed, -- Added for 'Total Defense'
           total_defense_td_allowed     -- Added for 'Total Defense'
         FROM Team_Defense_Season_Stats_2024 -- Placeholder table name
         WHERE team_abbr = ? AND season = 2024`,
        [teamId]
      );
      defenseStats = defenseStatsRows.length ? defenseStatsRows[0] : null;
    } catch (statErr) {
      console.warn(`Could not fetch season stats for ${teamId}. Tables might not exist:`, statErr.message);
      // Stats will remain null if tables don't exist
    }


    // Build logo map for all referenced teams (current team, opponents in past/upcoming games)
    const teamSet = new Set([teamId]);
    upcomingSchedule.forEach(r => {
      if (r.home_team_abbr) teamSet.add(r.home_team_abbr);
      if (r.away_team_abbr) teamSet.add(r.away_team_abbr);
    });
    formattedSeasonGames.forEach(g => {
      if (g.home_team_abbr) teamSet.add(g.home_team_abbr);
      if (g.away_team_abbr) teamSet.add(g.away_team_abbr);
    });

    const [logoRows] = await connection.execute(
      `SELECT team_abbr, team_logo_espn FROM Teams WHERE team_abbr IN (?)`,
      [Array.from(teamSet)]
    );
    const teamLogos = {};
    logoRows.forEach(r => {
      // Ensure logos are absolute URLs
      const src = r.team_logo_espn || '';
      teamLogos[r.team_abbr] = src.startsWith('http')
        ? src
        : `https://a.espncdn.com/i/teamlogos/nfl/500/${r.team_abbr.toLowerCase()}.png`;
    });

    // Ensure the primary team logo is an absolute URL
    if (teamRow.team_logo_espn && !teamRow.team_logo_espn.startsWith('http')) {
      teamRow.team_logo_espn = `https://a.espncdn.com/i/teamlogos/nfl/500/${teamId.toLowerCase()}.png`;
    }
    // Ensure the alt logo is an absolute URL
    if (teamRow.team_logo_wikipedia && !teamRow.team_logo_wikipedia.startsWith('http')) {
      teamRow.team_logo_wikipedia = `https://a.espncdn.com/i/teamlogos/nfl/500/${teamId.toLowerCase()}.png`;
    }

    await connection.end();

    return res.status(200).json({
      id: fullTeamId,
      name: teamRow.team_name,
      abbreviation: teamRow.team_abbr,
      nickname: teamRow.nickname,
      division: teamRow.team_division,
      conference: teamRow.team_conf,
      branding: {
        colorPrimary: teamRow.primary_color,
        colorSecondary: teamRow.secondary_color,
        colorTertiary: teamRow.tertiary_color,
        colorQuaternary: teamRow.quaternary_color,
        logo: teamRow.team_logo_espn || teamRow.team_logo_wikipedia,
        logoAlt: teamRow.team_logo_wikipedia,
        wordmark: teamRow.team_wordmark,
      },
      location: {
        city: teamRow.city,
        stadium: teamRow.stadium_name,
        capacity: teamRow.stadium_capacity, // Corrected to use 'capacity'
        foundedYear: teamRow.founded_year,
      },
      coaching: {
        headCoach: teamRow.head_coach,
        offensiveCoordinator: teamRow.o_coord,
        defensiveCoordinator: teamRow.d_coord
      },
      teamLogos,
      seasonGames: formattedSeasonGames,
      upcomingSchedule: upcomingSchedule,
      roster: roster || [], // Roster and Depth Chart are not used in frontend provided
      depthChart: Object.keys(depthChart).length ? depthChart : {},
      // Example news, frontend fetches its own
      recentNews: [], // Frontend will fetch from /api/news
      offenseStats: offenseStats, // Added offenseStats
      defenseStats: defenseStats, // Added defenseStats
      lastUpdated: new Date().toISOString()
    });

  } catch (err) {
    console.error('❌ API error:', err);
    if (connection) await connection.end();
    return res.status(500).json({ error: 'Internal server error' });
  }
}
