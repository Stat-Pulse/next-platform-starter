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
      return new Response(JSON.stringify({ error: 'Player not found' }), { status: 404 });
    }

    const player = playerRows[0];

    // Fetch game logs (optional, adjust table/column names as needed)
    // Fetch game logs with opponent info
    const [gameLogs] = await connection.execute(
      `
      SELECT 
        PSG.week,
        G.opponent_team_abbr,
        PSG.receptions,
        PSG.receiving_yards,
        PSG.receiving_tds,
        PSG.passing_tds,
        PSG.rushing_tds
      FROM Player_Stats_Game_2024 PSG
      JOIN Games_2024 G ON PSG.game_id = G.game_id
      WHERE PSG.player_id = ?
      ORDER BY PSG.week ASC
      `,
      [playerId]
    );

    // Calculate career totals from game logs
    const career = gameLogs.length > 0
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
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
