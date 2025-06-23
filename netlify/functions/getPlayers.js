// netlify/functions/getPlayers.js
const mysql = require('mysql2/promise');

exports.handler = async function (event, context) {
  let connection;

  try {
    // 1. Connect to your database
    connection = await mysql.createConnection({
      host:     process.env.DB_HOST,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // 2. Query active player data
    const [rows] = await connection.execute(`
      SELECT 
        player_id,
        player_name,
        position,
        team_abbr AS team
      FROM Active_Player_Profiles
      WHERE position IS NOT NULL
      ORDER BY player_name ASC
      LIMIT 500
    `);

    // 3. Return as JSON
    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (error) {
    console.error('Error fetching players:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load player list.' }),
    };
  } finally {
    if (connection) await connection.end();
  }
};