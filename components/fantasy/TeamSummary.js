// components/fantasy/TeamSummary.js
export default function TeamSummary({ team }) {
  if (!team) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Team Summary</h3>
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
        <div>
          <p className="text-sm font-semibold">Record</p>
          <p className="text-sm text-gray-600">{team.record}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Rank</p>
          <p className="text-sm text-gray-600">
            {team.rank}
            {team.rank === 1 ? 'st' : team.rank === 2 ? 'nd' : team.rank === 3 ? 'rd' : 'th'}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Points Scored</p>
          <p className="text-sm text-gray-600">{team.pointsScored.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Points Against</p>
          <p className="text-sm text-gray-600">{team.pointsAgainst.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
}
