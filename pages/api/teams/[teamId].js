// pages/api/teams/[teamId].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const {
    query: { teamId },
  } = req;

  const slugToAbbr = {
    cardinals: 'ARI', falcons: 'ATL', ravens: 'BAL', bills: 'BUF',
    panthers: 'CAR', bears: 'CHI', bengals: 'CIN', browns: 'CLE',
    cowboys: 'DAL', broncos: 'DEN', lions: 'DET', packers: 'GB',
    texans: 'HOU', colts: 'IND', jaguars: 'JAX', chiefs: 'KC',
    raiders: 'LV', chargers: 'LAC', rams: 'LAR', dolphins: 'MIA',
    vikings: 'MIN', patriots: 'NE', saints: 'NO', giants: 'NYG',
    jets: 'NYJ', eagles: 'PHI', steelers: 'PIT', 49ers: 'SF',
    seahawks: 'SEA', buccaneers: 'TB', titans: 'TEN', commanders: 'WAS'
  };
  const normalizedId = slugToAbbr[teamId?.toLowerCase()] || teamId?.toUpperCase();

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
        adot_against, yac_allowed, pass_yards_allowed, 
        pass_td_allowed, sacks, blitz_percent, sacks, qb_press
      FROM Team_Def_Tot 
      WHERE LOWER(TRIM(team_name)) = LOWER(TRIM(?))`,
      [team.team_name]
    );
    const defenseStats = defenseRows[0] || null;

    // All 2024 season finalized games
    const [seasonGames] = await connection.execute(
      `SELECT * FROM Games
       WHERE (home_team_id = ? OR away_team_id = ?)
         AND season_id = 2024
         AND is_final = 1
       ORDER BY game_date DESC, game_time DESC`,
      [team.team_id, team.team_id]
    );
    const lastGame = seasonGames[0] || null;

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

    const [futureScheduleRows] = await connection.execute(
      `SELECT 
          s.game_id, s.away_team, s.home_team, s.gameday, s.stadium, s.spread,
          th.team_name AS home_team_name, ta.team_name AS away_team_name
       FROM Schedules_2025 s
       LEFT JOIN Teams th ON s.home_team = th.team_abbr
       LEFT JOIN Teams ta ON s.away_team = ta.team_abbr
       WHERE (s.home_team = ? OR s.away_team = ?)
         AND s.gameday >= CURRENT_DATE()
       ORDER BY s.gameday ASC`,
      [normalizedId, normalizedId]
    );

    const upcomingGame = futureScheduleRows[0] || null;

    // Team logos for all teams in season games and upcoming game
    const logoTeamIds = Array.from(new Set([
      ...seasonGames.map(g => g.home_team_id),
      ...seasonGames.map(g => g.away_team_id),
      upcomingGame?.home_team,
      upcomingGame?.away_team,
    ].filter(Boolean)));

    const [logoRows] = logoTeamIds.length > 0
      ? await connection.query(
          `SELECT team_id, team_logo_espn FROM Teams WHERE team_id IN (${logoTeamIds.map(() => '?').join(',')})`,
          logoTeamIds
        )
      : [[]];

    const teamLogos = Object.fromEntries(logoRows.map(t => [t.team_id, t.team_logo_espn]));

    res.status(200).json({
      team,
      offenseStats,
      defenseStats,
      lastGame: seasonGames[0] || null,
      upcomingGame,
      upcomingSchedule: futureScheduleRows,
      seasonGames,
      teamLogos,
      record: null,
    });
  } catch (error) {
    console.error('Team API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}