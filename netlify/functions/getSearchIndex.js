const mysql = require('mysql2/promise');

exports.handler = async function () {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Players
    const [players] = await connection.execute(`
      SELECT player_id, player_name FROM Players LIMIT 250
    `);

    // Teams
    const [teams] = await connection.execute(`
      SELECT team_id, team_name FROM Teams
    `);

    // Referees
    const [refs] = await connection.execute(`
      SELECT ref_id, full_name FROM Refs
    `);

    await connection.end();

    // Build search index
    const index = [
      ...players.map(p => ({
        label: p.player_name,
        url: `/players/${p.player_id}`,
        type: 'Player',
      })),
      ...teams.map(t => ({
        label: t.team_name,
        url: `/teams/${t.team_id}`,
        type: 'Team',
      })),
      ...refs.map(r => ({
        label: r.full_name,
        url: `/refs/${r.ref_id}`,
        type: 'Referee',
      })),
      { label: 'QB Leaders 2024', url: '/stats/qb-leaders', type: 'Stats' },
      { label: 'RB Leaders 2024', url: '/stats/rb-leaders', type: 'Stats' },
      { label: 'Settings', url: '/profile/settings', type: 'Utility' },
      { label: 'Subscribe to Premium', url: '/subscribe', type: 'Utility' },
      { label: 'Fantasy Compare Tool', url: '/compare', type: 'Utility' },
      { label: 'Draft HQ', url: '/draft', type: 'Utility' },
    ];

    return {
      statusCode: 200,
      body: JSON.stringify(index),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load search index', details: err.message }),
    };
  }
};
