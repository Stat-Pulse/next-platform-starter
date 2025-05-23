import mysql from 'mysql2/promise';

export async function GET(req, { params }) {
  const teamId = params.teamId.toUpperCase(); // Normalize to uppercase (e.g., chiefs -> CHIEFS)
  const altTeamId = teamId === 'CHIEFS' ? 'KC' : teamId; // Handle Chiefs-specific case

  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'stat_pulse_analytics_db',
    });
    console.log('Database connection successful.');

    console.log('Fetching team metadata...');
    let [teamRows] = await connection.execute(
      'SELECT team_name, team_division AS division, team_logo_espn AS logo_url FROM Teams WHERE team_abbr = ? OR team_abbr = ?',
      [teamId, altTeamId]
    );
    if (teamRows.length === 0) {
      console.log(`Team not found for team_abbr: ${teamId} or ${altTeamId}`);
      return new Response(JSON.stringify({ error: 'Team not found' }), { status: 404 });
    }
    const team = teamRows[0];
    const teamAbbr = teamRows[0].team_abbr; // Use actual team_abbr from DB

    console.log('Fetching season stats...');
    const [statsRows] = await connection.execute(
      `
      SELECT 
        (SELECT COUNT(*) 
         FROM Games 
         WHERE (home_team_id = ? AND winning_team_id = ?)
            OR (away_team_id = ? AND winning_team_id = ?)
            AND season_type = 'REG'
            AND game_date BETWEEN '2024-09-01' AND '2025-02-28'
        ) AS wins,
        (SELECT COUNT(*) 
         FROM Games 
         WHERE (home_team_id = ? AND losing_team_id = ?)
            OR (away_team_id = ? AND losing_team_id = ?)
            AND season_type = 'REG'
            AND game_date BETWEEN '2024-09-01' AND '2025-02-28'
        ) AS losses,
        (SELECT SUM(CASE 
                       WHEN home_team_id = ? THEN home_score 
                       WHEN away_team_id = ? THEN away_score 
                       ELSE 0 
                    END)
         FROM Games 
         WHERE (home_team_id = ? OR away_team_id = ?)
            AND season_type = 'REG'
            AND game_date BETWEEN '2024-09-01' AND '2025-02-28'
        ) AS points_scored,
        (SELECT SUM(CASE 
                       WHEN home_team_id = ? THEN away_score 
                       WHEN away_team_id = ? THEN home_score 
                       ELSE 0 
                    END)
         FROM Games 
         WHERE (home_team_id = ? OR away_team_id = ?)
            AND season_type = 'REG'
            AND game_date BETWEEN '2024-09-01' AND '2025-02-28'
        ) AS points_allowed
      `,
      [
        teamAbbr, teamAbbr, teamAbbr, teamAbbr,
        teamAbbr, teamAbbr, teamAbbr, teamAbbr,
        teamAbbr, teamAbbr, teamAbbr, teamAbbr,
        teamAbbr, teamAbbr, teamAbbr, teamAbbr,
      ]
    );
    const seasonStats = statsRows[0] || { wins: 0, losses: 0, points_scored: 0, points_allowed: 0 };

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
        AND is_final = 1
      ORDER BY game_date DESC, game_time DESC
      LIMIT 1
      `,
      [teamAbbr, teamAbbr]
    );
    const lastGame = lastGameRows[0] || null;

    console.log('Fetching upcoming game...');
    const [upcomingGameRows] = await connection.execute(
      `
      SELECT 
        game_date,
        game_time,
        home_team_id,
        away_team_id,
        stadium_name
      FROM Games
      WHERE (home_team_id = ? OR away_team_id = ?)
        AND is_final = 0
      ORDER BY game_date ASC
      LIMIT 1
      `,
      [teamAbbr, teamAbbr]
    );
    const upcomingGame = upcomingGameRows[0] || null;

    console.log('Fetching depth chart...');
    let depthChart = [];
    try {
      const [depthChartRows] = await connection.execute(
        `
        SELECT DISTINCT full_name, position, jersey_number
        FROM Rosters_2024
        WHERE team = ?
        ORDER BY position
        LIMIT 20
        `,
        [teamAbbr]
      );
      depthChart = depthChartRows;
    } catch (error) {
      console.log('Depth chart query failed:', error.message);
    }

    console.log('Fetching detailed stats...');
    let detailedStats = { total_passing_yards: 0, total_rushing_yards: 0, total_receiving_yards: 0 };
    try {
      const [detailedStatsRows] = await connection.execute(
        `
        SELECT 
          SUM(passing_yards) AS total_passing_yards,
          SUM(rushing_yards) AS total_rushing_yards,
          SUM(receiving_yards) AS total_receiving_yards
        FROM Player_Stats_Game_2024
        WHERE team_id = ? AND season = 2024
        `,
        [teamAbbr]
      );
      if (detailedStatsRows[0] && detailedStatsRows[0].total_passing_yards !== null) {
        detailedStats = detailedStatsRows[0];
      }
    } catch (error) {
      console.log('Detailed stats query failed:', error.message);
    }

    console.log('Fetching injuries...');
    let injuries = [];
    try {
      const [injuriesRows] = await connection.execute(
        `
        SELECT full_name, position, report_primary_injury, report_status, date_modified
        FROM Injuries
        WHERE team = ?
        `,
        [teamAbbr]
      );
      injuries = injuriesRows;
    } catch (error) {
      console.log('Injuries query failed:', error.message);
    }

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
      ORDER BY game_date
      `,
      [teamAbbr, teamAbbr]
    );
    const schedule = scheduleRows;

    await connection.end();
    console.log('Database connection closed.');

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
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Team API error:', error.message);
    if (connection) await connection.end();
    return new Response(JSON.stringify({ error: 'Failed to fetch team data' }), { status: 500 });
  }
}
