// netlify/functions/getRosterSchema.js
const mysql = require('mysql2/promise');

exports.handler = async function () {
  let conn;
  try {
    conn = await mysql.createConnection({
      host:     process.env.DB_HOST,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [columns] = await conn.execute(`DESCRIBE Rosters_2024;`);
    await conn.end();

    return {
      statusCode: 200,
      body: JSON.stringify(columns, null, 2),
    };
  } catch (err) {
    if (conn) await conn.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};