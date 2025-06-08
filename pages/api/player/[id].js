import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  console.log("API HIT:", req.query.id);

  try {
    console.log("Connecting to DB...");
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000  // 10 second timeout
    });

    console.log("Running player query...");
    const [player] = await connection.execute(
      `
      SELECT
        p.player_id,
        p.player_name,
        p.position,
        p.college,
        lc.draft_year,
        lc.draft_team,
        lc.draft_round,
        lc.draft_overall,
        p.date_of_birth,
        p.height_inches,
        p.weight_pounds,
        p.is_active,
        r.team AS team_abbr,
        p.headshot_url,
        lc.year_signed      AS contract_year,
        lc.years            AS contract_length,
        lc.value            AS contract_value,
        lc.apy              AS contract_apy,
        lc.guaranteed       AS contract_guaranteed,
        lc.apy_cap_pct      AS contract_apy_cap_pct,
        t.primary_color,
        t.secondary_color,
        t.team_logo_espn
      FROM Players p
      LEFT JOIN Rosters_2025 r ON p.player_id = r.gsis_id
      LEFT JOIN Latest_Contracts lc ON p.player_id = lc.player_id
      LEFT JOIN Teams t ON r.team COLLATE utf8mb4_0900_ai_ci = t.team_abbr
      WHERE p.player_id = ?
      `,
      [req.query.id]
    );
    
    // Receiving Career Totals
const [receivingCareer] = await connection.execute(`
  SELECT
    COUNT(*) AS games,
    SUM(receiving_yards) AS yards,
    SUM(receiving_tds) AS tds
  FROM Player_Stats_Game_All
  WHERE player_id = ? AND receiving_yards IS NOT NULL
`, [req.query.id]);

// Rushing Career Totals
const [rushingCareer] = await connection.execute(`
  SELECT
    COUNT(*) AS games,
    SUM(rushing_yards) AS yards,
    SUM(rushing_tds) AS tds
  FROM Player_Stats_Game_All
  WHERE player_id = ? AND rushing_yards IS NOT NULL
`, [req.query.id]);

// Passing Career Totals
const [passingCareer] = await connection.execute(`
  SELECT
    COUNT(*) AS games,
    SUM(completions) AS completions,
    SUM(attempts) AS attempts,
    SUM(passing_yards) AS yards,
    SUM(passing_tds) AS tds,
    SUM(interceptions) AS ints
  FROM Player_Stats_Game_All
  WHERE player_id = ? AND passing_yards IS NOT NULL
`, [req.query.id]);

// Attach to player object
player[0].career = receivingCareer[0];
player[0].rushingCareer = rushingCareer[0];
player[0].passingCareer = passingCareer[0];

const seasonStatsQuery = `
  SELECT season, 
         SUM(receiving_yards) AS receiving_yards,
         SUM(receiving_tds) AS receiving_tds,
         SUM(rushing_yards) AS rushing_yards,
         SUM(rushing_tds) AS rushing_tds,
         SUM(passing_yards) AS passing_yards,
         SUM(passing_tds) AS passing_tds,
         SUM(passing_ints) AS interceptions
  FROM (
    ${[...Array(15).keys()].map(i => {
      const year = 2010 + i;
      return `SELECT season, receiving_yards, receiving_tds, rushing_yards, rushing_tds, passing_yards, passing_tds, passing_ints
              FROM Player_Stats_${year}
              WHERE player_id = ?`;
    }).join('\nUNION ALL\n')}
  ) AS combined
  GROUP BY season
  ORDER BY season ASC
`;

const [seasonStats] = await connection.query(seasonStatsQuery, Array(15).fill(req.query.id));

    console.log("Query complete. Sending response...");
    res.status(200).json({
      player: player[0],
      seasonStats,
      receivingMetrics: [],
      rushingMetrics: [],
      passingMetrics: [],
      advancedMetrics: [],
      advancedRushing: [],
      advancedPassing: []
    });

    
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
