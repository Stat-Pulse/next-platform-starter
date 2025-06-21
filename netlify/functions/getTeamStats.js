// netlify/functions/getTeamStats.js
const mysql = require("mysql2/promise");

exports.handler = async function (event) {
  const body = JSON.parse(event.body || "{}");
  const { ids = [], viewMode = "weekly" } = body;

  if (!ids.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing ids array" }),
    };
  }

  try {
    const connection = await mysql.createConnection({
      host: "stat-pulse-analytics-db.ci1uue2w2sxp.us-east-1.rds.amazonaws.com",
      user: "StatadminPULS3",
      password: "wyjGiz-justo6-gesmyh",
      database: "nfl_analytics",
    });

    let rows = [];
    // Example query (adjust based on your Teams table schema)
    if (viewMode === "career") {
      const [res] = await connection.execute(
        `
        SELECT
          T.team_id,
          T.team_name,
          SUM(TS.total_points) AS totalPoints,
          SUM(TS.defensive_yards) AS defensiveYards
        FROM Team_Stats TS
        JOIN Teams T ON TS.team_id = T.team_id
        WHERE T.team_id IN (?)
        GROUP BY T.team_id
      `,
        [ids]
      );
      rows = res.map((row) => ({
        team_id: row.team_id,
        team_name: row.team_name,
        totalPoints: Number(row.totalPoints || 0),
        defensiveYards: Number(row.defensiveYards || 0),
      }));
    }

    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (err) {
    console.error("DB error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Database error" }),
    };
  }
};
