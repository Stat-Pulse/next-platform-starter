// pages/api/player/[id].js
import mysql from 'mysql2/promise';

// --- FIX: Use a connection pool for performance and stability ---
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default async function handler(req, res) {
  const playerId = req.query.id;

  try {
    // Query 1: Get Player Metadata
    const [meta] = await pool.execute(`SELECT * FROM Active_Player_Profiles WHERE player_id = ?`, [playerId]);
    if (!meta.length) {
      return res.status(404).json({ error: 'Player not found' });
    }
    const player = meta[0];

    // Query 2: Get Weekly Stats
    const [weekly] = await pool.execute(`SELECT * FROM offense_weekly_stats WHERE player_id = ? AND season_type = 'REG' ORDER BY season, CAST(week AS UNSIGNED)`, [playerId]);

    // Query 3: Get Season Stats
    const [seasonStats] = await pool.execute(
        `SELECT season, team, COUNT(week) as games_played,
          SUM(completions) AS completions, SUM(attempts) AS attempts, SUM(passing_yards) AS passing_yards, SUM(passing_tds) AS passing_tds, 
          SUM(interceptions) AS interceptions, -- <-- FIX: Changed alias from passing_interceptions
          SUM(carries) AS carries, SUM(rushing_yards) AS rushing_yards, SUM(rushing_tds) AS rushing_tds,
          SUM(receptions) AS receptions, SUM(targets) AS targets, SUM(receiving_yards) AS receiving_yards, SUM(receiving_tds) AS rec_touchdowns, -- <-- FIX: Changed alias to match front-end
          SUM(def_tackles_solo) AS def_tackles_solo, SUM(def_tds) AS def_tds,
          SUM(fantasy_points) AS fantasy_points, SUM(fantasy_points_ppr) AS fantasy_points_ppr
        FROM offense_weekly_stats WHERE player_id = ? GROUP BY season, team ORDER BY season`, 
      [playerId]
    );

    // --- FIX: Calculate Career stats on the server to save a database query ---
    const career = seasonStats.reduce((acc, season) => {
        Object.keys(season).forEach(key => {
            if (key !== 'season' && key !== 'team' && season[key] !== null) {
                acc[key] = (acc[key] || 0) + season[key];
            }
        });
        return acc;
    }, {});
    
    player.career = {
        seasons: seasonStats.length,
        yards: (career.passing_yards || 0) + (career.rushing_yards || 0) + (career.receiving_yards || 0),
        tds: (career.passing_tds || 0) + (career.rushing_tds || 0) + (career.rec_touchdowns || 0),
        interceptions: career.interceptions || 0,
        // You can add more specific career stats here if needed
        passing: { yards: career.passing_yards, tds: career.passing_tds, interceptions: career.interceptions },
        rushing: { yards: career.rushing_yards, tds: career.rushing_tds },
        receiving: { yards: career.receiving_yards, tds: career.rec_touchdowns },
    };


    res.status(200).json({ player, weekly, seasonStats });

  } catch (err) {
    console.error("API Error for player ID:", playerId, err);
    res.status(500).json({ error: 'Server error' });
  }
  // NOTE: We no longer need a `finally` block to close the connection, as the pool handles it.
}