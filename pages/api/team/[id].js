// File: pages/api/team/[id].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid team ID' });
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // 1. Team Info (Teams + branding)
    const [teamRows] = await connection.execute(
      `SELECT t.team_id, t.team_name, t.city, t.state, t.stadium_name, t.stadium_capacity, t.about, t.coach,
              b.team_color, b.team_color2, b.team_logo_wikipedia, b.team_logo_espn
       FROM Teams t
       LEFT JOIN Teams_2024 b ON t.team_id = b.team_abbr
       WHERE t.team_id = ?`,
      [id]
    );
    if (!teamRows || teamRows.length === 0) {
      await connection.end();
      return res.status(404).json({ error: 'Team not found' });
    }
    const team = teamRows[0];

    // 2. Roster
    const [roster] = await connection.execute(
      `SELECT player_id, player_name, position, jersey_number, height_inches, weight, college, draft_year, years_exp
       FROM Rosters_2024
       WHERE team = ?`,
      [id]
    );

    // 3. Depth Chart
    const [depthRows] = await connection.execute(
      `SELECT position, full_name, depth_team
       FROM Depth_Charts_2024
       WHERE club_code = ?
       ORDER BY week DESC`,
      [id]
    );

    const depthChart = {};
    for (const row of depthRows) {
      if (!depthChart[row.position]) depthChart[row.position] = [];
      depthChart[row.position].push({ name: row.full_name, depth: row.depth_team });
    }

    // 4. Schedule
    const [games] = await connection.execute(
      `SELECT week, date, opponent_id, home_away, score, result
       FROM Games
       WHERE team_id = ?
       ORDER BY week ASC`,
      [id]
    );

    // 5. Team Stats
    const [statsRows] = await connection.execute(
      `SELECT SUM(CAST(SUBSTRING_INDEX(score, '-', 1) AS UNSIGNED)) AS total_points
       FROM Games
       WHERE team_id = ? AND score IS NOT NULL`,
      [id]
    );

    await connection.end();

    return res.status(200).json({
      id: team.team_id,
      name: team.team_name,
      location: `${team.city}, ${team.state}`,
      stadium: {
        name: team.stadium_name,
        capacity: team.stadium_capacity,
      },
      about: team.about || 'No description available.',
      coach: team.coach || 'N/A',
      branding: {
        primary: team.team_color,
        secondary: team.team_color2,
        logo: team.team_logo_espn || team.team_logo_wikipedia,
      },
      roster,
      depthChart,
      schedule: games,
      stats: {
        totalPoints: statsRows[0].total_points || 0,
      },
      socialMedia: {
        x: `https://x.com/${team.team_id}`,
        instagram: `https://instagram.com/${team.team_id}`,
      },
      recentNews: [
        { title: `${team.team_name} prepares for next game`, date: new Date().toISOString().split('T')[0] },
      ]
    });
  } catch (err) {
    console.error('❌ Team API error:', err);
    if (connection) await connection.end();
    return res.status(500).json({ error: 'Failed to fetch team data' });
  }
}