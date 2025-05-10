'use client'

export default function GameLogTable({ games = [], position }) {
  const isQB = position === 'QB'
  const isRB = position === 'RB'
  const isWR = position === 'WR'

  const headers = ['Week', 'Date', 'Opp']
  if (isQB) {
    headers.push('Pass Yds', 'Pass TD', 'INT', 'Rush Att', 'Rush Yds', 'Y/A', 'Rush TD')
  } else if (isRB) {
    headers.push('Rush Att', 'Rush Yds', 'Y/A', 'Rush TD', 'Targets', 'Rec', 'Rec Yds', 'Rec TD')
  } else if (isWR) {
    headers.push('Targets', 'Rec', 'Rec Yds', 'Rec TD', 'Rush Yds', 'Y/A', 'Rush TD')
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Game Log</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-200">
            <tr>
              {headers.map(header => (
                <th key={header} className="p-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {games.map((game, i) => (
              <tr key={`game-${i}`} className="border-b last:border-0">
                <td className="p-2">{game.week}</td>
                <td className="p-2">{game.date}</td>
                <td className="p-2">{game.opponent}</td>

                {isQB && (
                  <>
                    <td className="p-2">{game.passYards}</td>
                    <td className="p-2">{game.passTD}</td>
                    <td className="p-2">{game.interceptions}</td>
                    <td className="p-2">{game.rushAttempts}</td>
                    <td className="p-2">{game.rushYards}</td>
                    <td className="p-2">{(game.rushYards / game.rushAttempts || 0).toFixed(1)}</td>
                    <td className="p-2">{game.rushTD}</td>
                  </>
                )}

                {isRB && (
                  <>
                    <td className="p-2">{game.rushAttempts}</td>
                    <td className="p-2">{game.rushYards}</td>
                    <td className="p-2">{(game.rushYards / game.rushAttempts || 0).toFixed(1)}</td>
                    <td className="p-2">{game.rushTD}</td>
                    <td className="p-2">{game.targets}</td>
                    <td className="p-2">{game.receptions}</td>
                    <td className="p-2">{game.recYards}</td>
                    <td className="p-2">{game.recTD}</td>
                  </>
                )}

                {isWR && (
                  <>
                    <td className="p-2">{game.targets}</td>
                    <td className="p-2">{game.receptions}</td>
                    <td className="p-2">{game.recYards}</td>
                    <td className="p-2">{game.recTD}</td>
                    <td className="p-2">{game.rushYards}</td>
                    <td className="p-2">{(game.rushYards / game.rushAttempts || 0).toFixed(1)}</td>
                    <td className="p-2">{game.rushTD}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
