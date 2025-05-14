// File: netlify/functions/getComparisonStats.js

const mysql = require('mysql2/promise');

exports.handler = async function (event) {
  const body = JSON.parse(event.body || '{}')
  const { playerIds = [], viewMode = 'weekly' } = body

  if (!playerIds.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing playerIds array' })
    }
  }

  try {
    const connection = await mysql.createConnection({
      host: 'stat-pulse-analytics-db.ci1uue2w2sxp.us-east-1.rds.amazonaws.com',
      user: 'StatadminPULS3',
      password: 'wyjGiz-justo6-gesmyh',
      database: 'nfl_analytics',
    })

    let rows = []

    if (viewMode === 'career') {
      const [res] = await connection.execute(`
        SELECT
          PSG.player_id,
          P.player_name,
          P.position,
          SUM(PSG.passing_tds) AS tds,
          SUM(PSG.passing_yards) AS passYards,
          SUM(PSG.rushing_yards) AS rushYards,
          SUM(PSG.receiving_yards) AS receivingYards,
          COUNT(DISTINCT PSG.game_id) AS games_played
        FROM Player_Stats_Game PSG
        JOIN Players P ON PSG.player_id = P.player_id
        WHERE PSG.player_id IN (?)
        GROUP BY PSG.player_id
      `, [playerIds])

      rows = res.map(row => ({
        player_id: row.player_id,
        player_name: row.player_name,
        position: row.position,
        tds: Number(row.tds || 0),
        passYards: Number(row.passYards || 0),
        rushYards: Number(row.rushYards || 0),
        receivingYards: Number(row.receivingYards || 0),
        games: Number(row.games_played || 0),
      }))

    } else if (viewMode === 'season') {
      const [res] = await connection.execute(`
        SELECT
          PSG.player_id,
          P.player_name,
          P.position,
          PSG.season_id,
          SUM(PSG.passing_tds) AS tds,
          SUM(PSG.passing_yards) AS passYards,
          SUM(PSG.rushing_yards) AS rushYards,
          SUM(PSG.receiving_yards) AS receivingYards
        FROM Player_Stats_Game PSG
        JOIN Players P ON PSG.player_id = P.player_id
        WHERE PSG.player_id IN (?)
        GROUP BY PSG.player_id, PSG.season_id
        ORDER BY PSG.season_id DESC
      `, [playerIds])

      // Use most recent season for each player
      const seen = new Set()
      for (const row of res) {
        if (seen.has(row.player_id)) continue
        seen.add(row.player_id)
        rows.push({
          player_id: row.player_id,
          player_name: row.player_name,
          position: row.position,
          tds: Number(row.tds || 0),
          passYards: Number(row.passYards || 0),
          rushYards: Number(row.rushYards || 0),
          receivingYards: Number(row.receivingYards || 0),
          season_id: row.season_id
        })
      }

    } else if (viewMode === 'weekly') {
      const [res] = await connection.execute(`
        SELECT
          PSG.player_id,
          P.player_name,
          PSG.week,
          PSG.fantasy_points_ppr
        FROM Player_Stats_Game PSG
        JOIN Players P ON PSG.player_id = P.player_id
        WHERE PSG.player_id IN (?)
        ORDER BY PSG.week ASC
      `, [playerIds])

      // Group by player_id
      const grouped = {}
      for (const row of res) {
        if (!grouped[row.player_id]) grouped[row.player_id] = {
          player_id: row.player_id,
          player_name: row.player_name,
          weekly_points: []
        }
        grouped[row.player_id].weekly_points.push({
          week: row.week,
          fantasy_points_ppr: Number(row.fantasy_points_ppr || 0)
        })
      }

      rows = Object.values(grouped)
    }

    await connection.end()

    return {
      statusCode: 200,
      body: JSON.stringify(rows)
    }
  } catch (err) {
    console.error('DB error:', err.message)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Database error' })
    }
  }
};