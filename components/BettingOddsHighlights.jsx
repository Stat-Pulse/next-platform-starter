'use client'

export default function BettingOddsHighlights() {
  const keyGames = [
    { matchup: 'Bengals vs. Patriots', spread: 'CIN -3.5', moneyline: '-180', overUnder: '42.5' },
    { matchup: 'Chiefs vs. Ravens', spread: 'KC -2', moneyline: '-135', overUnder: '48.5' },
  ]

  const lineMovements = [
    { matchup: 'Bengals vs. Patriots', movement: 'Spread moved from -2.5 to -3.5' },
    { matchup: 'Chiefs vs. Ravens', movement: 'O/U dropped from 49.5 to 48.5' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Week 1 Key Games</h3>
        <ul className="space-y-2 text-gray-700">
          {keyGames.map((game, i) => (
            <li key={i}>
              {game.matchup}: Spread: {game.spread}, Moneyline: {game.moneyline}, O/U: {game.overUnder}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Line Movements</h3>
        <ul className="space-y-2 text-gray-700">
          {lineMovements.map((move, i) => (
            <li key={i}>{move.matchup}: {move.movement}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
