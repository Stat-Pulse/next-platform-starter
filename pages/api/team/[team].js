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

    const [abbrRows] = await connection.execute(
      `SELECT team_abbr FROM Teams WHERE LOWER(nickname) = ? OR LOWER(team_name) LIKE ?`,
      [team.toLowerCase(), `%${team.toLowerCase()}%`]
    );

    if (!abbrRows.length) {
      await connection.end();
      return res.status(404).json({ error: 'Team slug could not be resolved' });
    }

    teamId = abbrRows[0].team_abbr;

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
    const fullTeamId = teamRow.team_id || teamId;

  const [roster] = await connection.execute(
  `SELECT
       gsis_id   AS id,
       full_name AS name,
       position,
       jersey_number AS number,
       rookie_year
       headshot_url
     FROM Rosters_2025
     WHERE team   = ?
       AND season = 2025`,
  [teamId]
);

    const [depthRows] = await connection.execute(
      `SELECT position, player_id, team, position,
         FROM Depth_Charts
        WHERE club_code = ?
          AND season_year = 2025
          AND week = (SELECT MAX(week)
                        FROM Depth_Charts
                       WHERE club_code = ?
                         AND season_year = 2025)`,
      [teamId, teamId]
    );
    const depthChart = {};
    for (const row of depthRows) {
      if (!depthChart[row.position]) depthChart[row.position] = [];
      depthChart[row.position].push({ name: row.full_name, depth: row.depth_team });
    }

    const [schedule] = await connection.execute(
      `SELECT game_id, week, game_date AS date, game_time,
              home_team_id, away_team_id, home_score, away_score, is_final,
              stadium_name, spread_line, total_line, referee, weather_summary
       FROM Games
       WHERE home_team_id = ? OR away_team_id = ?
       ORDER BY game_date ASC`,
      [teamId, teamId]
    );

    const formattedGames = schedule.map(g => {
      const isHome = g.home_team_id === teamId;
      const opponent = isHome ? g.away_team_id : g.home_team_id;
      const score = g.is_final ? `${g.home_score} - ${g.away_score}` : 'TBD';
      const result = g.is_final
        ? (isHome && g.home_score > g.away_score) || (!isHome && g.away_score > g.home_score)
          ? 'W' : 'L'
        : '';
      return {
        gameId: g.game_id,
        week: g.week,
        date: g.date,
        opponent: opponent || 'TBD',
        homeAway: isHome ? 'H' : 'A',
        score,
        result
      };
    });

    /* -------------------------------------------------- *
     *  Upcoming 2025 schedule                            *
     * -------------------------------------------------- */
    const [upcomingRows] = await connection.execute(
      `SELECT game_id,
              gameday,
              weekday,
              week,
              gametime,
              home_team,
              away_team,
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
     *  Build logo map for all referenced teams           *
     * -------------------------------------------------- */
    const teamSet = new Set([teamId]);
    upcomingRows.forEach(r => {
      if (r.home_team) teamSet.add(r.home_team);
      if (r.away_team) teamSet.add(r.away_team);
    });
    formattedGames.forEach(g => {
      if (g.opponent) teamSet.add(g.opponent);
    });
    const [logoRows] = await connection.execute(
      `SELECT team_abbr, team_logo_espn FROM Teams WHERE team_abbr IN (?)`,
      [Array.from(teamSet)]
    );
    const teamLogos = {};
    logoRows.forEach(r => {
      teamLogos[r.team_abbr] = r.team_logo_espn;
    });

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
        capacity: teamRow.stadium_capacity
      },
      coaching: {
        headCoach: teamRow.head_coach,
        offensiveCoordinator: teamRow.o_coord,
        defensiveCoordinator: teamRow.d_coord
      },
      teamLogos,
      seasonGames: formattedGames,
      upcomingSchedule: upcomingRows,
      roster: roster || [],
      depthChart: Object.keys(depthChart).length ? depthChart : {},
      schedule: formattedGames,
      recentNews: [
        {
          title: `${teamRow.team_name} preparing for upcoming matchup`,
          date: new Date().toISOString().split('T')[0]
        }
      ],
      lastUpdated: new Date().toISOString()
    });

  } catch (err) {
    console.error('❌ API error:', err);
    if (connection) await connection.end();
    return res.status(500).json({ error: 'Internal server error' });
  }
}
