// components/fantasy/StandingsTable.js
export default function StandingsTable({ teams, userTeamName }) {
  if (!teams || !teams.length) return null;

  const sorted = [...teams].sort((a, b) => a.rank - b.rank);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Rank</th>
            <th className="p-2 text-left">Team</th>
            <th className="p-2 text-left">Record</th>
            <th className="p-2 text-left">Points Scored</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((team, index) => (
            <tr key={index} className={team.name === userTeamName ? 'bg-red-50' : ''}>
              <td className="p-2">{team.rank}</td>
              <td className="p-2">{team.name}</td>
              <td className="p-2">{team.record}</td>
              <td className="p-2">{team.pointsScored.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
