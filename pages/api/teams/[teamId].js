// pages/api/teams/[teamId].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const {
    query: { teamId },
  } = req;

  const normalizedId = teamId?.toUpperCase();

  if (!normalizedId) return res.status(400).json({ error: 'Missing teamId' });

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Fetch team metadata, explicitly select key fields (including header fields)
    const [teamRows] = await connection.execute(
      `SELECT team_abbr, team_name, team_id, team_logo_espn,
        stadium_name, stadium_capacity, head_coach, o_coord, 
        d_coord, city, team_division, team_conf, founded_year
      FROM Teams WHERE team_abbr = ? LIMIT 1`,
      [normalizedId]
    );
    if (teamRows.length === 0) return res.status(404).json({ error: 'Team not found' });
    const team = teamRows[0];

    // Offensive Totals - fetch only frontend-used fields
    const [offenseRows] = await connection.execute(
      `SELECT
        points_scored, total_off_yards, yards_per_off_play,
        completions, pass_yards, rush_yards, rush_tds,
        turnovers_lost
      FROM Team_Off_Tot 
      WHERE LOWER(TRIM(team_name)) = LOWER(TRIM(?))`,
      [team.team_name]
    );
    const offenseStats = offenseRows[0] || null;

    // Defensive Totals - fetch only frontend-used fields
    const [defenseRows] = await connection.execute(
      `SELECT
        points_allowed, total_yards_allowed, pass_yards_allowed, rush_yards_allowed,
        sacks, turnovers, third_down_pct, yards_per_play_allowed
      FROM Team_Def_Tot 
      WHERE LOWER(TRIM(team_name)) = LOWER(TRIM(?))`,
      [team.team_name]
    );
    const defenseStats = defenseRows[0] || null;

    // Last finalized game
    const [lastGameRows] = await connection.execute(
      `SELECT * FROM Games
       WHERE (home_team_id = ? OR away_team_id = ?)
         AND season_id = 2024
         AND is_final = 1
       ORDER BY game_date DESC, game_time DESC
       LIMIT 1`,
      [team.team_id, team.team_id]
    );
    const lastGame = lastGameRows[0] || null;

    // Upcoming game
    const [upcomingGameRows] = await connection.execute(
      `SELECT * FROM Games
       WHERE (home_team_id = ? OR away_team_id = ?)
         AND season_id = 2024
         AND game_date > CURRENT_DATE()
       ORDER BY game_date ASC, game_time ASC
       LIMIT 1`,
      [team.team_id, team.team_id]
    );
    const upcomingGame = upcomingGameRows[0] || null;

    // Team logos for teams in both games
    const logoTeamIds = [
      lastGame?.home_team_id,
      lastGame?.away_team_id,
      upcomingGame?.home_team_id,
      upcomingGame?.away_team_id,
    ].filter(Boolean);

    const [logoRows] = logoTeamIds.length > 0
      ? await connection.query(
          `SELECT team_id, team_logo_espn FROM Teams WHERE team_id IN (${logoTeamIds.map(() => '?').join(',')})`,
          logoTeamIds
        )
      : [[]];

    const teamLogos = Object.fromEntries(logoRows.map(t => [t.team_id, t.team_logo_espn]));

    res.status(200).json({
      team,
      lastGame,
      upcomingGame,
      teamLogos,
      record: null,
      offenseStats,
      defenseStats,
    });
  } catch (error) {
    console.error('Team API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}