import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    const connection = await mysql.createConnection({
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
    player.career = receivingCareerRows[0];

    // Calculate career rushing totals
    const rushingCareerQuery = `
      SELECT
        COUNT(DISTINCT season) AS seasons,
        SUM(rushing_yards) AS yards,
        SUM(rushing_tds) AS tds
      FROM (
        ${[...Array(15).keys()].map(i => {
          const year = 2010 + i;
          return `SELECT season, rushing_yards, rushing_tds
                  FROM Player_Stats_${year}
                  WHERE player_id = ? AND rushing_yards IS NOT NULL`;
        }).join('\nUNION ALL\n')}
      ) AS combined
    `;
    const [rushingCareerRows] = await connection.query(rushingCareerQuery, Array(15).fill(playerId));
    player.rushingCareer = rushingCareerRows[0];

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
    player.passingCareer = passingCareerRows[0];

    const seasonStatsQuery = `
      SELECT season, 
             SUM(receiving_yards) AS receiving_yards,
             SUM(receiving_tds) AS receiving_tds,
             SUM(rushing_yards) AS rushing_yards,
             SUM(rushing_tds) AS rushing_tds,
             SUM(passing_yards) AS passing_yards,
             SUM(passing_tds) AS passing_tds,
             SUM(passing_interceptions) AS interceptions
      FROM (
        ${[...Array(15).keys()].map(i => {
          const year = 2010 + i;
          return `SELECT season, receiving_yards, receiving_tds, rushing_yards, rushing_tds, passing_yards, passing_tds, passing_interceptions
                  FROM Player_Stats_${year}
                  WHERE player_id = ?`;
        }).join('\nUNION ALL\n')}
      ) AS combined
      GROUP BY season
      ORDER BY season ASC
    `;

    const [seasonStats] = await connection.query(seasonStatsQuery, Array(15).fill(playerId));

    // Format large numbers with commas in the final JSON response before sending
    const formatNumber = (val) => (val !== null && val !== undefined ? Number(val).toLocaleString() : null);

    if (player.career) {
      player.career.yards = formatNumber(player.career.yards);
      player.career.tds = formatNumber(player.career.tds);
      player.career.seasons = formatNumber(player.career.seasons);
    }

    if (player.rushingCareer) {
      player.rushingCareer.yards = formatNumber(player.rushingCareer.yards);
      player.rushingCareer.tds = formatNumber(player.rushingCareer.tds);
      player.rushingCareer.seasons = formatNumber(player.rushingCareer.seasons);
    }

    if (player.passingCareer) {
      player.passingCareer.yards = formatNumber(player.passingCareer.yards);
      player.passingCareer.tds = formatNumber(player.passingCareer.tds);
      player.passingCareer.ints = formatNumber(player.passingCareer.ints);
      player.passingCareer.completions = formatNumber(player.passingCareer.completions);
      player.passingCareer.attempts = formatNumber(player.passingCareer.attempts);
      player.passingCareer.seasons = formatNumber(player.passingCareer.seasons);
    }

    // Attach advanced stats by position
    if (player.position === 'QB') {
      const [advPassing] = await connection.execute(`
        SELECT *
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

      player.advanced = {
        passing: {
          ...(advPassing[0] || {}),
          additional: additionalPassingRows[0] || null
        }
      };
    } else if (player.position === 'RB') {
      const [advRushing] = await connection.execute(`
        SELECT *
        FROM NextGen_Stats_Rushing
        WHERE player_id = ?
      `, [playerId]);
      player.advanced = { rushing: advRushing[0] || null };
    } else if (['WR', 'TE'].includes(player.position)) {
      const [advReceiving] = await connection.execute(`
        SELECT *
        FROM NextGen_Stats_Receiving
        WHERE player_id = ?
      `, [playerId]);
      player.advanced = { receiving: advReceiving[0] || null };
    } else {
      player.advanced = null;
    }

    res.status(200).json({ player, seasonStats });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}