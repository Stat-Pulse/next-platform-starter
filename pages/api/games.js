// pages/api/games.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const season = req.query.season || '2024'; // default to 2024

  let conn;
  try {
    conn = await mysql.createConnection({
      host:     process.env.DB_HOST,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // You can expand this query for more filters as needed
    const [rows] = await conn.execute(
      `SELECT
        game_id, season, game_type, week, gameday, weekday, gametime,
        away_team, away_score, home_team, home_score, location, result, total, overtime,
        away_moneyline, home_moneyline, spread_line, away_spread_odds, home_spread_odds,
        total_line, under_odds, over_odds, div_game, roof, surface, temp, wind,
        referee
       FROM nfl_game_results
       WHERE season = ?
       ORDER BY week, gameday, gametime`,
      [season]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error('[api/games] Error:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    if (conn) await conn.end();
  }
}