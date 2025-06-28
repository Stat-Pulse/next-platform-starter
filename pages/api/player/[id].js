// pages/api/player/[id].js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const playerId = req.query.id;
  const season   = req.query.season || '2024';
  let conn;

  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [playerRows] = await conn.execute(`SELECT * FROM Active_Player_Profiles WHERE player_id = ?`, [playerId]);
    if (!playerRows.length) return res.status(404).json({ error: 'Player not found' });
    const player = playerRows[0];

    const [weekly] = await conn.execute(`SELECT * FROM offense_weekly_stats WHERE player_id = ? AND season = ? AND season_type = 'REG' ORDER BY CAST(week AS UNSIGNED)`, [playerId, season]);

    const passingMetrics = weekly.filter(r => +r.attempts > 0);
    const rushingMetrics = weekly.filter(r => +r.carries > 0);
    const receivingMetrics = weekly.filter(r => +r.targets > 0);

    const [career] = await conn.execute(`SELECT COUNT(DISTINCT season) as seasons, SUM(passing_yards) as pass_yards, SUM(passing_tds) as pass_tds, SUM(rushing_yards) as rush_yards, SUM(rushing_tds) as rush_tds, SUM(receiving_yards) as rec_yards, SUM(receiving_tds) as rec_tds FROM offense_weekly_stats WHERE player_id = ?`, [playerId]);

    player.career = {
      passing: { seasons: career[0].seasons, yards: career[0].pass_yards, tds: career[0].pass_tds },
      rushing: { seasons: career[0].seasons, yards: career[0].rush_yards, tds: career[0].rush_tds },
      receiving: { seasons: career[0].seasons, yards: career[0].rec_yards, tds: career[0].rec_tds },
    };

    res.status(200).json({ player, passingMetrics, rushingMetrics, receivingMetrics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    if (conn) await conn.end();
  }
}