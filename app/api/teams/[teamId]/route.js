import mysql from 'mysql2/promise';

export async function GET(req, { params }) {
  const teamIdentifier = params.teamId.toUpperCase(); // e.g., 'KC' or 'CHIEFS'

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

    console.log(`Fetching team metadata for identifier: ${teamIdentifier}...`);
    let teamAbbr = teamIdentifier;
    if (teamIdentifier === 'CHIEFS') teamAbbr = 'KC';

    let [teamRows] = await connection.execute(
      `SELECT team_id, team_name, team_abbr, team_division AS division, team_logo_espn AS logo_url 
       FROM Teams 
       WHERE team_abbr = ?`,
      [teamAbbr]
    );

    if (teamRows.length === 0) {
      console.log(`Team not found for identifier: ${teamIdentifier}`);
      return new Response(JSON.stringify({ error: 'Team not found' }), { status: 404 });
    }

    const team = teamRows[0];
    const teamAbbr = team.team_abbr; // e.g., 'KC'
    const numericTeamIdString = team.team_id; // e.g., '2310'
    console.log(`Team found: ${team.team_name} (Abbr: ${teamAbbr}, Numeric ID: ${numericTeamIdString})`);

    console.log('Fetching season stats...');
    let seasonStats = { wins: 0, losses: 0, points_scored: 0, points_allowed: 0 };
    try {
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
      if (statsRows[0]) {
        seasonStats = statsRows[0];
        console.log(`Season stats: wins=${seasonStats.wins}, losses=${seasonStats.losses}`);
      } else {
        console.log('No season stats found');
      }
    } catch (error) {
      console.log('Season stats query failed:', error.message);
    }

    console.log('Fetching last game...');
    let lastGame = null;
    try {
      const [lastGameRows] = await connection.execute(
        `
        SELECT 
          game_id,
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
      lastGame = lastGameRows[0] || null;
      console.log(lastGame ? `Last game found: ${lastGame.game_id}` : 'No last game found');
    } catch (error) {
      console.log('Last game query failed:', error.message);
    }

    console.log('Fetching upcoming game...');
    let upcomingGame = null;
    try {
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
      upcomingGame = upcomingGameRows[0] || null;
      console.log(upcomingGame ? `Upcoming game found` : 'No upcoming game found');
    } catch (error) {
      console.log('Upcoming game query failed:', error.message);
    }

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
      console.log(`Depth chart entries: ${depthChart.length}`);
    } catch (error) {
      console.log('Depth chart query failed:', error.message);
    }

    console.log('Fetching detailed stats...');
    let detailedStats = { total_passing_yards: 0, total_rushing_yards: 0, total_receiving_yards: 0 };
    try {
      if (numericTeamIdString) {
        const [detailedStatsRows] = await connection.execute(
          `
          SELECT 
            SUM(passing_yards) AS total_passing_yards,
            SUM(rushing_yards) AS total_rushing_yards,
            SUM(receiving_yards) AS total_receiving_yards
          FROM Player_Stats_Game_2024
          WHERE team_id = ? AND season = 2024
          `,
          [numericTeamIdString]
        );
        if (detailedStatsRows[0] && detailedStatsRows[0].total_passing_yards !== null) {
          detailedStats = detailedStatsRows[0];
          console.log(`Detailed stats: passing_yards=${detailedStats.total_passing_yards}`);
        } else {
          console.log('No detailed stats found');
        }
      } else {
        console.log(`No numeric team_id found for ${teamAbbr}`);
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
      console.log(`Injuries entries: ${injuries.length}`);
    } catch (error) {
      console.log('Injuries query failed:', error.message);
    }

    console.log('Fetching schedule...');
    let schedule = [];
    try {
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
          AND game_date BETWEEN '2024-09-01' AND '2025-02-28'
        ORDER BY game_date
        `,
        [teamAbbr, teamAbbr]
      );
      schedule = scheduleRows;
      console.log(`Schedule entries: ${schedule.length}`);
    } catch (error) {
      console.log('Schedule query failed:', error.message);
    }

    console.log('Fetching team grades...');
    let teamGrades = { overall: 'N/A', offense: 'N/A', defense: 'N/A', specialTeams: 'N/A' };
    try {
      if (numericTeamIdString) {
        const [gradesRows] = await connection.execute(
          `
          SELECT overall_grade AS overall, offense_grade AS offense, defense_grade AS defense, special_teams_grade AS specialTeams
          FROM Team_Grades
          WHERE team_id = ? AND season = 2024
          `,
          [numericTeamIdString]
        );
        if (gradesRows[0]) {
          teamGrades = gradesRows[0];
          console.log(`Team grades found: overall=${teamGrades.overall}`);
        } else {
          console.log('No team grades found');
        }
      }
    } catch (error) {
      console.log('Team grades query failed:', error.message);
    }

    console.log('Fetching fantasy projections...');
    let fantasyProjections = [];
    try {
      if (numericTeamIdString) {
        const [projRows] = await connection.execute(
          `
          SELECT player_id, projected_points, projected_yards, projected_touchdowns
          FROM Fantasy_Projections
          WHERE team_id = ? AND season = 2024
          LIMIT 5
          `,
          [numericTeamIdString]
        );
        fantasyProjections = projRows;
        console.log(`Fantasy projections entries: ${fantasyProjections.length}`);
      }
    } catch (error) {
      console.log('Fantasy projections query failed:', error.message);
    }

    console.log('Fetching news...');
    let newsItems = [];
    try {
      if (numericTeamIdString) {
        const [newsRows] = await connection.execute(
          `
          SELECT title, link, timestamp
          FROM News
          WHERE team_id = ?
          ORDER BY timestamp DESC
          LIMIT 6
          `,
          [numericTeamIdString]
        );
        newsItems = newsRows.map(row => ({
          title: row.title,
          link: row.link,
          timestamp: new Date(row.timestamp).toLocaleString(),
        }));
        console.log(`News entries: ${newsItems.length}`);
      }
    } catch (error) {
      console.log('News query failed:', error.message);
    }

    const responseData = {
      team,
      seasonStats,
      lastGame,
      upcomingGame,
      depthChart,
      detailedStats,
      injuries,
      schedule,
      teamGrades,
      fantasyProjections,
      newsItems,
    };
    console.log('API response:', JSON.stringify(responseData, null, 2));

    await connection.end();
    console.log('Database connection closed.');

    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (error) {
    console.error('Team API error:', error.message);
    if (connection) await connection.end();
    return new Response(JSON.stringify({ error: 'Failed to fetch team data' }), { status: 500 });
  }
}
