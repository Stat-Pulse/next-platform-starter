import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import mysql from 'mysql2/promise';
import teamDefenseData from '../../data/team_defense_2024.json';
import teamOffenseData from '../../data/team_offense_2024.json';

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
  ATL: "Atlanta Falcons",
  BAL: "Baltimore Ravens",
  BUF: "Buffalo Bills",
  CAR: "Carolina Panthers",
  CHI: "Chicago Bears",
  CIN: "Cincinnati Bengals",
  CLE: "Cleveland Browns",
  DAL: "Dallas Cowboys",
  DEN: "Denver Broncos",
  DET: "Detroit Lions",
  GB: "Green Bay Packers",
  HOU: "Houston Texans",
  IND: "Indianapolis Colts",
  JAX: "Jacksonville Jaguars",
  KC: "Kansas City Chiefs",
  LV: "Las Vegas Raiders",
  LAC: "Los Angeles Chargers",
  LAR: "Los Angeles Rams",
  MIA: "Miami Dolphins",
  MIN: "Minnesota Vikings",
  NE: "New England Patriots",
  NO: "New Orleans Saints",
  NYG: "New York Giants",
  NYJ: "New York Jets",
  PHI: "Philadelphia Eagles",
  PIT: "Pittsburgh Steelers",
  SF: "San Francisco 49ers",
  SEA: "Seattle Seahawks",
  TB: "Tampa Bay Buccaneers",
  TEN: "Tennessee Titans",
  WAS: "Washington Commanders",
};

// Map team names to abbreviations for JSON lookup
const teamNameToAbbrMap = {
  "Arizona Cardinals": "ARI",
  "Atlanta Falcons": "ATL",
  "Baltimore Ravens": "BAL",
  "Buffalo Bills": "BUF",
  "Carolina Panthers": "CAR",
  "Chicago Bears": "CHI",
  "Cincinnati Bengals": "CIN",
  "Cleveland Browns": "CLE",
  "Dallas Cowboys": "DAL",
  "Denver Broncos": "DEN",
  "Detroit Lions": "DET",
  "Green Bay Packers": "GB",
  "Houston Texans": "HOU",
  "Indianapolis Colts": "IND",
  "Jacksonville Jaguars": "JAX",
  "Kansas City Chiefs": "KC",
  "Las Vegas Raiders": "LV",
  "Los Angeles Chargers": "LAC",
  "Los Angeles Rams": "LAR",
  "Miami Dolphins": "MIA",
  "Minnesota Vikings": "MIN",
  "New England Patriots": "NE",
  "New Orleans Saints": "NO",
  "New York Giants": "NYG",
  "New York Jets": "NYJ",
  "Philadelphia Eagles": "PHI",
  "Pittsburgh Steelers": "PIT",
  "San Francisco 49ers": "SF",
  "Seattle Seahawks": "SEA",
  "Tampa Bay Buccaneers": "TB",
  "Tennessee Titans": "TEN",
  "Washington Commanders": "WAS"
};

export default function TeamPage({ teamData, injuries = [], error, defenseStats, offenseStats }) {
  const [activeTab, setActiveTab] = useState('home');

  if (error || !teamData) {
    return <div className="p-6 text-center text-red-500">Error: {error || 'No team data'}</div>;
  }

  const { name, abbreviation, branding, record, schedule } = teamData;

  const formatDate = (date) => {
    if (!date || typeof date !== 'string') return 'TBD'; // Ensure date is a string
    const parsed = new Date(date + 'T00:00:00Z'); // Force UTC
    if (!isNaN(parsed)) {
      return parsed.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
    return date; // Fallback to raw date string
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
                      <p>
                        <strong>Opponent:</strong> {TEAM_NAME_MAP[recentGame.opponent] || recentGame.opponent}
                        {recentGame.homeAway === 'H' ? ' (Home)' : ' (Away)'}
                      </p>
                      <p><strong>Date:</strong> {formatDate(recentGame.date)}</p>
                      <p>
                        <strong>Score:</strong>{' '}
                        {recentGame.homeAway === 'H' ? (
                          <>
                            {name.split(' ').pop()} {recentGame.score.split(' - ')[0]} - {TEAM_NAME_MAP[recentGame.opponent] || recentGame.opponent} {recentGame.score.split(' - ')[1]}
                          </>
                        ) : (
                          <>
                            {TEAM_NAME_MAP[recentGame.opponent] || recentGame.opponent} {recentGame.score.split(' - ')[0]} - {name.split(' ').pop()} {recentGame.score.split(' - ')[1]}
                          </>
                        )}
                      </p>
                      <p>
                        <strong>Result:</strong>{' '}
                        <span className={recentGame.result === 'W' ? 'text-green-600' : 'text-red-600'}>
                          {recentGame.result === 'W' ? 'Win' : 'Loss'}
                        </span>
                      </p>
                    </div>
                    <button onClick={() => setActiveTab('schedule')} className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                      View Full Schedule
                    </button>
                  </div>
                ) : (
                  <p>No recent games found.</p>
                )}
              </section>

              {/* Key Team Stats */}
              {(defenseStats || offenseStats) ? (
                <section className="bg-white p-4 rounded shadow">
                  <h2 className="text-xl font-semibold mb-4">Key Team Stats</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Defense Stats */}
                    {defenseStats && (
                      <>
                        <div><strong>Points Allowed:</strong> {defenseStats.points_allowed || 'N/A'}</div>
                        <div><strong>Yards Allowed:</strong> {defenseStats.total_yards_allowed || 'N/A'}</div>
                        <div><strong>Sacks (Def):</strong> {defenseStats.sacks || 'N/A'}</div>
                        <div><strong>Turnovers Forced:</strong> {defenseStats.turnovers || 'N/A'}</div>
                        <div><strong>Red Zone Def %:</strong> {defenseStats.red_zone_pct ? `${(defenseStats.red_zone_pct * 100).toFixed(1)}%` : 'N/A'}</div>
                        <div><strong>3rd Down Def %:</strong> {defenseStats.third_down_pct ? `${(defenseStats.third_down_pct * 100).toFixed(1)}%` : 'N/A'}</div>
                        <div><strong>DVOA Rank:</strong> {defenseStats.dvoa_rank || 'N/A'}</div>
                      </>
                    )}
                    {/* Offense Stats */}
                    {offenseStats && (
                      <>
                        <div><strong>Points Scored:</strong> {offenseStats.points_for || 'N/A'}</div>
                        <div><strong>Total Yards:</strong> {offenseStats.total_yards || 'N/A'}</div>
                        <div><strong>Passing Yards:</strong> {offenseStats.passing.yards || 'N/A'}</div>
                        <div><strong>Rushing Yards:</strong> {offenseStats.rushing.yards || 'N/A'}</div>
                        <div><strong>Turnovers (Off):</strong> {offenseStats.turnovers || 'N/A'}</div>
                        <div><strong>QB Rating:</strong> {offenseStats.passing.qb_rating || 'N/A'}</div>
                        <div><strong>Points Per Game:</strong> {offenseStats.points_per_game || 'N/A'}</div>
                      </>
                    )}
                  </div>
                </section>
              ) : (
                <section className="bg-white p-4 rounded shadow">
                  <h2 className="text-xl font-semibold mb-4">Key Team Stats</h2>
                  <p>No stats available for this team.</p>
                </section>
              )}

              {/* Injury Snapshot */}
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
      `SELECT game_id, week, game_date,
              home_team_id, away_team_id, home_score, away_score, is_final
       FROM Games
       WHERE (home_team_id = ? OR away_team_id = ?)
         AND is_final = 1
         AND season_id = 2024
       ORDER BY game_date DESC`,
      [team, team]
    );

    const schedule = gameRows.map((g) => {
      const isHome = g.home_team_id === team;
      const opponent = isHome ? g.away_team_id : g.home_team_id;
      const score = g.is_final ? `${g.home_score} - ${g.away_score}` : 'TBD';
      const result = g.is_final ? ((isHome && g.home_score > g.away_score) || (!isHome && g.away_score > g.home_score)) ? 'W' : 'L' : '';
      const gameDate = g.game_date instanceof Date ? g.game_date.toISOString().split('T')[0] : g.game_date;
      console.log(`Team: ${team}, Game Date: ${gameDate}`); // Debug log
      return { 
        gameId: g.game_id, 
        week: g.week, 
        date: gameDate ? gameDate.toString() : 'TBD', // Ensure date is a string
        opponent, 
        homeAway: isHome ? 'H' : 'A', 
        score, 
        result 
      };
    });

    const wins = schedule.filter(g => g.result === 'W').length;
    const losses = schedule.filter(g => g.result === 'L').length;
    const record = `${wins}-${losses}`;

    const recentGame = schedule.length > 0 ? schedule[0] : null;

    const [injuries] = await connection.execute(
      `SELECT gsis_id AS player_id, report_primary_injury AS injury_description, 
              report_status AS status, date_modified AS report_date, full_name AS player_name
       FROM Injuries
       WHERE team = ?
       ORDER BY date_modified DESC
       LIMIT 5`,
      [team]
    );

    // Fetch defense stats from team_defense_2024.json
    let defenseStats = null;
    const teamName = TEAM_NAME_MAP[team];
    const teamDefenseStats = teamDefenseData.find(data => data.team === teamName);
    if (teamDefenseStats) {
      defenseStats = {
        points_allowed: teamDefenseStats.total_yards_to.points_allowed,
        total_yards_allowed: teamDefenseStats.total_yards_to.yards,
        sacks: teamDefenseStats.advanced_defense.sacks,
        turnovers: teamDefenseStats.total_yards_to.turnovers,
        red_zone_pct: teamDefenseStats.conversions_against.red_zone_percentage / 100,
        third_down_pct: teamDefenseStats.conversions_against.third_down_percentage / 100,
        dvoa_rank: null // Not available in JSON
      };
    }

    // Fetch offense stats from team_offense_2024.json
    let offenseStats = null;
    const teamOffenseStats = teamOffenseData.teams.find(data => data.team_name === teamName);
    if (teamOffenseStats) {
      offenseStats = teamOffenseStats.offense;
    }

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
          schedule: [recentGame],
        },
        defenseStats,
        offenseStats,
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
