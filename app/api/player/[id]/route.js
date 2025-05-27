// app/api/player/[id]/route.js
import mysql from 'mysql2/promise';

export async function GET(req, { params }) {
  const playerId = params.id;
  console.log('🔍 Fetching player with ID:', playerId);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Step 1: Basic player metadata
    const [playerRows] = await connection.execute(
      `
      SELECT
        full_name AS player_name,
        position,
        team AS team_abbr,
        jersey_number,
        status,
        college,
        draft_club,
        draft_number,
        rookie_year,
        years_exp,
        headshot_url,
        height,
        weight
      FROM Rosters_2024
      WHERE gsis_id = ?
      LIMIT 1
      `,
      [playerId]
    );

    if (playerRows.length === 0) {
      console.log('❌ Player not found for ID:', playerId);
      return new Response(JSON.stringify({ error: 'Player not found' }), { status: 404 });
    }

    const player = playerRows[0];

    // Step 2: Basic game logs (NO joins yet)
    const [gameLogs] = await connection.execute(
      `
      SELECT
        week,
        opponent_team_abbr,
        receptions,
        receiving_yards,
        receiving_tds,
        rushing_tds,
        passing_tds
      FROM Player_Stats_Game_2024
      WHERE player_id = ?
      ORDER BY week ASC
      `,
      [playerId]
    );

    const career =
      gameLogs.length > 0
        ? {
            games: gameLogs.length,
            receptions: gameLogs.reduce((acc, g) => acc + (g.receptions || 0), 0),
            yards: gameLogs.reduce((acc, g) => acc + (g.receiving_yards || 0), 0),
            tds: gameLogs.reduce((acc, g) => acc + (g.receiving_tds || 0), 0),
          }
        : null;

    await connection.end();

    return new Response(
      JSON.stringify({
        player: { ...player, career },
        gameLogs,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error('🔥 API error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
