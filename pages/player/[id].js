// pages/player/[id].js

import Head from 'next/head';
import Image from 'next/image';
import mysql from 'mysql2/promise';

export async function getServerSideProps({ params }) {
  const playerId = params.id;
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // Pull bio + team + roster + contract
    const [playerRows] = await connection.execute(`
      SELECT p.player_id, p.player_name, p.position, p.team_id,
             r.jersey_number, r.status, r.headshot_url, r.years_exp, r.college,
             r.height, r.weight, r.draft_club, r.draft_number, r.rookie_year,
             c.contract_type, c.year AS contract_year, c.avg_annual_value
      FROM Players p
      LEFT JOIN Rosters r ON p.player_id = r.player_id
      LEFT JOIN Contracts c ON p.player_id = c.player_id
      WHERE p.player_id = ?
      LIMIT 1;
    `, [playerId]);

    if (playerRows.length === 0) {
      return { notFound: true };
    }

    const player = playerRows[0];

    // Pull game logs
    const [gameLogs] = await connection.execute(`
      SELECT game_id, week, passing_yards, passing_touchdowns,
             rushing_yards, rushing_touchdowns, receiving_yards, receiving_touchdowns,
             fumbles
      FROM Player_Stats_Game
      WHERE player_id = ?
      ORDER BY week ASC
    `, [playerId]);

    // Pull injury history
    const [injuries] = await connection.execute(`
      SELECT report_date, injury_description, status
      FROM Injuries
      WHERE player_id = ?
      ORDER BY report_date DESC
    `, [playerId]);

    await connection.end();

    return {
      props: {
        player,
        gameLogs,
        injuries,
      },
    };
  } catch (err) {
    console.error('❌ Error fetching player data:', err);
    return { notFound: true };
  }
}

export default function PlayerProfilePage({ player, gameLogs, injuries }) {
  return (
    <>
      <Head>
        <title>{player.player_name} | StatPulse</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4">
          {player.headshot_url && (
            <Image src={player.headshot_url} alt={player.player_name} width={100} height={100} className="rounded-full" />
          )}
          <div>
            <h1 className="text-3xl font-bold">{player.player_name}</h1>
            <p className="text-gray-600">{player.position} | #{player.jersey_number} | Team ID: {player.team_id}</p>
            <p className="text-gray-500">College: {player.college} | Drafted: {player.draft_club} #{player.draft_number} ({player.rookie_year})</p>
            <p className="text-gray-400">Years Pro: {player.years_exp} | Height: {player.height} | Weight: {player.weight} lbs</p>
          </div>
        </div>

        <hr className="my-6" />

        <section>
          <h2 className="text-xl font-semibold mb-2">2024 Season Game Logs</h2>
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Week</th>
                <th className="p-2 border">Pass Yds</th>
                <th className="p-2 border">Pass TDs</th>
                <th className="p-2 border">Rush Yds</th>
                <th className="p-2 border">Rush TDs</th>
                <th className="p-2 border">Rec Yds</th>
                <th className="p-2 border">Rec TDs</th>
                <th className="p-2 border">Fumbles</th>
              </tr>
            </thead>
            <tbody>
              {gameLogs.map((g, i) => (
                <tr key={i} className="text-center">
                  <td className="p-2 border">{g.week}</td>
                  <td className="p-2 border">{g.passing_yards}</td>
                  <td className="p-2 border">{g.passing_touchdowns}</td>
                  <td className="p-2 border">{g.rushing_yards}</td>
                  <td className="p-2 border">{g.rushing_touchdowns}</td>
                  <td className="p-2 border">{g.receiving_yards}</td>
                  <td className="p-2 border">{g.receiving_touchdowns}</td>
                  <td className="p-2 border">{g.fumbles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Contract Info</h2>
          {player.contract_type ? (
            <p>
              {player.contract_type} - {player.contract_year} - ${player.avg_annual_value?.toLocaleString()} avg/year
            </p>
          ) : (
            <p>No contract info available.</p>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Injury History</h2>
          {injuries.length > 0 ? (
            <ul className="list-disc ml-6">
              {injuries.map((injury, i) => (
                <li key={i}>
                  {injury.report_date}: {injury.injury_description} ({injury.status})
                </li>
              ))}
            </ul>
          ) : (
            <p>No reported injuries.</p>
          )}
        </section>
      </div>
    </>
  );
}
