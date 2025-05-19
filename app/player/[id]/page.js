// app/player/[id]/page.js

import mysql from 'mysql2/promise';
import Image from 'next/image';

export default async function PlayerPage({ params }) {
  const playerId = params?.id;
  if (!playerId) {
    return <main className="p-6"><h1>Missing player ID</h1></main>;
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 5000,
    });

    const [playerRows] = await connection.execute(
      `SELECT 
        R.gsis_id AS player_id,
        R.full_name AS player_name,
        R.position,
        R.team,
        R.jersey_number,
        R.status,
        R.headshot_url,
        R.years_exp,
        R.college,
        R.draft_club,
        R.draft_number,
        R.rookie_year
       FROM Rosters_2024 R
       WHERE R.gsis_id = ?
       LIMIT 1`,
      [playerId]
    );

    const [careerStats] = await connection.execute(
      `SELECT
        season_override AS season,
        SUM(passing_yards) AS passing_yards,
        SUM(rushing_yards) AS rushing_yards,
        SUM(receiving_yards) AS receiving_yards,
        SUM(passing_tds + rushing_tds + receiving_tds) AS total_tds,
        SUM(fantasy_points_ppr) AS fantasy_points_ppr
       FROM Player_Stats_Game_All
       WHERE player_id = ?
       GROUP BY season_override
       ORDER BY season_override DESC`,
      [playerId]
    );

    await connection.end();

    const player = playerRows[0] || null;
    if (!player) {
      return <main className="p-6"><h1>Player Not Found</h1></main>;
    }

    return (
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Player Bio */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex gap-6">
          {player.headshot_url && (
            <Image
              src={player.headshot_url}
              alt={player.player_name}
              width={160}
              height={160}
              className="rounded-xl"
            />
          )}

          <div>
            <h1 className="text-3xl font-bold">{player.player_name}</h1>
            <p className="text-gray-600">{player.position} | {player.team}</p>
            <p className="mt-2 text-sm">Jersey #{player.jersey_number}</p>
            <p className="text-sm">Status: {player.status}</p>
            <p className="text-sm">Experience: {player.years_exp} years</p>
            <p className="text-sm">College: {player.college}</p>
            <p className="text-sm">
              Drafted by {player.draft_club || 'N/A'} — Pick #{player.draft_number || 'N/A'} in {player.rookie_year || 'N/A'}
            </p>
          </div>
        </div>

        {/* Career Stats */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Career Stats by Season</h2>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Season</th>
                <th className="p-2 text-right">Pass Yards</th>
                <th className="p-2 text-right">Rush Yards</th>
                <th className="p-2 text-right">Recv Yards</th>
                <th className="p-2 text-right">TDs</th>
                <th className="p-2 text-right">PPR Points</th>
              </tr>
            </thead>
            <tbody>
              {careerStats.map((season) => (
                <tr key={season.season} className="border-t">
                  <td className="p-2">{season.season}</td>
                  <td className="p-2 text-right">{season.passing_yards || 0}</td>
                  <td className="p-2 text-right">{season.rushing_yards || 0}</td>
                  <td className="p-2 text-right">{season.receiving_yards || 0}</td>
                  <td className="p-2 text-right">{season.total_tds || 0}</td>
                  <td className="p-2 text-right">{season.fantasy_points_ppr?.toFixed(2) || '0.00'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl text-red-600 font-semibold">Error</h1>
        <p className="text-sm text-gray-700">{error.message}</p>
      </main>
    );
  } finally {
    if (connection) await connection.end();
  }
}
