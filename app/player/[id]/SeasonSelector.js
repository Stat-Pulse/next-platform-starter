'use client';

export default function SeasonSelector({ gameLogs }) {
  const seasons = [...new Set(gameLogs.map((log) => log.season))].sort((a, b) => b - a);
  const [selectedSeason, setSelectedSeason] = useState(seasons[0] || '');

  const filteredLogs = gameLogs.filter((log) => log.season === selectedSeason);

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="season-select" className="mr-2 text-gray-700">
          Select Season:
        </label>
        <select
          id="season-select"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
          className="border rounded p-1"
        >
          {seasons.map((season) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>
      </div>
      {filteredLogs.length > 0 ? (
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">Week</th>
                <th className="p-2">Opponent</th>
                <th className="p-2">Pass Yards</th>
                <th className="p-2">Rush Yards</th>
                <th className="p-2">Recv Yards</th>
                <th className="p-2">Total TDs</th>
                <th className="p-2">PPR Points</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{log.week}</td>
                  <td className="p-2">{log.opponent_team_id}</td>
                  <td className="p-2">{log.passing_yards || 0}</td>
                  <td className="p-2">{log.rushing_yards || 0}</td>
                  <td className="p-2">{log.receiving_yards || 0}</td>
                  <td className="p-2">{log.total_tds || 0}</td>
                  <td className="p-2">{log.fantasy_points_ppr ? log.fantasy_points_ppr.toFixed(1) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No game logs available for this season.</p>
      )}
    </div>
  );
}