import Head from 'next/head';
import Image from 'next/image';
import mysql from 'mysql2/promise';

const TEAM_NAME_MAP = {
  ARI: "Arizona Cardinals", ATL: "Atlanta Falcons", BAL: "Baltimore Ravens", BUF: "Buffalo Bills",
  CAR: "Carolina Panthers", CHI: "Chicago Bears", CIN: "Cincinnati Bengals", CLE: "Cleveland Browns",
  DAL: "Dallas Cowboys", DEN: "Denver Broncos", DET: "Detroit Lions", GB: "Green Bay Packers",
  HOU: "Houston Texans", IND: "Indianapolis Colts", JAX: "Jacksonville Jaguars", KC: "Kansas City Chiefs",
  LAC: "Los Angeles Chargers", LAR: "Los Angeles Rams", LV: "Las Vegas Raiders", MIA: "Miami Dolphins",
  MIN: "Minnesota Vikings", NE: "New England Patriots", NO: "New Orleans Saints", NYG: "New York Giants",
  NYJ: "New York Jets", PHI: "Philadelphia Eagles", PIT: "Pittsburgh Steelers", SEA: "Seattle Seahawks",
  SF: "San Francisco 49ers", TB: "Tampa Bay Buccaneers", TEN: "Tennessee Titans", WAS: "Washington Commanders"
};

const slugToAbbreviation = {
  bills: 'BUF', dolphins: 'MIA', patriots: 'NE', jets: 'NYJ',
  ravens: 'BAL', bengals: 'CIN', browns: 'CLE', steelers: 'PIT',
  texans: 'HOU', colts: 'IND', jaguars: 'JAX', titans: 'TEN',
  broncos: 'DEN', chiefs: 'KC', raiders: 'LV', chargers: 'LAC',
  cowboys: 'DAL', giants: 'NYG', eagles: 'PHI', commanders: 'WSH',
  bears: 'CHI', lions: 'DET', packers: 'GB', vikings: 'MIN',
  falcons: 'ATL', panthers: 'CAR', saints: 'NO', buccaneers: 'TB',
  cardinals: 'ARI', rams: 'LAR', '49ers': 'SF', seahawks: 'SEA'
};

export default function TeamPage({ teamData, error }) {
  if (error || !teamData) {
    return <div className="p-6 text-center text-red-500">Error: {error || 'No team data'}</div>;
  }

  const {
    name = 'Unknown Team',
    branding = { logo: '/placeholder.png', colorPrimary: '#ccc' },
    conference = 'Unknown',
    division = 'Unknown',
    roster = [],
    depthChart = {},
    schedule = [],
    stats = {},
    recentNews = []
  } = teamData;

  const formatDate = date => new Date(date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });

  const calculateRecord = () => {
    const wins = schedule.filter(g => g.result === 'W').length;
    const losses = schedule.filter(g => g.result === 'L').length;
    const ties = schedule.filter(g => g.result === 'T').length;
    return ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
  };

  return (
    <>
      <Head>
        <title>{name} - StatPulse</title>
      </Head>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-6 mb-8 border-b pb-4" style={{ borderColor: branding.colorPrimary }}>
          <Image src={branding.logo} alt={name} width={100} height={100} className="rounded shadow" />
          <div>
            <h1 className="text-3xl font-bold" style={{ color: branding.colorPrimary }}>{name}</h1>
            <p className="text-gray-600">{conference} | {division} Division</p>
            <p className="text-lg font-semibold mt-1">Record: {calculateRecord()}</p>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2" style={{ color: branding.colorPrimary }}>Game Schedule</h2>
          {schedule.length === 0 ? (
            <p className="text-gray-600">No games found for this team.</p>
          ) : (
            <table className="w-full text-sm table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Week</th>
                  <th className="border p-2">Opponent</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Home/Away</th>
                  <th className="border p-2">Score</th>
                  <th className="border p-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((g, i) => (
                  <tr key={i}>
                    <td className="border p-2 text-center">{g.week}</td>
                    <td className="border p-2 text-center">{TEAM_NAME_MAP[g.opponent] || g.opponent}</td>
                    <td className="border p-2 text-center">{formatDate(g.date)}</td>
                    <td className="border p-2 text-center">{g.homeAway}</td>
                    <td className="border p-2 text-center">{g.score}</td>
                    <td className="border p-2 text-center">{g.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2" style={{ color: branding.colorPrimary }}>Depth Chart</h2>
          {Object.keys(depthChart).length === 0 ? (
            <p className="text-gray-600">No depth chart data available.</p>
          ) : (
            Object.entries(depthChart).map(([pos, players]) => (
              <div key={pos} className="mb-3">
                <h3 className="text-lg font-bold">{pos}</h3>
                <ul className="ml-4 list-disc text-sm">
                  {players.map((p, i) => (
                    <li key={i}>{p.name} <span className="text-gray-400">(Depth: {p.depth})</span></li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Roster</h2>
          {roster.length === 0 ? (
            <p className="text-gray-600">No roster data available.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-right">Position</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((player, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2 text-left">{player.name}</td>
                    <td className="p-2 text-right">{player.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Defensive Stats (2024)</h2>
          {Object.keys(stats).length === 0 ? (
            <p className="text-gray-600">No defensive stats available.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Points Allowed:</strong> {stats.pointsAllowed || '-'}</div>
              <div><strong>Total Yards Allowed:</strong> {stats.totalYardsAllowed || '-'}</div>
              <div><strong>Pass Yards Allowed:</strong> {stats.passYardsAllowed || '-'}</div>
              <div><strong>Rush Yards Allowed:</strong> {stats.rushYardsAllowed || '-'}</div>
              <div><strong>Sacks:</strong> {stats.sacks || '-'}</div>
              <div><strong>Turnovers:</strong> {stats.turnovers || '-'}</div>
              <div><strong>Red Zone %:</strong> {stats.redZonePct || '-'}</div>
              <div><strong>3rd Down %:</strong> {stats.thirdDownPct || '-'}</div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  let { team } = params;
  if (!team) {
    console.error('TeamPage: Missing team parameter', { time: new Date().toISOString() });
    return { props: { error: 'Missing team parameter' } };
  }

  console.error('TeamPage: Raw team parameter', { team });
  team = slugToAbbreviation[team.toLowerCase()] || team.toUpperCase();
  console.error('TeamPage: Mapped team', { team });

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 5000,
    });

    console.error('TeamPage: Querying team', { team, time: new Date().toISOString() });

    const [teamRows] = await connection.execute(
      `SELECT t.team_name, t.team_abbr, t.division, t.conference,
              b.team_color, b.team_color2, b.team_logo_espn, b.team_logo_wikipedia
       FROM Teams t
       LEFT JOIN Teams_2024 b ON t.team_abbr = b.team_abbr
       WHERE t.team_abbr = ?`,
      [team]
    );

    if (!teamRows.length) {
      console.error('TeamPage: Team not found', { team });
      return { props: { error: 'Team not found' } };
    }
    const teamRow = teamRows[0];

    const [roster] = await connection.execute(
      `SELECT gsis_id AS id, full_name AS name, position, headshot_url, years_exp
       FROM Rosters_2024
       WHERE team = ? AND week = (SELECT MAX(week) FROM Rosters_2024 WHERE team = ?)`,
      [team, team]
    );

    const [depthRows] = await connection.execute(
      `SELECT position, full_name, depth_team
       FROM Depth_Charts_2024
       WHERE club_code = ? AND week = (SELECT MAX(week) FROM Depth_Charts_2024 WHERE club_code = ?)
       ORDER BY depth_team ASC`,
      [team, team]
    );
    const depthChart = {};
    for (const row of depthRows) {
      if (!depthChart[row.position]) depthChart[row.position] = [];
      depthChart[row.position].push({ name: row.full_name, depth: row.depth_team });
    }

    const [schedule] = await connection.execute(
      `SELECT game_id, week, game_date AS date,
              home_team_id, away_team_id, home_score, away_score, is_final
       FROM Games
       WHERE home_team_id = ? OR away_team_id = ?
       ORDER BY game_date ASC`,
      [team, team]
    );
    console.error('TeamPage: Schedule query result', { team, scheduleLength: schedule.length });

    const formattedGames = schedule.length > 0 ? schedule.map(g => {
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
        result
      };
    }) : [
      // Fallback data for testing
      {
        gameId: 'test-1',
        week: 1,
        date: '2024-09-08',
        opponent: 'BUF',
        homeAway: 'H',
        score: 'TBD',
        result: ''
      }
    ];

    const [statsRows] = await connection.execute(
      `SELECT games_played, points_allowed, total_yards_allowed, pass_yards_allowed,
              rush_yards_allowed, turnovers, interceptions, sacks, red_zone_pct,
              third_down_pct, epa_per_play_allowed, dvoa_rank
       FROM Team_Defense_Stats_2024
       WHERE team_id = ?`,
      [team]
    );
    console.error('TeamPage: Stats query result', { team, statsRowsLength: statsRows.length });
    const statsRow = statsRows[0] || {};
    const stats = statsRows.length > 0 ? {
      gamesPlayed: statsRow.games_played || 0,
      pointsAllowed: statsRow.points_allowed || 0,
      totalYardsAllowed: statsRow.total_yards_allowed || 0,
      passYardsAllowed: statsRow.pass_yards_allowed || 0,
      rushYardsAllowed: statsRow.rush_yards_allowed || 0,
      turnovers: statsRow.turnovers || 0,
      interceptions: statsRow.interceptions || 0,
      sacks: statsRow.sacks || 0,
      redZonePct: statsRow.red_zone_pct || 0,
      thirdDownPct: statsRow.third_down_pct || 0,
      epaPerPlayAllowed: statsRow.epa_per_play_allowed || 0,
      dvoaRank: statsRow.dvoa_rank || null
    } : {
      // Fallback data for testing
      gamesPlayed: 0,
      pointsAllowed: 0,
      totalYardsAllowed: 0,
      passYardsAllowed: 0,
      rushYardsAllowed: 0,
      turnovers: 0,
      interceptions: 0,
      sacks: 0,
      redZonePct: 0,
      thirdDownPct: 0,
      epaPerPlayAllowed: 0,
      dvoaRank: null
    };

    const teamData = {
      id: team,
      name: teamRow.team_name,
      abbreviation: teamRow.team_abbr,
      division: teamRow.division,
      conference: teamRow.conference,
      branding: {
        colorPrimary: teamRow.team_color || '#ccc',
        colorSecondary: teamRow.team_color2,
        logo: teamRow.team_logo_espn || teamRow.team_logo_wikipedia || '/placeholder.png'
      },
      roster,
      depthChart,
      schedule: formattedGames,
      stats,
      recentNews: [
        {
          title: `${teamRow.team_name} preparing for upcoming matchup`,
          date: new Date().toISOString().split('T')[0]
        }
      ]
    };

    return { props: { teamData } };
  } catch (error) {
    console.error('TeamPage: Server error', { team, message: error.message, stack: error.stack });
    return { props: { error: error.message } };
  } finally {
    if (connection) await connection.end();
  }
}
