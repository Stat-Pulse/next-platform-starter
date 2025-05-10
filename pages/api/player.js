// pages/api/player.js
import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const { name } = req.query

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid player name' })
  }

  const filePath = path.join(process.cwd(), 'public', 'data', 'rb_depth.json')
  const json = fs.readFileSync(filePath, 'utf8')
  const depth = JSON.parse(json)

  // Flatten players
  const players = depth.flatMap(d => [
    { ...d.starter, team: d.team, position: d.position },
    { ...d.backup, team: d.team, position: d.position },
  ])

  const player = players.find(p => p.name.toLowerCase() === name.toLowerCase())

  if (!player) {
    return res.status(404).json({ error: 'Player not found' })
  }

  // Add dummy game data for now so ComparisonSections.jsx can work
  player.recentGames = [
    {
      week: 1,
      opponent: 'NE',
      stats: {
        rushYards: 68,
        rushTD: 1,
        recYards: 25,
        receptions: 2,
        recTD: 0,
        passYards: 0,
        passTD: 0,
        interceptions: 0,
      },
    },
    {
      week: 2,
      opponent: 'KC',
      stats: {
        rushYards: 89,
        rushTD: 0,
        recYards: 18,
        receptions: 3,
        recTD: 1,
        passYards: 0,
        passTD: 0,
        interceptions: 0,
      },
    },
    {
      week: 3,
      opponent: 'LAR',
      stats: {
        rushYards: 72,
        rushTD: 1,
        recYards: 30,
        receptions: 4,
        recTD: 0,
        passYards: 0,
        passTD: 0,
        interceptions: 0,
      },
    },
  ]

  player.jersey = player.jersey || '??'
  player.upcomingGame = 'vs TBD'
  player.byeWeek = 'TBD'
  player.injuryStatus = 'Healthy'

  res.status(200).json(player)
}
