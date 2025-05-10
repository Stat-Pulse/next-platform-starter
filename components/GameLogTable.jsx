export default function GameLogTable({ games }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h4 className="text-lg font-semibold mb-2">Recent Games</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Week</th>
              <th className="p-2">Opp</th>
              <th className="p-2">Pass Yds</th>
              <th className="p-2">Pass TD</th>
              <th className="p-2">INT</th>
            </tr>
          </thead>
          <tbody>
            {games.map((g) => (
              <tr key={g.week}>
                <td className="p-2">{g.week}</td>
                <td className="p-2">{g.opponent}</td>
                <td className="p-2">{g.passYards}</td>
                <td className="p-2">{g.passTD}</td>
                <td className="p-2">{g.interceptions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
