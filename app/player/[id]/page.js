import mysql from 'mysql2/promise';
import fs from 'fs/promises';

export default async function PlayerPage({ params }) {
  const logMessage = (message, data) => {
    console.error(`PlayerPage: ${message}`, data);
    // Attempt to log to file (may not persist in Netlify)
    try {
      fs.appendFile('/tmp/player.log', `${new Date().toISOString()} ${message} ${JSON.stringify(data)}\n`);
    } catch (e) {
      console.error('PlayerPage: File log error', { message: e.message });
    }
  };

  try {
    logMessage('Starting execution', { playerId: params?.id });
    const playerId = params?.id;
