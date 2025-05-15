// File: netlify/functions/saveProfile.js

const mysql = require('mysql2/promise');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const body = JSON.parse(event.body || '{}');
  const {
    username,
    email,
    subscription,
    avatar,
    favoriteTeams,
    favoritePlayers,
    points,
    badges,
    leaderboardRank
  } = body;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Use INSERT ... ON DUPLICATE KEY UPDATE for upsert behavior
    const query = `
      INSERT INTO Users (username, email, subscription, avatar, favoriteTeams, favoritePlayers, points, badges, leaderboardRank)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        subscription = VALUES(subscription),
        avatar = VALUES(avatar),
        favoriteTeams = VALUES(favoriteTeams),
        favoritePlayers = VALUES(favoritePlayers),
        points = VALUES(points),
        badges = VALUES(badges),
        leaderboardRank = VALUES(leaderboardRank)
    `;

    await connection.execute(query, [
      username,
      email,
      subscription,
      avatar,
      JSON.stringify(favoriteTeams),
      JSON.stringify(favoritePlayers),
      points,
      JSON.stringify(badges),
      leaderboardRank
    ]);

    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('[saveProfile] DB Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Database save failed', details: error.message })
    };
  }
};
