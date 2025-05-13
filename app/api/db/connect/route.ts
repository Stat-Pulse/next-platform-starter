import { NextResponse } from 'next/server';
     import mysql from 'mysql2/promise';

     export async function GET() {
       let connection;
       try {
         // Connect to the RDS database using environment variables
         connection = await mysql.createConnection({
           host: process.env.DB_HOST,
           user: process.env.DB_USER,
           password: process.env.DB_PASSWORD,
           database: process.env.DB_NAME,
         });

         // Test query: Fetch up to 10 rows from the users table
         const [rows] = await connection.execute('SELECT * FROM users LIMIT 10');

         // Return the results as JSON
         return NextResponse.json({
           success: true,
           data: rows,
         });
       } catch (error) {
         // Handle errors (e.g., connection failure)
         return NextResponse.json(
           {
             success: false,
             error: error instanceof Error ? error.message : 'Unknown error',
           },
           { status: 500 }
         );
       } finally {
         // Close the connection
         if (connection) {
           await connection.end();
         }
       }
     }
