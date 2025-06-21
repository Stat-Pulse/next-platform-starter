// File: netlify/functions/getTeams.js
const mysql = require("mysql2/promise");

exports.handler = async function () {
  try {
    const connection = await mysql.createConnection({
      host: "stat-pulse-analytics-db.ci1uue2w2sxp.us-east-1.rds.amazonaws.com",
      user: "StatadminPULS3",
      password: "wyjGiz-justo6-gesmyh",
      database: "nfl_analytics",
    });

    const [rows] = await connection.execute(`
      SELECT team_id, team_name, abbreviation
      FROM Teams
    `);

    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify(
        rows.map((row) => ({
          team_id: row.team_id,
          team_name: row.team_name,
          abbreviation: row.abbreviation,
        }))
      ),
    };
  } catch (err) {
    console.error("DB error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Database error" }),
    };
  }
};
