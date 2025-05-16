// pages/player/[id].js
import React from 'react';
import mysql from 'mysql2/promise';

export default function PlayerPage({ player, error }) {
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!player) {
    return <div>Player not found</div>;
  }

  return (
    <div>
      <h1>{player.player_name || 'Unknown Player'}</h1>
      <p>Position: {player.position || 'N/A'}</p>
      <p>College: {player.college || 'N/A'}</p>
      <p>Draft Year: {player.draft_year || 'N/A'}</p>
      <p>Date of Birth: {player.date_of_birth || 'N/A'}</p>
      <p>Height: {player.height_inches ? `${player.height_inches} inches` : 'N/A'}</p>
      <p>Weight: {player.weight ? `${player.weight} lbs` : 'N/A'}</p>
      <p>Status: {player.is_active ? 'Active' : 'Inactive'}</p>
      <p>Team ID: {player.team_id || 'N/A'}</p>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  let connection;
  try {
    // Connect to the MySQL database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Query the Players table for the given player_id
    const [rows] = await connection.execute('SELECT * FROM Players WHERE player_id = ?', [params.id]);

    // Close the connection
    await connection.end();

    // Check if player exists
    if (!rows || rows.length === 0) {
      return {
        notFound: true, // Trigger Next.js 404 page
      };
    }

    // Return the player data
    return {
      props: {
        player: rows[0], // First row contains the player data
      },
    };
  } catch (error) {
    console.error('Error fetching player:', error);
    if (connection) await connection.end();
    return {
      props: {
        error: 'Failed to load player data',
      },
    };
  }
}
