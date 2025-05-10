const fs = require('fs')
const path = require('path')

const players = [
  { name: 'Joe Burrow', position: 'QB', team: 'Cincinnati Bengals', jersey: 9 },
  { name: 'Bijan Robinson', position: 'RB', team: 'Atlanta Falcons', jersey: 7 },
  { name: 'Saquon Barkley', position: 'RB', team: 'Philadelphia Eagles', jersey: 26 },
  { name: "Ja'Marr Chase", position: 'WR', team: 'Cincinnati Bengals', jersey: 1 },
  { name: 'CeeDee Lamb', position: 'WR', team: 'Dallas Cowboys', jersey: 88 },
  { name: 'Jordan Love', position: 'QB', team: 'Green Bay Packers', jersey: 10 }
]

const dates = ['Sep 8, 2024', 'Sep 15, 2024', 'Sep 22, 2024']

function getRecentGames(position) {
  if (position === 'QB') {
    return [1, 2, 3].map((week, i) => ({
      week,
      date: dates[i],
      opponent: 'Opponent',
      passYards: 250 + i * 10,
      passTD: 1 + (i % 2),
      interceptions: i % 2,
      rushAttempts: 3,
      rushYards: 20 + i * 5,
      rushTD: i === 1 ? 1 : 0
    }))
  }

  if (position === 'RB') {
    return [1, 2, 3].map((week, i) => ({
      week,
      date: dates[i],
      opponent: 'Opponent',
      rushAttempts: 18 + i,
      rushYards: 80 + i * 10,
      rushTD: i === 2 ? 1 : 0,
      targets: 4 + i,
      receptions: 3 + (i % 2),
      recYards: 25 + i * 10,
      recTD: i === 0 ? 1 : 0
    }))
  }

  if (position === 'WR') {
    return [1, 2, 3].map((week, i) => ({
      week,
      date: dates[i],
      opponent: 'Opponent',
      targets: 8 + i,
      receptions: 6 + (i % 2),
      recYards: 90 + i * 15,
      recTD: i === 1 ? 1 : 0,
      rushAttempts: i === 0 ? 1 : 0,
      rushYards: i === 0 ? 6 : 0,
      rushTD: 0
    }))
  }

  return []
}

const playerData = players.map((p) => ({
  ...p,
  injuryStatus: 'Healthy',
  recentGames: getRecentGames(p.position),
  fantasy: {
    pointsHistory: [22 + Math.random() * 5, 18 + Math.random() * 5, 20 + Math.random() * 5]
  },
  bettingTrends: [
    { label: 'Anytime TD', hitRate: Math.floor(Math.random() * 50 + 30) },
    { label: 'Over 1.5 Pass TDs', hitRate: Math.floor(Math.random() * 50 + 40) }
  ],
  coverageStats: p.position === 'QB'
    ? [
        { type: 'Cover 1', frequency: 25, successRate: 88 },
        { type: 'Cover 3', frequency: 40, successRate: 82 }
      ]
    : []
}))

const filePath = path.join(process.cwd(), 'public', 'data', 'player-insights.json')
fs.writeFileSync(filePath, JSON.stringify(playerData, null, 2))
console.log('✅ player-insights.json generated!')
