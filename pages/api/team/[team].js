// pages/api/team/[team].js
import mysql from 'mysql2/promise';
import teams from '../../../data/teams';

export default async function handler(req, res) {
  const { team } = req.query;
  if (!team || typeof team !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid team ID' });
  }

  const slugToAbbreviation = {
    bills: 'BUF', dolphins: 'MIA', patriots: 'NE', jets: 'NYJ',
    ravens: 'BAL', bengals: 'CIN', browns: 'CLE', steelers: 'PIT',
    texans: 'HOU', colts: 'IND', jaguars: 'JAX', titans: 'TEN',
    broncos: 'DEN', chiefs: 'KC', raiders: 'LV', chargers: 'LAC',
    cowboys: 'DAL', giants: 'NYG', eagles: 'PHI', commanders: 'WSH',
    bears: 'CHI', lions: 'DET', packers: 'GB', vikings: 'MIN',
    falcons: 'ATL', panthers: 'CAR', saints: 'NO', buccaneers: 'TB',
    cardinals: 'ARI', rams: 'LAR', '49ers': 'SF', seahawks: 'SEA',
  };

  const teamId = slugToAbbreviation[team.toLowerCase()];
  if (!teamId) {
    return res.status(404).json({ error: 'Team slug could not be resolved' });
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [teamRows] = await connection.execute(
      `SELECT t.team_name, t.team_abbr, t.division, t.conference,
              b.team_color, b.team_color2, b.team_logo_espn, b.team_logo_wikipedia
       FROM Teams t
       LEFT JOIN Teams_2024 b ON t.team_id = b.team_abbr
       WHERE t.team_id = ?`,
      [teamId]
    );
    if (!teamRows.length) {
      await connection.end();
      return res.status(404).json({ error: 'Team not found' });
    }
    const teamRow = teamRows[0];

    const [roster] = await connection.execute(
      `SELECT gsis_id AS id, full_name AS name, position, headshot_url, years_exp
       FROM Rosters_2024
       WHERE team = ? AND week = (SELECT MAX(week) FROM Rosters_2024 WHERE team = ?)`,
      [teamId, teamId]
    );

    const [depthRows] = await connection.execute(
      `SELECT position, full_name, depth_team
       FROM Depth_Charts_2024
       WHERE club_code = ? AND week = (SELECT MAX(week) FROM Depth_Charts_2024 WHERE club_code = ?)
       ORDER BY depth_team ASC`,
      [teamId, teamId]
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
      [teamId, teamId]
    );

    const formattedGames = schedule.map(g => {
      const isHome = g.home_team_id === teamId;
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
    });

    const [statsRows] = await connection.execute(
      `SELECT * FROM Team_Defense_Stats_2024 WHERE team_id = ?`,
      [teamId]
    );
    const statsRow = statsRows[0] || {};
    const stats = {
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
    };

    await connection.end();

    return res.status(200).json({
      id: teamId,
      name: teamRow.team_name,
      abbreviation: teamRow.team_abbr,
      division: teamRow.division,
      conference: teamRow.conference,
      branding: {
        colorPrimary: teamRow.team_color,
        colorSecondary: teamRow.team_color2,
        logo: teamRow.team_logo_espn || teamRow.team_logo_wikipedia
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
    });

  } catch (err) {
    console.error('❌ API error:', err);
    if (connection) await connection.end();
    return res.status(500).json({ error: 'Internal server error' });
  }
}
