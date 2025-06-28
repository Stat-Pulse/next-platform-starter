// pages/api/depth-chart.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const { team, viewMode, season } = req.query; // team, viewMode (current, projected, historical), season (for historical)

  if (!team) {
    return res.status(400).json({ error: 'Missing team parameter.' });
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    let depthData = {};
    let playersFetched = new Set(); // To avoid fetching player info multiple times

    // Helper to fetch player details from Rosters_2025
    // This helper might not be strictly necessary if player details are directly joined in the main query
    const fetchPlayerDetails = async (playerId) => {
      if (playersFetched.has(playerId)) return null; // Already fetched
      playersFetched.add(playerId);

      const [playerRows] = await connection.execute(
        `SELECT full_name, jersey_number, headshot_url
         FROM Rosters_2025
         WHERE gsis_id = ?`,
        [playerId]
      );
      return playerRows[0] || null;
    };

    switch (viewMode) {
      case 'current':
        // Fetch current depth chart (latest week of 2025 season)
        const [currentDepthRows] = await connection.execute(
          `SELECT
             dc.position,
             dc.player_id,
             dc.depth_rank,
             r.full_name AS player_name,
             r.jersey_number,
             r.headshot_url
           FROM Depth_Charts dc
           JOIN Rosters_2025 r ON r.gsis_id = dc.player_id AND r.season = dc.season
           WHERE dc.team = ?
             AND dc.season = 2025 -- Assuming current depth chart is for 2025
             AND dc.week = (SELECT MAX(week) FROM Depth_Charts WHERE team = ? AND season = 2025)
           ORDER BY dc.position, dc.depth_rank ASC`,
          [team, team]
        );

        for (const row of currentDepthRows) {
          if (!depthData[row.position]) depthData[row.position] = [];
          depthData[row.position].push({
            player_id: row.player_id,
            player_name: row.player_name,
            jersey_number: row.jersey_number,
            headshot_url: row.headshot_url,
            depth_rank: row.depth_rank,
            // Add other relevant player details here if available and needed
          });
        }
        break;

      case 'projected':
        // Placeholder for projected depth chart logic
        // This would require a database table or a sophisticated projection model.
        // For now, return an empty object or a specific message.
        depthData = { message: "Projected depth chart data is not yet available." };
        // Example:
        // const [projectedDepthRows] = await connection.execute(
        //   `SELECT ... FROM Projected_Depth_Charts WHERE team = ? AND season = ?`,
        //   [team, season_for_projection]
        // );
        break;

      case 'historical':
        if (!season) {
          await connection.end();
          return res.status(400).json({ error: 'Missing season parameter for historical view.' });
        }
        // Fetch historical depth chart for a specific season (latest week of that season)
        const [historicalDepthRows] = await connection.execute(
          `SELECT
             dc.position,
             dc.player_id,
             dc.depth_rank,
             r.full_name AS player_name,
             r.jersey_number,
             r.headshot_url
           FROM Depth_Charts dc
           JOIN Rosters_2025 r ON r.gsis_id = dc.player_id AND r.season = dc.season -- Assuming Rosters_2025 has all player data
           WHERE dc.team = ?
             AND dc.season = ?
             AND dc.week = (SELECT MAX(week) FROM Depth_Charts WHERE team = ? AND season = ?)
           ORDER BY dc.position, dc.depth_rank ASC`,
          [team, season, team, season]
        );

        for (const row of historicalDepthRows) {
          if (!depthData[row.position]) depthData[row.position] = [];
          depthData[row.position].push({
            player_id: row.player_id,
            player_name: row.player_name,
            jersey_number: row.jersey_number,
            headshot_url: row.headshot_url,
            depth_rank: row.depth_rank,
          });
        }
        break;

      default:
        await connection.end();
        return res.status(400).json({ error: 'Invalid viewMode parameter.' });
    }

    // Add a mock unit_strength for chart display if not available from your DB.
    // Ideally, this would also come from your database or be calculated.
    if (Object.keys(depthData).length > 0 && !depthData.unit_strength) {
      depthData.unit_strength = {
          QB: 85, RB: 75, WR: 90, OL: 80, DL: 70, LB: 65, DB: 85, ST: 70
      };
    }

    await connection.end();
    res.status(200).json(depthData);

  } catch (error) {
    console.error('Error fetching depth chart:', error);
    if (connection) await connection.end();
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
