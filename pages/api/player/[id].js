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
        p.draft_year,
        p.draft_team,
        p.draft_round,
        p.draft_overall,
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
      LEFT JOIN Teams t ON r.team = t.team_abbr
      WHERE p.player_id = ?
      `,
      [req.query.id]
    );

    console.log("Query complete. Sending response...");
    res.status(200).json({ player: player[0], seasonStats: [] });

  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}