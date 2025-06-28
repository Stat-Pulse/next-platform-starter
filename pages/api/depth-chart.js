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

    switch (viewMode) {
      case 'current':
        const currentDataSeason = 2024; // *** FIX: Changed to 2024 as per DB data ***
        
        // Step 1: Find the maximum week for the current team and season
        const [maxWeekRowsCurrent] = await connection.execute(
          `SELECT MAX(week) AS max_week FROM Depth_Charts WHERE team COLLATE utf8mb4_unicode_ci = ? AND season = ?`,
          [team, currentDataSeason]
        );
        const maxWeekCurrent = maxWeekRowsCurrent[0].max_week;

        console.log(`Backend Log: Current View - Max week for ${team} (Season ${currentDataSeason}): ${maxWeekCurrent}`);

        if (maxWeekCurrent === null) {
          depthData = { message: `No depth chart data found for ${team} in Season ${currentDataSeason}.` };
        } else {
          // Step 2: Fetch depth chart data using the found max week
          const [currentDepthRows] = await connection.execute(
            `SELECT
               dc.position,
               dc.player_id,
               dc.depth_rank,
               r.full_name AS player_name,
               r.jersey_number,
               r.headshot_url
             FROM Depth_Charts dc
             JOIN Rosters_2025 r ON r.gsis_id COLLATE utf8mb4_unicode_ci = dc.player_id -- *** FIX: Removed AND r.season = dc.season ***
             WHERE dc.team COLLATE utf8mb4_unicode_ci = ?
               AND dc.season = ?
               AND dc.week = ?
             ORDER BY dc.position, dc.depth_rank ASC`,
            [team, currentDataSeason, maxWeekCurrent]
          );

          console.log(`Backend Log: Current View - Raw depth rows fetched for ${team} (Week ${maxWeekCurrent}, Season ${currentDataSeason}):`, currentDepthRows);

          for (const row of currentDepthRows) {
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
        break;

      case 'projected':
        depthData = { message: "Projected depth chart data is not yet available." };
        console.log(`Backend Log: Projected View requested for ${team}. Returning placeholder.`);
        break;

      case 'historical':
        if (!season) {
          await connection.end();
          return res.status(400).json({ error: 'Missing season parameter for historical view.' });
        }
        
        // Step 1: Find the maximum week for the historical team and season
        const [maxWeekRowsHistorical] = await connection.execute(
          `SELECT MAX(week) AS max_week FROM Depth_Charts WHERE team COLLATE utf8mb4_unicode_ci = ? AND season = ?`,
          [team, season]
        );
        const maxWeekHistorical = maxWeekRowsHistorical[0].max_week;

        console.log(`Backend Log: Historical View - Max week for ${team} (Season ${season}): ${maxWeekHistorical}`);

        if (maxWeekHistorical === null) {
          depthData = { message: `No depth chart data found for ${team} in Season ${season}.` };
        } else {
          // Step 2: Fetch historical depth chart data using the found max week
          const [historicalDepthRows] = await connection.execute(
            `SELECT
               dc.position,
               dc.player_id,
               dc.depth_rank,
               r.full_name AS player_name,
               r.jersey_number,
               r.headshot_url
             FROM Depth_Charts dc
             JOIN Rosters_2025 r ON r.gsis_id COLLATE utf8mb4_unicode_ci = dc.player_id -- *** FIX: Removed AND r.season = dc.season ***
             WHERE dc.team COLLATE utf8mb4_unicode_ci = ?
               AND dc.season = ?
               AND dc.week = ?
             ORDER BY dc.position, dc.depth_rank ASC`,
            [team, season, maxWeekHistorical]
          );
          console.log(`Backend Log: Historical View - Raw depth rows fetched for ${team} (Week ${maxWeekHistorical}, Season ${season}):`, historicalDepthRows);

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
        }
        break;

      default:
        await connection.end();
        return res.status(400).json({ error: 'Invalid viewMode parameter.' });
    }

    // Add a mock unit_strength for chart display if not available from your DB.
    if (Object.keys(depthData).filter(key => key !== 'message').length > 0 && !depthData.unit_strength) {
      depthData.unit_strength = {
          QB: 85, RB: 75, WR: 90, OL: 80, DL: 70, LB: 65, DB: 85, ST: 70
      };
      console.log(`Backend Log: Added mock unit_strength.`);
    } else if (Object.keys(depthData).filter(key => key !== 'message').length === 0 && !depthData.message) {
        // If depthData is empty and there's no specific message, set a generic "no data" message
        depthData.message = `No depth chart data found for ${team} in the selected view/season.`;
        console.log(`Backend Log: Set generic "no data" message for ${team}.`);
    }

    await connection.end();
    res.status(200).json(depthData);

  } catch (error) {
    console.error('❌ API Error fetching depth chart:', error);
    if (connection) await connection.end();
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
