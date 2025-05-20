<div className="overflow-x-auto border rounded-md shadow-sm">
  <table className="min-w-full text-sm">
    <thead className="bg-gray-50 text-left text-gray-700">
      <tr>
        <th className="p-3 font-semibold">Week</th>
        <th className="p-3 font-semibold">Opponent</th>
        <th className="p-3 font-semibold text-center">Pass Yards</th>
        <th className="p-3 font-semibold text-center">Rush Yards</th>
        <th className="p-3 font-semibold text-center">Recv Yards</th>
        <th className="p-3 font-semibold text-center">Total TDs</th>
        <th className="p-3 font-semibold text-center">PPR Points</th>
      </tr>
    </thead>
    <tbody>
      {filteredLogs.map((log, index) => (
        <tr key={index} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
          <td className="p-3">{log.week}</td>
          <td className="p-3">{teamMap[log.opponent_team_id] || 'N/A'}</td>
          <td className="p-3 text-center">{log.passing_yards || 0}</td>
          <td className="p-3 text-center">{log.rushing_yards || 0}</td>
          <td className="p-3 text-center">{log.receiving_yards || 0}</td>
          <td className="p-3 text-center">{log.total_tds || 0}</td>
          <td className="p-3 text-center">{log.fantasy_points_ppr ? log.fantasy_points_ppr.toFixed(1) : '-'}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
