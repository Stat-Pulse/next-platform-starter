// pages/api/team/[team].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const { team } = req.query;
  if (!team || typeof team !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid team ID' });
  }

  let connection;
  const currentSeason = 2024; // Explicitly define the season for stats aggregation

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Prioritize matching the incoming 'team' slug to an official team_abbr
    const [abbrRows] = await connection.execute(
      `SELECT team_abbr FROM Teams
       WHERE LOWER(team_abbr) = ?
          OR LOWER(nickname) = ?
          OR LOWER(team_name) = ?
       ORDER BY
           CASE
               WHEN LOWER(team_abbr) = ? THEN 1
               WHEN LOWER(nickname) = ? THEN 2
               WHEN LOWER(team_name) = ? THEN 3
               ELSE 4
           END
       LIMIT 1`,
      [team.toLowerCase(), team.toLowerCase(), team.toLowerCase(),
       team.toLowerCase(), team.toLowerCase(), team.toLowerCase()]
    );

    if (!abbrRows.length) {
      await connection.end();
      return res.status(404).json({ error: 'Team slug could not be resolved' });
    }

    const teamId = abbrRows[0].team_abbr; // This is the resolved, canonical team_abbr

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
      return res.status(404).json({ error: 'Team not found after resolution' });
    }
    const teamRow = teamRows[0];
    const fullTeamId = teamRow.team_id || teamId;

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

    // Fetch past season games.
    const [seasonGamesRaw] = await connection.execute(
      `SELECT game_id, week, game_date AS date, game_time,
              home_team_id, away_team_id, home_score, away_score, is_final,
              stadium_name, spread_line, total_line, referee, weather_summary
       FROM Games
       WHERE home_team_id = ? OR away_team_id = ?
       ORDER BY game_date ASC`,
      [teamId, teamId]
    );

    const formattedSeasonGames = seasonGamesRaw.map(g => ({
      gameId: g.game_id,
      week: g.week,
      game_date: g.date,
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
              home_team AS home_team_abbr,
              away_team AS away_team_abbr,
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
        ORDER BY gameday ASC, gametime ASC`,
      [teamId, teamId]
    );

    /* -------------------------------------------------- *
     * Aggregated Offensive Season Stats (from team_weekly_stats)
     * Using DISTINCT in a subquery to avoid potential doubling if weekly stats are duplicated.
     * -------------------------------------------------- */
    let offenseStats = null;
    try {
      const [offenseStatsRows] = await connection.execute(
        `SELECT
           SUM(sub.passing_yards) AS pass_yards,
           SUM(sub.passing_tds) AS pass_tds,
           SUM(sub.rushing_yards) AS rush_yards,
           SUM(sub.rushing_tds) AS rush_tds,
           SUM(sub.passing_yards + sub.rushing_yards) AS total_off_yards
         FROM (
             SELECT DISTINCT season, week, team,
                             passing_yards, passing_tds, rushing_yards, rushing_tds
             FROM team_weekly_stats
             WHERE team = ? AND season = ?
         ) AS sub
         GROUP BY sub.team, sub.season`,
        [teamId, currentSeason]
      );
      offenseStats = offenseStatsRows.length ? offenseStatsRows[0] : null;
    } catch (statErr) {
      console.warn(`Could not fetch offensive season stats for ${teamId} (Season ${currentSeason}):`, statErr.message);
    }

    /* -------------------------------------------------- *
     * Aggregated Defensive Season Stats (from team_weekly_stats, based on opponent)
     * Using DISTINCT in a subquery to avoid potential doubling.
     * -------------------------------------------------- */
    let defenseStats = null;
    try {
      const [defenseStatsRows] = await connection.execute(
        `SELECT
           SUM(sub.passing_yards) AS pass_yards_allowed,
           SUM(sub.passing_tds) AS pass_td_allowed,
           SUM(sub.rushing_yards) AS rush_yards_allowed,
           SUM(sub.rushing_tds) AS rush_td_allowed,
           SUM(sub.passing_yards + sub.rushing_yards) AS total_defense_yards_allowed,
           SUM(sub.passing_tds + sub.rushing_tds) AS total_defense_td_allowed
         FROM (
             SELECT DISTINCT season, week, opponent_team,
                             passing_yards, passing_tds, rushing_yards, rushing_tds
             FROM team_weekly_stats
             WHERE opponent_team = ? AND season = ?
         ) AS sub
         GROUP BY sub.opponent_team, sub.season`,
        [teamId, currentSeason]
      );
      defenseStats = defenseStatsRows.length ? defenseStatsRows[0] : null;
    } catch (statErr) {
      console.warn(`Could not fetch defensive season stats for ${teamId} (Season ${currentSeason}):`, statErr.message);
    }

    // Build logo map for all referenced teams
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

    console.log("Backend: teamLogos being sent:", teamLogos);

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
        capacity: teamRow.stadium_capacity,
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
      roster: roster || [],
      depthChart: Object.keys(depthChart).length ? depthChart : {},
      recentNews: [],
      offenseStats: offenseStats,
      defenseStats: defenseStats,
      lastUpdated: new Date().toISOString()
    });

  } catch (err) {
    console.error('❌ API error:', err);
    if (connection) await connection.end();
    return res.status(500).json({ error: 'Internal server error' });
  }
}
