// pages/api/player/[id].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const playerId = req.query.id;
  const season   = req.query.season || '2024';      // default season
  let   conn;

  if (!playerId) {
    return res.status(400).json({ error: 'Missing player id' });
  }

  try {
    /* -------------------------------------------------- *
     *  1)  DB connection                                 *
     * -------------------------------------------------- */
    conn = await mysql.createConnection({
      host:     process.env.DB_HOST,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    /* -------------------------------------------------- *
     *  2)  Core metadata                                 *
     * -------------------------------------------------- */
    const [metaRows] = await conn.execute(
      `SELECT *
         FROM Active_Player_Profiles
        WHERE player_id = ?`,
      [playerId]
    );
    if (!metaRows.length) {
      return res.status(404).json({ error: 'Player not found' });
    }
    const player = metaRows[0];

    /* -------------------------------------------------- *
     *  3)  Attach team colors (fallback to Teams table)  *
     * -------------------------------------------------- */
    const teamAbbr =
      player.recent_team || player.team_abbr || player.team || null;

    if (teamAbbr) {
      const [teamRows] = await conn.execute(
        `SELECT primary_color, secondary_color
           FROM Teams
          WHERE team_abbr = ?
          LIMIT 1`,
        [teamAbbr]
      );
      if (teamRows.length) {
        const { primary_color, secondary_color } = teamRows[0];
        if (!player.primary_color   && primary_color)   player.primary_color   = primary_color;
        if (!player.secondary_color && secondary_color) player.secondary_color = secondary_color;
      }
    }

    /* -------------------------------------------------- *
     *  4)  Weekly view selection                         *
     * -------------------------------------------------- */
    const weeklyView =
      ['QB', 'RB', 'WR', 'TE', 'FB', 'K'].includes(player.position)
        ? 'offense_weekly_stats'
        : 'defense_weekly_stats';

    /* -------------------------------------------------- *
     *  5)  Fetch weekly rows for selected season         *
     * -------------------------------------------------- */
    const [weekly] = await conn.execute(
      `SELECT
        season, week, team, opponent_team,
        completions, attempts,
        passing_yards, passing_tds, passing_interceptions,
        sacks_suffered   AS sacks,
        sack_yards_lost  AS sack_yards,
        passing_air_yards,
        passing_yards_after_catch,
        passing_first_downs,
        passing_epa, passing_cpoe, pacr,
        carries, rushing_yards, rushing_tds, rushing_epa,
        targets, receptions, receiving_yards, receiving_tds, receiving_epa,
        fantasy_points, fantasy_points_ppr
         FROM ${weeklyView}
        WHERE player_id   = ?
          AND season      = ?
          AND season_type = 'REG'
        ORDER BY CAST(week AS UNSIGNED)`,
      [playerId, season]
    );

    const passingMetrics   = weekly
      .filter(r => +r.attempts  > 0)
      .map(r => ({
        ...r,
        interceptions : r.passing_interceptions,
        sacks         : r.sacks,
      }));

    const rushingMetrics   = weekly
      .filter(r => +r.carries   > 0);

    const receivingMetrics = weekly
      .filter(r => +r.targets   > 0)
      .map (r => ({ ...r, rec_touchdowns: r.receiving_tds }));

    /* -------------------------------------------------- *
     *  6)  Career totals from the same weekly view       *
     * -------------------------------------------------- */
    const [careerTotals] = await conn.execute(
      `SELECT
          COUNT(DISTINCT season)                                  AS seasons_played,
          SUM(passing_yards)        AS pass_yards,
          SUM(passing_tds)          AS pass_tds,
          SUM(passing_interceptions)AS ints,
          SUM(completions)          AS completions,
          SUM(attempts)             AS attempts,
          SUM(rushing_yards)        AS rush_yards,
          SUM(rushing_epa)          AS rush_epa,
          SUM(rushing_tds)          AS rush_tds,
          SUM(receiving_yards)      AS rec_yards,
          SUM(receiving_tds)        AS rec_tds
         FROM ${weeklyView}
        WHERE player_id = ?`,
      [playerId]
    );

    player.career = {
      passing: {
        seasons     : careerTotals[0].seasons_played,
        yards       : careerTotals[0].pass_yards,
        tds         : careerTotals[0].pass_tds,
        ints        : careerTotals[0].ints,
        completions : careerTotals[0].completions,
        attempts    : careerTotals[0].attempts,
      },
      rushing: {
        seasons : careerTotals[0].seasons_played,
        yards   : careerTotals[0].rush_yards,
        epa     : careerTotals[0].rush_epa,
        tds     : careerTotals[0].rush_tds,
      },
      receiving: {
        seasons : careerTotals[0].seasons_played,
        yards   : careerTotals[0].rec_yards,
        tds     : careerTotals[0].rec_tds,
      },
    };

    /* -------------------------------------------------- *
     *  7)  Season-by-season aggregates (for dropdown)    *
     * -------------------------------------------------- */
    const [seasonStats] = await conn.execute(
      `SELECT season,
              SUM(passing_yards)        AS passing_yards,
              SUM(passing_tds)          AS passing_tds,
              SUM(passing_interceptions)AS interceptions,
              SUM(rushing_yards)        AS rushing_yards,
              SUM(rushing_tds)          AS rushing_tds,
              SUM(receiving_yards)      AS receiving_yards,
              SUM(receiving_tds)        AS receiving_tds
         FROM ${weeklyView}
        WHERE player_id = ?
        GROUP BY season
        ORDER BY season`,
      [playerId]
    );

    /* -------------------------------------------------- *
     *  8)  Advanced / NextGen pulls                     *
     * -------------------------------------------------- */
    player.advanced = {};

    if (player.position === 'QB') {
      const [adv] = await conn.execute(
        `SELECT *
           FROM NextGen_Stats_Passing
          WHERE player_id = ? AND season = ?`,
        [playerId, season]
      );
      player.advancedPassing = adv[0] || null;
      player.advanced.passing = player.advancedPassing;
    }

    if (['RB','WR'].includes(player.position)) {
      const [advRush] = await conn.execute(
        `SELECT *
           FROM NextGen_Stats_Rushing
          WHERE player_id = ? AND season = ?`,
        [playerId, season]
      );
      player.advanced.rushing = advRush[0] || null;
    }

    if (['RB','WR','TE'].includes(player.position)) {
      const [advRecv] = await conn.execute(
        `SELECT *
           FROM NextGen_Stats_Receiving
          WHERE player_gsis_id = ? AND season = ?`,
        [playerId, season]
      );
      player.advanced.receiving = advRecv[0] || null;
    }

    /* -------------------------------------------------- *
     *  9)  Send everything back                          *
     * -------------------------------------------------- */
    res.status(200).json({
      player,
      seasonStats,
      weekly,              // raw weekly logs – handy for “last 3 games” views
      passingMetrics,
      rushingMetrics,
      receivingMetrics,
      advancedPassing   : player.advanced.passing   || {},
      advancedRushing   : player.advanced.rushing   || {},
      advancedReceiving : player.advanced.receiving || {},
    });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    if (conn) await conn.end();
  }
}
