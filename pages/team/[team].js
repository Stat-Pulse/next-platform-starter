import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import mysql from 'mysql2/promise';

const TEAM_NAME_MAP = {
  ARI: "Arizona Cardinals",
  BUF: "Buffalo Bills",
  // Add other mappings as needed
};

const slugToAbbreviation = {
  cardinals: 'ARI',
  bills: 'BUF',
  // Add other team mappings as needed
};

export default function TeamPage({ teamData, error }) {
  const [activeTab, setActiveTab] = useState('home');

  if (error || !teamData) {
    return <div className="p-6 text-center text-red-500">Error: {error || 'No team data'}</div>;
  }

  const { name, abbreviation, branding, record, schedule } = teamData;

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime())
      ? 'TBD'
      : parsedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Mocked Data (used as fallback if database fails)
  const mockNews = {
    headline: `${name} Prepares for Crucial Matchup`,
    date: '2025-05-18',
    summary: 'The team is focusing on improving their defense ahead of their next game against a tough opponent.',
  };

  const mockStats = {
    pointsPerGame: { value: 24.5, rank: 12 },
    yardsPerGame: { value: 350.2, rank: 15 },
    turnoverMargin: { value: +3, rank: 8 },
    sacks: { value: 42, rank: 5 },
  };

  const mockPlayerHighlights = [
    {
      id: 'offense-1',
      name: 'John Doe',
      position: 'QB',
      category: 'Offense',
      stats: 'Threw for 300 yards and 3 TDs in Week 17',
    },
    {
      id: 'defense-1',
      name: 'Jane Smith',
      position: 'LB',
      category: 'Defense',
      stats: 'Recorded 2 sacks and an interception in Week 17',
    },
    {
      id: 'special-1',
      name: 'Mike Johnson',
      position: 'K',
      category: 'Special Teams',
      stats: 'Kicked a game-winning 50-yard FG in Week 17',
    },
  ];

  const mockInjury = {
    player: 'James Wilson',
    position: 'WR',
    injury: 'Hamstring',
    status: 'Out for Week 18',
    date: '2025-05-15',
  };

  const mockPowerRanking = {
    rank: 5,
    movement: 2, // Positive means moved up
  };

  const mockBlurb = `${name} are coming off a strong performance, showing resilience on defense while their offense continues to find its rhythm. With key players stepping up, they’re poised for a playoff push.`;

  // Determine Recent Result (using the schedule passed from getServerSideProps)
  const recentGame = schedule.length > 0 ? schedule[0] : null;

  return (
    <>
      <Head>
        <title>{name} - StatPulse</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        {/* Consistent Header */}
        <header
          className="bg-white shadow p-4 flex flex-col sm:flex-row items-center gap-6"
          style={{ borderBottom: `4px solid ${branding.colorPrimary || '#ccc'}` }}
        >
          <Image
            src={branding.logo || '/placeholder.png'}
            alt={`${name} logo`}
            width={100}
            height={100}
            className="rounded"
          />
          <div>
            <h1 className="text-2xl font-bold" style={{ color: branding.colorPrimary || '#000' }}>
              {name}
            </h1>
            <p className="text-gray-600">Record: {record}</p>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="bg-gray-800 text-gray-300 p-2">
          <ul className="flex flex-wrap space-x-2 sm:space-x-4">
            {['home', 'depth-chart', 'schedule', 'injuries', 'transactions'].map((tab) => (
              <li
                key={tab}
                className={`px-4 py-2 cursor-pointer transition-all duration-200 rounded-t-md ${
                  activeTab === tab ? 'bg-red-600 text-white' : 'hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'home' ? 'Home' : tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="p-6 max-w-6xl mx-auto">
          {activeTab === 'home' && (
            <div className="space-y-8">
              {/* Team Bio, Location, Stadium, Win-Loss Records */}
              <section className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Team Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Bio:</strong> N/A</p>
                    <p><strong>Location:</strong> N/A</p>
                    <p><strong>Stadium:</strong> N/A</p>
                    <p><strong>Overall Win-Loss:</strong> N/A</p>
                  </div>
                  <div>
                    <p><strong>Regular Season Win-Loss:</strong> N/A</p>
                    <p><strong>Postseason Win-Loss:</strong> N/A</p>
                    <p><strong>Conference Championships:</strong> N/A</p>
                    <p><strong>Super Bowl Appearances/Wins:</strong> N/A</p>
                  </div>
                </div>
              </section>

              {/* Featured News/Top Story */}
              <section className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Featured News</h2>
                <div className="border-l-4 pl-4" style={{ borderColor: branding.colorPrimary || '#ccc' }}>
                  <h3 className="text-lg font-bold">{mockNews.headline}</h3>
                  <p className="text-sm text-gray-500">{mockNews.date}</p>
                  <p className="mt-2 text-gray-700">{mockNews.summary}</p>
                </div>
              </section>

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
                    <button
                      onClick={() => setActiveTab('schedule')}
                      className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
                    >
                      View Full Schedule
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-700">No recent games available.</p>
                )}
              </section>

              {/* Key Team Stats Highlights */}
              <section className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Key Team Stats</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-2 border rounded">
                    <p><strong>Points Per Game:</strong> {mockStats.pointsPerGame.value}</p>
                    <p className="text-sm text-gray-500">Rank: {mockStats.pointsPerGame.rank}</p>
                  </div>
                  <div className="p-2 border rounded">
                    <p><strong>Yards Per Game:</strong> {mockStats.yardsPerGame.value}</p>
                    <p className="text-sm text-gray-500">Rank: {mockStats.yardsPerGame.rank}</p>
                  </div>
                  <div className="p-2 border rounded">
                    <p><strong>Turnover Margin:</strong> {mockStats.turnoverMargin.value}</p>
                    <p className="text-sm text-gray-500">Rank: {mockStats.turnoverMargin.rank}</p>
                  </div>
                  <div className="p-2 border rounded">
                    <p><strong>Sacks:</strong> {mockStats.sacks.value}</p>
                    <p className="text-sm text-gray-500">Rank: {mockStats.sacks.rank}</p>
                  </div>
                </div>
              </section>

              {/* Recent Player Highlights */}
              <section className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Recent Player Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {mockPlayerHighlights.map((player) => (
                    <Link key={player.id} href={`/player/${player.id}`}>
                      <div className="p-2 border rounded hover:bg-gray-50 transition-all">
                        <p><strong>{player.name}</strong> ({player.position}, {player.category})</p>
                        <p className="text-sm text-gray-700">{player.stats}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Injury Snapshot */}
              <section className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Injury Snapshot</h2>
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div>
                    <p><strong>{mockInjury.player}</strong> ({mockInjury.position})</p>
                    <p className="text-gray-700">{mockInjury.injury} - {mockInjury.status}</p>
                    <p className="text-sm text-gray-500">{mockInjury.date}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('injuries')}
                    className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
                  >
                    View All Injuries
                  </button>
                </div>
              </section>

              {/* Power Ranking */}
              <section className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Power Ranking</h2>
                <p>
                  <strong>Rank:</strong> #{mockPowerRanking.rank}{' '}
                  <span className={`text-sm ${mockPowerRanking.movement > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ({mockPowerRanking.movement > 0 ? '+' : ''}{mockPowerRanking.movement} from last week)
                  </span>
                </p>
              </section>

              {/* Brief Team Overview/Blurb */}
              <section className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Team Summary</h2>
                <p className="text-gray-700">{mockBlurb}</p>
              </section>
            </div>
          )}

          {/* Placeholder for Other Tabs */}
          {activeTab !== 'home' && (
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-4">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}</h2>
              <p className="text-gray-700">Content for the {activeTab.replace('-', ' ')} tab coming soon.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  let { team } = params;
  if (!team) {
    return { props: { error: 'Missing team parameter' } };
  }

  team = slugToAbbreviation[team.toLowerCase()] || team.toUpperCase();

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 5000,
    });

    // Debug: Log the connection parameters
    console.log('Connecting to DB with:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
    });

    const [teamRows] = await connection.execute(
      `SELECT t.team_name, t.team_abbr, t.division, t.conference,
              b.team_color AS colorPrimary, b.team_color2 AS colorSecondary, b.team_logo_espn AS logo
       FROM Teams t
       LEFT JOIN Teams_2024 b ON t.team_abbr = b.team_abbr
       WHERE t.team_abbr = ?`,
      [team]
    );

    if (!teamRows.length) {
      throw new Error(`No team found for team_abbr: ${team}`);
    }

    const teamRow = teamRows[0];

    const [gameRows] = await connection.execute(
      `SELECT game_id, week, game_date AS date,
              home_team_id, away_team_id, home_score, away_score, is_final
       FROM Games
       WHERE (home_team_id = ? OR away_team_id = ?) AND is_final = 1
       ORDER BY game_date DESC
       LIMIT 1`,
      [team, team]
    );

    const schedule = gameRows.length > 0 ? gameRows.map((g) => {
      const isHome = g.home_team_id === team;
      const opponent = isHome ? g.away_team_id : g.home_team_id;
      const score = g.is_final ? `${g.home_score} - ${g.away_score}` : 'TBD';
      const result = g.is_final
        ? (isHome && g.home_score > g.away_score) || (!isHome && g.away_score > g.home_score)
          ? 'W' : 'L'
        : '';
      return {
        gameId: g.game_id,
        week: g.week,
        date: g.date,
        opponent: opponent || 'TBD',
        homeAway: isHome ? 'H' : 'A',
        score,
        result,
      };
    }) : [];

    const record = schedule.length > 0
      ? `${schedule.filter(g => g.result === 'W').length}-${schedule.filter(g => g.result === 'L').length}`
      : '0-0';

    return {
      props: {
        teamData: {
          name: teamRow.team_name || 'Unknown Team',
          abbreviation: teamRow.team_abbr,
          branding: {
            logo: teamRow.logo || '/placeholder.png',
            colorPrimary: teamRow.colorPrimary || '#ccc',
            colorSecondary: teamRow.colorSecondary || '#000',
          },
          record,
          schedule,
        },
      },
    };
  } catch (error) {
    console.error('TeamPage: Server error', { team, message: error.message, stack: error.stack });
    return { props: { error: `Server error: ${error.message}` } };
  } finally {
    if (connection) await connection.end();
  }
}
