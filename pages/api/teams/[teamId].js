// pages/api/teams/[teamId].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const { teamId } = req.query;
  const normalizedTeamId = teamId.toUpperCase(); // Convert to uppercase to match team_abbr

  let connection;
  try {
    console.log('Attempting to connect to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'stat_pulse_analytics_db',
    });
    console.log('Database connection successful.');

    console.log('Fetching team metadata...');
    const [teamRows] = await connection.execute(
      'SELECT team_name, team_division AS division, team_logo_espn AS logo_url FROM Teams WHERE team_abbr = ?',
      [normalizedTeamId]
    );
    if (teamRows.length === 0) {
      console.log(`Team not found for team_abbr: ${normalizedTeamId}`);
      return res.status(404).json({ error: 'Team not found' });
    }
    const team = teamRows[0];

    console.log('Fetching season stats...');
    const [statsRows] = await connection.execute(
      `
      SELECT 
        (SELECT COUNT(*) 
         FROM Games 
         WHERE (home_team_id = ? AND winning_team_id = ?)
            OR (away_team_id = ? AND winning_team_id = ?)
            AND season_type = 'REG'
            AND game_date BETWEEN '2024-01-01' AND '2025-05-22'
        ) AS wins,
        (SELECT COUNT(*) 
         FROM Games 
         WHERE (home_team_id = ? AND losing_team_id = ?)
            OR (away_team_id = ? AND losing_team_id = ?)
            AND season_type = 'REG'
            AND game_date BETWEEN '2024-01-01' AND '2025-05-22'
        ) AS losses,
        (SELECT SUM(CASE 
                       WHEN home_team_id = ? THEN home_score 
                       WHEN away_team_id = ? THEN away_score 
                       ELSE 0 
                    END)
         FROM Games 
         WHERE (home_team_id = ? OR away_team_id = ?)
            AND season_type = 'REG'
            AND game_date BETWEEN '2024-01-01' AND '2025-05-22'
        ) AS points_scored,
        (SELECT SUM(CASE 
                       WHEN home_team_id = ? THEN away_score 
                       WHEN away_team_id = ? THEN home_score 
                       ELSE 0 
                    END)
         FROM Games 
         WHERE (home_team_id = ? OR away_team_id = ?)
            AND season_type = 'REG'
            AND game_date BETWEEN '2024-01-01' AND '2025-05-22'
        ) AS points_allowed
      `,
      [
        normalizedTeamId, normalizedTeamId,
        normalizedTeamId, normalizedTeamId,
        normalizedTeamId, normalizedTeamId,
        normalizedTeamId, normalizedTeamId,
        normalizedTeamId, normalizedTeamId,
        normalizedTeamId, normalizedTeamId,
        normalizedTeamId, normalizedTeamId,
      ]
    );
    const seasonStats = statsRows[0];

    console.log('Fetching last game...');
    const [lastGameRows] = await connection.execute(
      `
      SELECT 
        game_date,
        game_time,
        home_team_id,
        away_team_id,
        home_score,
        away_score
      FROM Games
      WHERE (home_team_id = ? OR away_team_id = ?)
        AND game_date <= '2025-05-22'
        AND is_final = 1
      ORDER BY game_date DESC, game_time DESC
      LIMIT 1
      `,
      [normalizedTeamId, normalizedTeamId]
    );
    const lastGame = lastGameRows[0] || null;

    console.log('Fetching upcoming game...');
    const [upcomingGameRows] = await connection.execute(
      `
      SELECT 
        game_date,
        game_time,
        home_team_id,
        away_team_id
      FROM Games
      WHERE (home_team_id = ? OR away_team_id = ?)
        AND game_date > '2025-05-22'
        AND is_final = 0
      ORDER BY game_date ASC
      LIMIT 1
      `,
      [normalizedTeamId, normalizedTeamId]
    );
    const upcomingGame = upcomingGameRows[0] || null;

    console.log('Fetching depth chart...');
    const [depthChartRows] = await connection.execute(
      `
      SELECT full_name, position, jersey_number
      FROM Player_Metadata
      WHERE team_abbr = ?
      ORDER BY position
      LIMIT 20
      `,
      [normalizedTeamId]
    );
    const depthChart = depthChartRows;

    console.log('Fetching detailed stats...');
    const [detailedStatsRows] = await connection.execute(
      `
      SELECT 
        SUM(passing_yards) AS total_passing_yards,
        SUM(rushing_yards) AS total_rushing_yards,
        SUM(receiving_yards) AS total_receiving_yards
      FROM Player_Stats_Game_2024
      WHERE team_id = ? AND season_id = 2024
      `,
      [normalizedTeamId]
    );
    const detailedStats = detailedStatsRows[0];

    console.log('Fetching injuries...');
    const [injuriesRows] = await connection.execute(
      `
      SELECT full_name, position, report_primary_injury, report_status, date_modified
      FROM Injuries
      WHERE team = ?
      `,
      [normalizedTeamId]
    );
    const injuries = injuriesRows;

    console.log('Fetching schedule...');
    const [scheduleRows] = await connection.execute(
      `
      SELECT 
        game_date,
        game_time,
        home_team_id,
        away_team_id,
        home_score,
        away_score,
        stadium_name,
        is_final
      FROM Games
      WHERE (home_team_id = ? OR away_team_id = ?)
        AND game_date <= '2025-05-22'
      ORDER BY game_date
      `,
      [normalizedTeamId, normalizedTeamId]
    );
    const schedule = scheduleRows;

    await connection.end();
    console.log('Database connection closed.');

    return res.status(200).json({
      team,
      seasonStats,
      lastGame,
      upcomingGame,
      depthChart,
      detailedStats,
      injuries,
      schedule,
    });
  } catch (error) {
    console.error('Error in /api/teams/[teamId]:', error.message);
    if (connection) await connection.end();
    return res.status(500).json({ error: error.message || 'Failed to fetch team data' });
  }
}
