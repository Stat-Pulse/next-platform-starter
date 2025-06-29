// pages/api/depth-chart.js
import mysql from 'mysql2/promise';

// Create a single, reusable connection pool.
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
  const { team, viewMode } = req.query;
  let season = req.query.season;

  if (!team) {
    return res.status(400).json({ error: 'Missing team parameter.' });
  }

  if (viewMode === 'projected') {
    return res.status(200).json({ message: "Projected depth chart data is not yet available." });
  }

  try {
    if (viewMode === 'current') {
      // Dynamically find the latest season for the given team
      const [[{ max_season }]] = await pool.execute(
        `SELECT MAX(season) AS max_season FROM Depth_Charts WHERE team = ?`,
        [team]
      );
      if (!max_season) {
        return res.status(200).json({ message: `No data found for team ${team}.` });
      }
      season = max_season;
    }

    if (!season) {
      return res.status(400).json({ error: 'Missing season parameter for historical view.' });
    }

    // Find the latest week for the given team and season
    const [[{ max_week }]] = await pool.execute(
      `SELECT MAX(week) AS max_week FROM Depth_Charts WHERE team = ? AND season = ?`,
      [team, season]
    );

    let depthData = {};

    if (max_week === null) {
      depthData = { message: `No depth chart data found for ${team} in Season ${season}.` };
    } else {
        // --- THIS IS THE CORRECTED QUERY ---
        // It now joins Depth_Charts with your single 'Rosters' table
        // on both player_id and season for accurate historical data.
        const [depthRows] = await pool.execute(
            `SELECT
               dc.position,
               dc.player_id,
               dc.depth_rank,
               r.full_name AS player_name,
               r.jersey_number,
               r.headshot_url
             FROM Depth_Charts dc
             JOIN Rosters r ON r.gsis_id = dc.player_id AND r.season = dc.season
             WHERE dc.team = ?
               AND dc.season = ?
               AND dc.week = ?
             ORDER BY dc.position, dc.depth_rank ASC`,
            [team, season, max_week]
        );

        // Process rows into the depthData object
        for (const row of depthRows) {
            if (!depthData[row.position]) depthData[row.position] = [];
            depthData[row.position].push({
                player_id: row.player_id,
                player_name: row.player_name,
                jersey_number: row.jersey_number,
                headshot_url: row.headshot_url,
                depth_rank: row.depth_rank,
            });
        }
    }

    // Add mock unit_strength if data was found
    if (Object.keys(depthData).length > 0 && !depthData.message) {
      depthData.unit_strength = { QB: 85, RB: 75, WR: 90, OL: 80, DL: 70, LB: 65, DB: 85, ST: 70 };
    }

    res.status(200).json(depthData);

  } catch (error) {
    console.error('❌ API Error fetching depth chart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}