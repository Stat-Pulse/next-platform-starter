// pages/api/teams/[teamId].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const { teamId } = req.query;

  // Create a connection to your MySQL database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'stat_pulse_analytics_db',
  });

  try {
    // Fetch team metadata from Teams table
    const [teamRows] = await connection.execute(
      'SELECT team_name, division, logo_url FROM Teams WHERE team_id = ?',
      [teamId]
    );
    if (teamRows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }
    const team = teamRows[0];

    // Fetch season stats from Games table
    const [statsRows] = await connection.execute(
      `
      SELECT 
        (SELECT COUNT(*) 
         FROM Games 
         WHERE (home_team_id = ? AND winning_team_id = ?)
            OR (away_team_id = ? AND winning_team_id = ?)
            AND season_type = 'REG' AND season_id = 2024
        ) AS wins,
        (SELECT COUNT(*) 
         FROM Games 
         WHERE (home_team_id = ? AND losing_team_id = ?)
            OR (away_team_id = ? AND losing_team_id = ?)
            AND season_type = 'REG' AND season_id = 2024
        ) AS losses,
        (SELECT SUM(CASE 
                       WHEN home_team_id = ? THEN home_score 
                       WHEN away_team_id = ? THEN away_score 
                       ELSE 0 
                    END)
         FROM Games 
         WHERE (home_team_id = ? OR away_team_id = ?)
            AND season_type = 'REG' AND season_id = 2024
        ) AS points_scored,
        (SELECT SUM(CASE 
                       WHEN home_team_id = ? THEN away_score 
                       WHEN away_team_id = ? THEN home_score 
                       ELSE 0 
                    END)
         FROM Games 
         WHERE (home_team_id = ? OR away_team_id = ?)
            AND season_type = 'REG' AND season_id = 2024
        ) AS points_allowed
      `,
      [
        teamId, teamId,
        teamId, teamId,
        teamId, teamId,
        teamId, teamId,
        teamId, teamId,
        teamId, teamId,
        teamId, teamId,
      ]
    );
    const seasonStats = statsRows[0];

    // Fetch last game from Games table
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
        AND season_id = 2024
        AND is_final = 1
      ORDER BY game_date DESC, game_time DESC
      LIMIT 1
      `,
      [teamId, teamId]
    );
    const lastGame = lastGameRows[0] || null;

    // Fetch upcoming game from Games table
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
      [teamId, teamId]
    );
    const upcomingGame = upcomingGameRows[0] || null;

    // Fetch depth chart from Player_Metadata table
    const [depthChartRows] = await connection.execute(
      `
      SELECT full_name, position, jersey_number
      FROM Player_Metadata
      WHERE team_abbr = ?
      ORDER BY position
      LIMIT 20
      `,
      [teamId]
    );
    const depthChart = depthChartRows;

    // Fetch detailed stats from Player_Stats_Game_2024 table
    const [detailedStatsRows] = await connection.execute(
      `
      SELECT 
        SUM(passing_yards) AS total_passing_yards,
        SUM(rushing_yards) AS total_rushing_yards,
        SUM(receiving_yards) AS total_receiving_yards
      FROM Player_Stats_Game_2024
      WHERE team_id = ? AND season_id = 2024
      `,
      [teamId]
    );
    const detailedStats = detailedStatsRows[0];

    // Fetch injuries from Injuries table
    const [injuriesRows] = await connection.execute(
      `
      SELECT full_name, position, report_primary_injury, report_status, date_modified
      FROM Injuries
      WHERE team = ?
      `,
      [teamId]
    );
    const injuries = injuriesRows;

    // Fetch schedule from Games table
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
        AND season_id = 2024
      ORDER BY game_date
      `,
      [teamId, teamId]
    );
    const schedule = scheduleRows;

    // Close the database connection
    await connection.end();

    // Return the data (excluding news, which will be fetched in the component)
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
    console.error('Error fetching team data:', error);
    await connection.end();
    return res.status(500).json({ error: 'Failed to fetch team data' });
  }
}
