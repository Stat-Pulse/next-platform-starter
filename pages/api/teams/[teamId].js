// pages/api/teams/[teamId].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const {
    query: { teamId },
  } = req;

  if (!teamId) return res.status(400).json({ error: 'Missing teamId' });

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [teamRows] = await connection.execute(
      `SELECT * FROM Teams WHERE team_id = ? LIMIT 1`,
      [teamId]
    );
    if (teamRows.length === 0) return res.status(404).json({ error: 'Team not found' });
    const team = teamRows[0];

    const [statsRows] = await connection.execute(
      `SELECT wins, losses, points_scored, points_allowed
       FROM Team_Stats_2024
       WHERE team_id = ? LIMIT 1`,
      [teamId]
    );
    const seasonStats = statsRows[0] || null;

    const [lastGameRows] = await connection.execute(
      `SELECT * FROM Games
       WHERE (home_team_id = ? OR away_team_id = ?) AND season_id = 2024
       ORDER BY game_date DESC, game_time DESC
       LIMIT 1`,
      [teamId, teamId]
    );
    const lastGame = lastGameRows[0] || null;

    const [upcomingGameRows] = await connection.execute(
      `SELECT * FROM Games
       WHERE (home_team_id = ? OR away_team_id = ?) AND season_id = 2024 AND game_date > CURRENT_DATE()
       ORDER BY game_date ASC, game_time ASC
       LIMIT 1`,
      [teamId, teamId]
    );
    const upcomingGame = upcomingGameRows[0] || null;

    const teamIds = [lastGame?.home_team_id, lastGame?.away_team_id, upcomingGame?.home_team_id, upcomingGame?.away_team_id].filter(Boolean);
    const [logoRows] = await connection.query(
      `SELECT team_id, team_logo_espn FROM Teams WHERE team_id IN (${teamIds.map(() => '?').join(',')})`,
      teamIds
    );
    const teamLogos = Object.fromEntries(logoRows.map(t => [t.team_id, t.team_logo_espn]));

    res.status(200).json({
      team,
      seasonStats,
      lastGame,
      upcomingGame,
      teamLogos,
    });
  } catch (error) {
    console.error('Team API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}