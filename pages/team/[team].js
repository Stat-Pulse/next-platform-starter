// pages/team/[team].js

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import mysql from 'mysql2/promise';

const slugToAbbreviation = {
  cardinals: 'ARI',
  falcons: 'ATL',
  ravens: 'BAL',
  bills: 'BUF',
  panthers: 'CAR',
  bears: 'CHI',
  bengals: 'CIN',
  browns: 'CLE',
  cowboys: 'DAL',
  broncos: 'DEN',
  lions: 'DET',
  packers: 'GB',
  texans: 'HOU',
  colts: 'IND',
  jaguars: 'JAX',
  chiefs: 'KC',
  raiders: 'LV',
  chargers: 'LAC',
  rams: 'LAR',
  dolphins: 'MIA',
  vikings: 'MIN',
  patriots: 'NE',
  saints: 'NO',
  giants: 'NYG',
  jets: 'NYJ',
  eagles: 'PHI',
  steelers: 'PIT',
  '49ers': 'SF',
  seahawks: 'SEA',
  buccaneers: 'TB',
  titans: 'TEN',
  commanders: 'WAS',
};

const TEAM_NAME_MAP = {
  ARI: "Arizona Cardinals",
  BUF: "Buffalo Bills",
  KC: "Kansas City Chiefs",
  // Add others as needed
};

export default function TeamPage({ teamData, injuries = [], error }) {
  const [activeTab, setActiveTab] = useState('home');

  if (error || !teamData) {
    return <div className="p-6 text-center text-red-500">Error: {error || 'No team data'}</div>;
  }

  const { name, abbreviation, branding, record, schedule, stats } = teamData;

  const formatDate = (date) => {
    const parsed = new Date(date);
    return isNaN(parsed) ? 'TBD' : parsed.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const recentGame = schedule.length > 0 ? schedule[0] : null;

  return (
    <>
      <Head><title>{name} - StatPulse</title></Head>
      <div className="min-h-screen bg-gray-100">
        <header
          className="bg-white shadow p-4 flex flex-col sm:flex-row items-center gap-6"
          style={{ borderBottom: `4px solid ${branding.colorPrimary}` }}
        >
          <Image src={branding.logo} alt={`${name} logo`} width={100} height={100} className="rounded" />
          <div>
            <h1 className="text-2xl font-bold" style={{ color: branding.colorPrimary }}>{name}</h1>
            <p className="text-gray-600">Record: {record}</p>
          </div>
        </header>

        <nav className="bg-gray-800 text-gray-300 p-2">
          <ul className="flex flex-wrap space-x-2 sm:space-x-4">
            {['home', 'depth-chart', 'schedule', 'injuries', 'transactions'].map((tab) => (
              <li key={tab}
                className={`px-4 py-2 cursor-pointer rounded-t-md ${activeTab === tab ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'home' ? 'Home' : tab.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </li>
            ))}
          </ul>
        </nav>

        <main className="p-6 max-w-6xl mx-auto">
          {activeTab === 'home' && (
            <div className="space-y-8">
              {/* Recent Result */}
              <section className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Recent Result</h2>
                {recentGame ? (
                  <div className="flex flex-col sm:flex-row justify-between items-center">
                    <div>
                      <p><strong>Opponent:</strong> {TEAM_NAME_MAP[recentGame.opponent] || recentGame.opponent}</p>
                      <p><strong>Date:</strong> {formatDate(recentGame.date)}</p>
                      <p><strong>Score:</strong> {recentGame.score}</p>
                      <p><strong>Result:</strong> {recentGame.result}</p>
                    </div>
                    <button onClick={() => setActiveTab('schedule')} className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                      View Full Schedule
                    </button>
                  </div>
                ) : (
                  <p>No recent games found.</p>
                )}
              </section>

              {/* Key Stats */}
              {stats && (
                <section className="bg-white p-4 rounded shadow">
                  <h2 className="text-xl font-semibold mb-4">Key Team Stats</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div><strong>Points Allowed:</strong> {stats.points_allowed}</div>
                    <div><strong>Yards Allowed:</strong> {stats.total_yards_allowed}</div>
                    <div><strong>Sacks:</strong> {stats.sacks}</div>
                    <div><strong>Turnovers:</strong> {stats.turnovers}</div>
                    <div><strong>Red Zone %:</strong> {stats.red_zone_pct ? `${(stats.red_zone_pct * 100).toFixed(1)}%` : 'N/A'}</div>
                    <div><strong>3rd Down %:</strong> {stats.third_down_pct ? `${(stats.third_down_pct * 100).toFixed(1)}%` : 'N/A'}</div>
                    <div><strong>DVOA Rank:</strong> {stats.dvoa_rank}</div>
                  </div>
                </section>
              )}

              {/* Injuries Snapshot */}
              <section className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Injury Snapshot</h2>
                {injuries.length > 0 ? injuries.map((inj, i) => (
                  <div key={i} className="border-b py-2">
                    <p><strong>{inj.player_name}</strong></p>
                    <p className="text-gray-700">{inj.injury_description} - {inj.status}</p>
                    <p className="text-sm text-gray-500">{inj.report_date}</p>
                  </div>
                )) : <p>No injuries reported.</p>}
              </section>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== 'home' && (
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">{activeTab.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</h2>
              <p>Content for the {activeTab} tab is coming soon.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  let { team } = params;
  if (!team) return { props: { error: 'Missing team parameter' } };

  team = slugToAbbreviation[team.toLowerCase()] || team.toUpperCase();

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [[teamRow]] = await connection.execute(
      `SELECT t.team_name, t.team_abbr, b.team_logo_espn AS logo,
              b.team_color AS colorPrimary, b.team_color2 AS colorSecondary
       FROM Teams t
       LEFT JOIN Teams_2024 b ON t.team_abbr = b.team_abbr
       WHERE t.team_abbr = ?`,
      [team]
    );

    const [gameRows] = await connection.execute(
      `SELECT game_id, week, game_date AS date,
              home_team_id, away_team_id, home_score, away_score, is_final
       FROM Games
       WHERE (home_team_id = ? OR away_team_id = ?) AND is_final = 1
       ORDER BY game_date DESC
       LIMIT 1`,
      [team, team]
    );

    const schedule = gameRows.map((g) => {
      const isHome = g.home_team_id === team;
      const opponent = isHome ? g.away_team_id : g.home_team_id;
      const score = g.is_final ? `${g.home_score} - ${g.away_score}` : 'TBD';
      const result = g.is_final ? ((isHome && g.home_score > g.away_score) || (!isHome && g.away_score > g.home_score)) ? 'W' : 'L' : '';
      return { gameId: g.game_id, week: g.week, date: g.date, opponent, homeAway: isHome ? 'H' : 'A', score, result };
    });

    const record = `${schedule.filter(g => g.result === 'W').length}-${schedule.filter(g => g.result === 'L').length}`;

    const [[stats = null]] = await connection.execute(
      `SELECT points_allowed, total_yards_allowed, sacks, turnovers, red_zone_pct, third_down_pct, dvoa_rank
       FROM Team_Defense_Stats_2024
       WHERE team_id = ? AND season = 2024`,
      [team]
    );

    const [injuries] = await connection.execute(
      `SELECT i.player_id, i.injury_description, i.status, i.report_date, p.player_name
       FROM Injuries i
       JOIN Players p ON i.player_id = p.player_id
       JOIN Rosters_2024 r ON p.first_name = r.first_name AND p.last_name = r.last_name
       WHERE r.team = ?
       ORDER BY i.report_date DESC
       LIMIT 5`,
      [team]
    );

    return {
      props: {
        teamData: {
          name: teamRow.team_name,
          abbreviation: teamRow.team_abbr,
          branding: {
            logo: teamRow.logo || '/placeholder.png',
            colorPrimary: teamRow.colorPrimary || '#ccc',
            colorSecondary: teamRow.colorSecondary || '#000',
          },
          record,
          schedule,
          stats,
        },
        injuries,
      },
    };
  } catch (err) {
    console.error('Error fetching team data:', err);
    return { props: { error: err.message } };
  } finally {
    if (connection) await connection.end();
  }
}
