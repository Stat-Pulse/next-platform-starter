// pages/api/player/[id].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const playerId = req.query.id;
  let conn;

  try {
    conn = await mysql.createConnection({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });

    const [meta] = await conn.execute(`SELECT * FROM Active_Player_Profiles WHERE player_id = ?`, [playerId]);
    if (!meta.length) return res.status(404).json({ error: 'Player not found' });
    const player = meta[0];

    const [weekly] = await conn.execute(`SELECT * FROM offense_weekly_stats WHERE player_id = ? AND season_type = 'REG' ORDER BY season, CAST(week AS UNSIGNED)`, [playerId]);

    const [seasonStats] = await conn.execute(`SELECT season, team,
      SUM(completions) AS completions, SUM(attempts) AS attempts, SUM(passing_yards) AS passing_yards, SUM(passing_tds) AS passing_tds, SUM(interceptions) AS passing_interceptions,
      SUM(carries) AS carries, SUM(rushing_yards) AS rushing_yards, SUM(rushing_tds) AS rushing_tds,
      SUM(receptions) AS receptions, SUM(targets) AS targets, SUM(receiving_yards) AS receiving_yards, SUM(receiving_tds) AS receiving_tds,
      SUM(def_tackles_solo) AS def_tackles_solo, SUM(def_tds) AS def_tds,
      SUM(fantasy_points) AS fantasy_points, SUM(fantasy_points_ppr) AS fantasy_points_ppr
      FROM offense_weekly_stats WHERE player_id = ? GROUP BY season ORDER BY season`, [playerId]);

    const [career] = await conn.execute(`SELECT COUNT(DISTINCT season) AS seasons, team AS team,
      SUM(completions) AS completions, SUM(attempts) AS attempts, SUM(passing_yards) AS passing_yards, SUM(passing_tds) AS passing_tds, SUM(interceptions) AS passing_interceptions,
      SUM(carries) AS carries, SUM(rushing_yards) AS rushing_yards, SUM(rushing_tds) AS rushing_tds,
      SUM(receptions) AS receptions, SUM(targets) AS targets, SUM(receiving_yards) AS receiving_yards, SUM(receiving_tds) AS receiving_tds,
      SUM(def_tackles_solo) AS def_tackles_solo, SUM(def_tds) AS def_tds,
      SUM(fantasy_points) AS fantasy_points, SUM(fantasy_points_ppr) AS fantasy_points_ppr
      FROM offense_weekly_stats WHERE player_id = ?`, [playerId]);

    player.career = career[0];

    res.status(200).json({ player, weekly, seasonStats });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    if (conn) await conn.end();
  }
}