import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const playerId = req.query.id;

    // Fetch player metadata from Active_Player_Profiles
    const [playerRows] = await connection.execute(
      `
      SELECT *
      FROM Active_Player_Profiles
      WHERE player_id = ?
      `,
      [playerId]
    );

    if (!playerRows || playerRows.length === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const player = playerRows[0];

    // Calculate career receiving totals from Player_Stats_2010 to Player_Stats_2024
    const receivingCareerQuery = `
      SELECT
        COUNT(DISTINCT season) AS seasons,
        SUM(receiving_yards) AS yards,
        SUM(receiving_tds) AS tds
      FROM (
        ${[...Array(15).keys()].map(i => {
          const year = 2010 + i;
          return `SELECT season, receiving_yards, receiving_tds
                  FROM Player_Stats_${year}
                  WHERE player_id = ? AND receiving_yards IS NOT NULL`;
        }).join('\nUNION ALL\n')}
      ) AS combined
    `;

    const [receivingCareerRows] = await connection.query(receivingCareerQuery, Array(15).fill(playerId));

    // Calculate career rushing totals
    const rushingCareerQuery = `
      SELECT
        COUNT(DISTINCT season) AS seasons,
        SUM(rushing_yards) AS yards,
        SUM(rushing_epa) AS epa,
        SUM(rushing_tds) AS tds
      FROM (
        ${[...Array(15).keys()].map(i => {
          const year = 2010 + i;
          return `SELECT season, rushing_yards, rushing_epa, rushing_tds
                  FROM Player_Stats_${year}
                  WHERE player_id = ? AND rushing_yards IS NOT NULL`;
        }).join('\nUNION ALL\n')}
      ) AS combined
    `;
    const [rushingCareerRows] = await connection.query(rushingCareerQuery, Array(15).fill(playerId));

    // Calculate career passing totals
    const passingCareerQuery = `
      SELECT
        COUNT(DISTINCT season) AS seasons,
        SUM(passing_yards) AS yards,
        SUM(passing_tds) AS tds,
        SUM(passing_interceptions) AS ints,
        SUM(completions) AS completions,
        SUM(attempts) AS attempts
      FROM (
        ${[...Array(15).keys()].map(i => {
          const year = 2010 + i;
          return `SELECT season, passing_yards, passing_tds, passing_interceptions, completions, attempts
                  FROM Player_Stats_${year}
                  WHERE player_id = ? AND passing_yards IS NOT NULL`;
        }).join('\nUNION ALL\n')}
      ) AS combined
    `;
    const [passingCareerRows] = await connection.query(passingCareerQuery, Array(15).fill(playerId));

    player.career = {
      receiving: receivingCareerRows[0],
      rushing: rushingCareerRows[0],
      passing: passingCareerRows[0]
    };

    // Format large numbers with commas in the final JSON response before sending
    const formatNumber = (val) => (val !== null && val !== undefined ? Number(val).toLocaleString() : null);

    ['receiving', 'rushing', 'passing'].forEach(key => {
      const block = player.career[key];
      if (block) {
        Object.keys(block).forEach(field => {
          block[field] = formatNumber(block[field]);
        });
      }
    });

    const seasonStatsQuery = `
      SELECT season, 
             SUM(receiving_yards) AS receiving_yards,
             SUM(receiving_tds) AS receiving_tds,
             SUM(rushing_yards) AS rushing_yards,
             SUM(rushing_epa) AS epa,
             SUM(rushing_tds) AS rushing_tds,
             SUM(passing_yards) AS passing_yards,
             SUM(passing_tds) AS passing_tds,
             SUM(passing_interceptions) AS interceptions
      FROM (
        ${[...Array(15).keys()].map(i => {
          const year = 2010 + i;
          return `SELECT season, receiving_yards, receiving_tds, rushing_yards, rushing_epa, rushing_tds, passing_yards, passing_tds, passing_interceptions
                  FROM Player_Stats_${year}
                  WHERE player_id = ?`;
        }).join('\nUNION ALL\n')}
      ) AS combined
      GROUP BY season
      ORDER BY season ASC
    `;

    const [seasonStats] = await connection.query(seasonStatsQuery, Array(15).fill(playerId));

    // Attach advanced stats by position
    player.advanced = {};

    if (player.position === 'QB') {
      const [advPassing] = await connection.execute(`
        SELECT
          avg_time_to_throw,
          avg_completed_air_yards,
          avg_intended_air_yards,
          avg_air_yards_differential,
          aggressiveness,
          max_completed_air_distance,
          avg_air_yards_to_sticks,
          passer_rating,
          completion_percentage,
          expected_completion_percentage,
          completion_percentage_above_expectation,
          avg_air_distance,
          max_air_distance
        FROM NextGen_Stats_Passing
        WHERE player_id = ?
      `, [playerId]);

      // Aggregate additional passing stats from Player_Stats_2010-2024
      const additionalPassingQuery = `
        SELECT
          SUM(sacks_suffered) AS sacks_suffered,
          SUM(sack_yards_lost) AS sack_yards_lost,
          SUM(sack_fumbles) AS sack_fumbles,
          SUM(sack_fumbles_lost) AS sack_fumbles_lost,
          SUM(passing_air_yards) AS passing_air_yards,
          SUM(passing_yards_after_catch) AS passing_yac,
          SUM(passing_first_downs) AS passing_first_downs,
          AVG(passing_epa) AS avg_passing_epa,
          AVG(passing_cpoe) AS avg_passing_cpoe
        FROM (
          ${[...Array(15).keys()].map(i => {
            const year = 2010 + i;
            return `SELECT sacks_suffered, sack_yards_lost, sack_fumbles, sack_fumbles_lost,
                           passing_air_yards, passing_yards_after_catch, passing_first_downs,
                           passing_epa, passing_cpoe
                    FROM Player_Stats_${year}
                    WHERE player_id = ? AND passing_yards IS NOT NULL`;
          }).join('\nUNION ALL\n')}
        ) AS combined
      `;
      const [additionalPassingRows] = await connection.query(additionalPassingQuery, Array(15).fill(playerId));

      player.advanced.passing = {
        ...(advPassing[0] || {}),
        additional: additionalPassingRows[0] || null
      };
      player.career.passing.additional = additionalPassingRows[0] || null;

      // Fetch weekly passing metrics for 2024
      /*
      const [passingMetricsRows] = await connection.execute(`
        SELECT week, completions, attempts, pass_yards AS passing_yards,
               pass_touchdowns AS passing_tds, interceptions, completion_percentage,
               expected_completion_percentage, completion_percentage_above_expectation
        FROM Player_Stats_Game_2024
        WHERE player_id = ?
      `, [playerId]);
      player.passingMetrics = passingMetricsRows || [];
      */

      const [passingMetricsRows] = await connection.execute(`
        SELECT week, completions, attempts, pass_yards AS passing_yards,
               pass_touchdowns AS passing_tds, interceptions, completion_percentage,
               expected_completion_percentage, completion_percentage_above_expectation
        FROM NextGen_Stats_Passing
        WHERE player_id = ?
        ORDER BY week ASC
      `, [playerId]);

      player.passingMetrics = passingMetricsRows || [];
      player.advancedPassing = player.advanced.passing || null;
    }

    if (['RB', 'WR'].includes(player.position)) {
      const [advRushing] = await connection.execute(`
        SELECT *
        FROM NextGen_Stats_Rushing
        WHERE player_id = ?
      `, [playerId]);
      player.advanced.rushing = advRushing[0] || null;

      const [rushingMetricsRows] = await connection.execute(`
        SELECT recent_team AS opponent_team, carries, rushing_yards, rushing_tds,
               rushing_fumbles, rushing_fumbles_lost, rushing_first_downs,
               rushing_epa, rushing_2pt_conversions
        FROM Player_Stats_2024
        WHERE player_id = ?
      `, [playerId]);

      player.rushingMetrics = rushingMetricsRows || [];
    }

    if (['WR', 'TE', 'RB'].includes(player.position)) {
      const [advReceiving] = await connection.execute(`
        SELECT *
        FROM NextGen_Stats_Receiving
        WHERE player_gsis_id = ?
      `, [playerId]);
      player.advanced.receiving = advReceiving[0] || null;
    }

    res.status(200).json({
      player,
      seasonStats
    });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    if (connection && connection.end) await connection.end();
  }
}