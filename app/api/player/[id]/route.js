import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Create a connection pool to the database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function GET(request, { params }) {
  const { id } = params;

  let connection;
  try {
    // Get a connection from the pool
    connection = await pool.getConnection();

    // Query for player data
    const [playerRows] = await connection.execute(
      `SELECT p.player_id, p.player_name, p.position, p.team_abbr, p.jersey_number, 
              p.headshot_url, p.college, p.draft_club, p.draft_number, p.rookie_year, 
              p.years_exp, p.status,
              (SELECT COUNT(*) FROM game_logs gl WHERE gl.player_id = p.player_id) as games,
              (SELECT SUM(gl.receptions) FROM game_logs gl WHERE gl.player_id = p.player_id) as receptions,
              (SELECT SUM(gl.receiving_yards) FROM game_logs gl WHERE gl.player_id = p.player_id) as yards,
              (SELECT SUM(gl.receiving_tds) FROM game_logs gl WHERE gl.player_id = p.player_id) as tds
       FROM players p
       WHERE p.player_id = ?`,
      [id]
    );

    if (!playerRows || playerRows.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Player not found' }), { status: 404 });
    }

    const player = playerRows[0];
    player.career = {
      games: player.games || 0,
      receptions: player.receptions || 0,
      yards: player.yards || 0,
      tds: player.tds || 0,
    };

    // Query for game logs
    const [gameLogRows] = await connection.execute(
      `SELECT season, week, opponent, targets, receptions, receiving_yards, receiving_tds, 
              passing_yards, rushing_yards
       FROM game_logs
       WHERE player_id = ?
       ORDER BY season DESC, week ASC`,
      [id]
    );

    // Query for receiving stats
    const [receivingStatRows] = await connection.execute(
      `SELECT season, targets, receiving_air_yards, receiving_yards_after_catch, 
              receiving_epa, wopr
       FROM receiving_stats
       WHERE player_id = ?
       ORDER BY season DESC`,
      [id]
    );

    return NextResponse.json({
      player,
      gameLogs: gameLogRows || [],
      receivingStats: receivingStatRows || [],
    });
  } catch (error) {
    console.error('API error:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
