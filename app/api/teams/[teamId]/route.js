import mysql from 'mysql2/promise';

export async function GET(req, { params }) {
  const teamId = params.teamId.toUpperCase(); // Normalize to uppercase

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [teamRows] = await connection.execute(
      `
      SELECT
        team_abbr,
        team_name,
        city,
        team_logo_url,
        conference,
        division
      FROM Teams
      WHERE team_abbr = ?
      LIMIT 1
      `,
      [teamId]
    );

    if (teamRows.length === 0) {
      return new Response(JSON.stringify({ error: 'Team not found' }), { status: 404 });
    }

    const team = teamRows[0];

    // Optionally fetch team stats or roster (adjust table/columns as needed)
    const [roster] = await connection.execute(
      `
      SELECT
        gsis_id,
        full_name AS player_name,
        position,
        jersey_number
      FROM Rosters_2024
      WHERE team = ?
      `,
      [teamId]
    );

    await connection.end();

    return new Response(
      JSON.stringify({
        team,
        roster,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Team API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}