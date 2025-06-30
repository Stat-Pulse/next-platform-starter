// pages/api/teams.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
 
    // Fetch distinct team names from both home_team and away_team columns
    // Use UNION to combine distinct teams from both columns
    const [rows] = await connection.execute(
      `SELECT DISTINCT team_name FROM (
         SELECT home_team AS team_name FROM nfl_game_results
         UNION
         SELECT away_team AS team_name FROM nfl_game_results
       ) AS all_teams
       WHERE team_name IS NOT NULL AND team_name != ''
       ORDER BY team_name ASC`
    );

    const teamNames = rows.map(row => row.team_name);

    res.status(200).json(teamNames);
  } catch (error) {
    console.error('Error fetching teams for dropdown:', error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) await connection.end();
  }
}