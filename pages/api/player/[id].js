// pages/api/player/[id].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const playerId = req.query.id;
  const season   = req.query.season || '2024';
  let   conn;

  if (!playerId) return res.status(400).json({ error: 'Missing player id' });

  try {
    conn = await mysql.createConnection({
      host:     process.env.DB_HOST,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [metaRows] = await conn.execute(
      `SELECT * FROM Active_Player_Profiles WHERE player_id = ?`,
      [playerId]
    );

    if (!metaRows.length) return res.status(404).json({ error: 'Player not found' });

    const player = metaRows[0];
    const teamAbbr = player.recent_team || player.team_abbr || player.team || null;

    if (teamAbbr) {
      const [teamRows] = await conn.execute(
        `SELECT primary_color, secondary_color FROM Teams WHERE team_abbr = ? LIMIT 1`,
        [teamAbbr]
      );
      if (teamRows.length) {
        const { primary_color, secondary_color } = teamRows[0];
        if (!player.primary_color) player.primary_color = primary_color;
        if (!player.secondary_color) player.secondary_color = secondary_color;
      }
    }

    const weeklyView = ['QB','RB','WR','TE','FB','K'].includes(player.position)
      ? 'offense_weekly_stats'
      : 'defense_weekly_stats';

    const [weekly] = await conn.execute(
      `SELECT season, week, team, opponent_team,
              completions, attempts, passing_yards, passing_tds, passing_interceptions,
              sacks_suffered AS sacks, sack_yards_lost AS sack_yards, passing_epa,
              carries, rushing_yards, rushing_tds, rushing_epa,
              targets, receptions, receiving_yards, receiving_tds
         FROM ${weeklyView}
        WHERE player_id = ? AND season = ? AND season_type = 'REG'
        ORDER BY CAST(week AS UNSIGNED)`,
      [playerId, season]
    );

    const passingMetrics = weekly.filter(r => +r.attempts > 0).map(r => ({
      ...r, interceptions: r.passing_interceptions
    }));

    const rushingMetrics = weekly.filter(r => +r.carries > 0);

    const receivingMetrics = weekly.filter(r => +r.targets > 0).map(r => ({
      ...r, rec_touchdowns: r.receiving_tds
    }));

    const [careerTotals] = await conn.execute(
      `SELECT COUNT(DISTINCT season) AS seasons_played,
              SUM(passing_yards) AS pass_yards, SUM(passing_tds) AS pass_tds,
              SUM(passing_interceptions) AS ints, SUM(completions) AS completions,
              SUM(attempts) AS attempts, SUM(rushing_yards) AS rush_yards,
              SUM(rushing_tds) AS rush_tds, SUM(receiving_yards) AS rec_yards,
              SUM(receiving_tds) AS rec_tds
         FROM ${weeklyView}
        WHERE player_id = ?`,
      [playerId]
    );

    player.career = {
      passing: {
        seasons: careerTotals[0].seasons_played,
        yards: careerTotals[0].pass_yards,
        tds: careerTotals[0].pass_tds,
        ints: careerTotals[0].ints,
        completions: careerTotals[0].completions,
        attempts: careerTotals[0].attempts,
      },
      rushing: {
        seasons: careerTotals[0].seasons_played,
        yards: careerTotals[0].rush_yards,
        tds: careerTotals[0].rush_tds,
      },
      receiving: {
        seasons: careerTotals[0].seasons_played,
        yards: careerTotals[0].rec_yards,
        tds: careerTotals[0].rec_tds,
      },
    };

    const [advRecv] = await conn.execute(
      `SELECT avg_cushion, percent_share_of_intended_air_yards
         FROM NextGen_Stats_Receiving
        WHERE player_gsis_id = ? AND season = ?`,
      [playerId, season]
    );

    const [advRush] = await conn.execute(
      `SELECT rushing_yards_over_expected, rushing_epa
         FROM NextGen_Stats_Rushing
        WHERE player_id = ? AND season = ?`,
      [playerId, season]
    );

    const [advPass] = await conn.execute(
      `SELECT avg_time_to_throw, passer_rating
         FROM NextGen_Stats_Passing
        WHERE player_id = ? AND season = ?`,
      [playerId, season]
    );

    res.status(200).json({
      player,
      passingMetrics,
      rushingMetrics,
      receivingMetrics,
      advancedMetrics: advRecv[0] || {},
      advancedRushing: advRush[0] || {},
      advancedPassing: advPass[0] || {},
    });

  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    if (conn) await conn.end();
  }
}
