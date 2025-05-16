// netlify/functions/getSchema.js
const mysql = require('mysql2/promise');

exports.handler = async function () {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Run the DESCRIBE or SHOW COLUMNS command
    const [columns] = await connection.execute(`DESCRIBE Players;`);
    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify(columns, null, 2),
    };
  } catch (err) {
    if (connection) await connection.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
