const fs = require('fs')
const path = require('path')

// Dummy players
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
      opponent: ['CLE', 'BAL', 'LAR'][i],
      passYards: 275 + i * 20,
      passTD: 2 + i % 2,
      interceptions: i % 2,
      rushAttempts: 3 + i,
      rushYards: 20 + i * 4,
      rushTD: i === 1 ? 1 : 0
    }))
  }

  if (position === 'RB') {
    return [1, 2, 3].map((week, i) => ({
      week,
      date: dates[i],
      opponent: ['NYG', 'WAS', 'TB'][i],
      rushAttempts: 18 + i,
      rushYards: 85 + i * 10,
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
      opponent: ['PHI', 'NYJ', 'MIA'][i],
      targets: 8 + i,
      receptions: 6 + i % 2,
      recYards: 95 + i * 10,
      recTD: i === 1 ? 1 : 0,
      rushAttempts: i === 2 ? 1 : 0,
      rushYards: i === 2 ? 8 : 0,
      rushTD: 0
    }))
  }

  return []
}

// Compose full player object
const playerData = players.map((p) => ({
  ...p,
  injuryStatus: 'Healthy',
  recentGames: getRecentGames(p.position),
  fantasy: {
    pointsHistory: [22.5, 27.1, 19.8]
  },
  bettingTrends: [
    { label: 'Over 208.5 Yds', hitRate: 83 },
    { label: 'Over 1.5 Pass TDs', hitRate: 75 },
    { label: 'Anytime TD', hitRate: 20 }
  ],
  coverageStats: p.position === 'QB'
    ? [
        { type: 'Cover 1', frequency: 20, successRate: 91 },
        { type: 'Cover 2', frequency: 32, successRate: 86 },
        { type: 'Cover 3', frequency: 48, successRate: 77 },
        { type: 'Match', frequency: 31, successRate: 80 }
      ]
    : []
}))

// Write to file
const outputPath = path.join(process.cwd(), 'public', 'data', 'player-insights.json')
fs.writeFileSync(outputPath, JSON.stringify(playerData, null, 2))
console.log('✅ player-insights.json has been regenerated with full stat structures.')
