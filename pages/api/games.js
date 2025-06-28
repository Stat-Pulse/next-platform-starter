// pages/api/games.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  // Get season and team from the query string
  // They will be undefined or empty strings ("") if not selected or if "All" option is chosen
  const { season, team } = req.query;

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Start with a base query that selects all games
    let query = `SELECT * FROM nfl_game_results WHERE 1=1`; // 1=1 is always true, allows easy appending of AND clauses
    const params = []; // Array to hold parameters for the SQL query

    // Add season filter if 'season' is provided and is NOT an empty string
    // An empty string for 'season' means "All Seasons" for the backend
    if (season && season !== '') {
      query += ` AND season = ?`;
      params.push(season);
    }

    // Add team filter if 'team' is provided and is NOT an empty string
    // An empty string for 'team' means "All Teams" for the backend
    if (team && team !== '') {
      // Filter where the selected team is either the home_team or the away_team
      query += ` AND (home_team = ? OR away_team = ?)`;
      params.push(team); // Parameter for home_team
      params.push(team); // Parameter for away_team (needs to be pushed twice for OR condition)
    }

    // Add ordering for consistent results, e.g., by season, then week, then game_date
    query += ` ORDER BY season DESC, week ASC, game_date ASC, game_time ASC`;

    // Execute the query with the dynamically built conditions and parameters
    const [rows] = await connection.execute(query, params);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) await connection.end(); // Ensure connection is closed
  }
}