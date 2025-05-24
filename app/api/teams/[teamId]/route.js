// app/api/teams/[teamId]/route.js
import mysql from 'mysql2/promise';

export async function GET(req, { params }) {
  const teamIdentifier = params.teamId.toUpperCase(); // This could be 'KC' or 'CHIEFS'

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

    console.log(`Workspaceing team metadata for identifier: ${teamIdentifier}...`);
    // First, get the canonical team abbreviation AND the numeric team_id
    // We search by team_abbr first, then by team_name for the 'CHIEFS' alias.
    let [teamRows] = await connection.execute(
      `SELECT team_id, team_name, team_abbr, team_division AS division, team_logo_espn AS logo_url 
       FROM Teams 
       WHERE team_abbr = ? OR team_name = ?`, // Search by abbreviation or full name
      [teamIdentifier, teamIdentifier]
    );

    // Specific handling for 'CHIEFS' to ensure 'KC' abbreviation is picked if 'CHIEFS' is not a direct abbr
    if (teamRows.length === 0 && teamIdentifier === 'CHIEFS') {
        [teamRows] = await connection.execute(
            `SELECT team_id, team_name, team_abbr, team_division AS division, team_logo_espn AS logo_url 
             FROM Teams 
             WHERE team_abbr = 'KC'`,
            []
        );
    }
    // Specific handling for 'KC' to ensure 'Chiefs' team_name is picked if 'KC' is not found as abbr (unlikely but safe)
    else if (teamRows.length === 0 && teamIdentifier === 'KC') {
        [teamRows] = await connection.execute(
            `SELECT team_id, team_name, team_abbr, team_division AS division, team_logo_espn AS logo_url 
             FROM Teams 
             WHERE team_name = 'Chiefs'`, // Assuming the full name is 'Chiefs'
            []
        );
    }

    if (teamRows.length === 0) {
      console.log(`Team not found for identifier: ${teamIdentifier}`);
      return new Response(JSON.stringify({ error: 'Team not found' }), { status: 404 });
    }

    const team = teamRows[0];
    const teamAbbr = team.team_abbr; // e.g., 'KC' - used for Games, Rosters, Injuries
    // team.team_id is stored as TEXT in your DB, but represents the numeric ID.
    // It should be passed as a string to queries.
    const numericTeamIdString = team.team_id; // e.g., '2310' - used for Player_Stats_Game_2024

    console.log(`Team found: ${team.team_name} (Abbr: ${teamAbbr}, Numeric ID: ${numericTeamIdString})`);


    // --- Use teamAbbr for Games, Rosters, Injuries tables ---
    // --- Use numericTeamIdString for Player_Stats_Game_2024 ---

    // Fetch season stats (Games table uses team_abbr)
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
          teamAbbr, teamAbbr, teamAbbr, teamAbbr, // For wins
          teamAbbr, teamAbbr, teamAbbr, teamAbbr, // For losses
          teamAbbr, teamAbbr, teamAbbr, teamAbbr, // For points_scored
          teamAbbr, teamAbbr, teamAbbr, teamAbbr, // For points_allowed
        ]
      );
      if (statsRows[0]) {
        seasonStats = statsRows[0];
        console.log(`Season stats: wins=${seasonStats.wins}, losses=${seasonStats.losses}`);
      } else {
        console.log('No season stats found for this team and season.');
      }
    } catch (error) {
      console.log('Season stats query failed:', error.message);
    }

    // Fetch last game (Games table uses team_abbr)
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

    // Fetch upcoming game (Games table uses team_abbr)
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

    // Fetch depth chart (Rosters_2024 table uses team_abbr)
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

    // Fetch detailed stats (Player_Stats_Game_2024 uses numeric team_id as string)
    console.log('Fetching detailed stats...');
    let detailedStats = { total_passing_yards: 0, total_rushing_yards: 0, total_receiving_yards: 0 };
    try {
        // Use the numericTeamIdString from the Teams table.
        // It's stored as TEXT in Teams, but INT in Player_Stats_Game_2024.
        // MySQL will implicitly convert the string to an integer for comparison here.
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
                [numericTeamIdString] // Pass the string directly
            );
            if (detailedStatsRows[0] && detailedStatsRows[0].total_passing_yards !== null) {
                detailedStats = detailedStatsRows[0];
                console.log(`Detailed stats: passing_yards=${detailedStats.total_passing_yards}`);
            } else {
                console.log('No detailed stats found for this team and season.');
            }
        } else {
            console.log(`No numeric team_id available for detailed stats query.`);
        }
    } catch (error) {
      console.log('Detailed stats query failed:', error.message);
    }

    // Fetch injuries (Injuries table uses team_abbr)
    console.log('Fetching injuries...');
    let injuries = [];
    try {
      const [injuriesRows] = await connection.execute(
        `
        SELECT full_name, position, report_primary_injury AS injury_description, report_status AS injury_status, date_modified 
        FROM Injuries
        WHERE team = ?
        `,
        [teamAbbr]
      );
      injuries = injuriesRows.map(injury => ({
        ...injury,
        player_name: injury.full_name // Map to player_name for frontend consistency
      }));
      console.log(`Injuries entries: ${injuries.length}`);
    } catch (error) {
      console.log('Injuries query failed:', error.message);
    }

    // Fetch schedule (Games table is used for schedule)
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
          is_final,
          week
        FROM Games
        WHERE (home_team_id = ? OR away_team_id = ?)
        ORDER BY game_date
        `,
        [teamAbbr, teamAbbr]
      );
      schedule = scheduleRows.map(game => ({
        ...game,
        final_score: game.is_final ? `${game.home_score}-${game.away_score}` : null,
        opponent: game.home_team_id === teamAbbr ? game.away_team_id : game.home_team_id,
        // Assuming 'week' column exists from your Games DESCRIBE
      }));
      console.log(`Schedule entries: ${schedule.length}`);
    } catch (error) {
      console.log('Schedule query failed:', error.message);
    }

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
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed after error.');
      } catch (closeError) {
        console.error('Error closing database connection:', closeError.message);
      }
    }
    return new Response(JSON.stringify({ error: 'Failed to fetch team data', details: error.message }), { status: 500 });
  }
}
