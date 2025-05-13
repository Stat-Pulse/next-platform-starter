// components/fantasy/Matchup.js
export default function Matchup({ userTeam, opponentTeam }) {
  if (!userTeam || !opponentTeam) return null;

  const topPlayer = (team) =>
    team.roster.reduce((top, p) => (p.projected > top.projected ? p : top), team.roster[0]);

  const userTop = topPlayer(userTeam);
  const opponentTop = topPlayer(opponentTeam);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Your Matchup</h3>
      <div className="p-4 bg-gray-50 rounded-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src={userTeam.logo} alt={userTeam.name} className="h-8 w-8 rounded-full" />
            <div>
              <p className="font-semibold">{userTeam.name} ({userTeam.record})</p>
              <p className="text-sm text-gray-600">
                Top Player: {userTop.name} ({userTop.projected.toFixed(1)} pts)
              </p>
            </div>
          </div>
          <span className="text-sm text-gray-600">vs</span>
          <div className="flex items-center space-x-4">
            <div>
              <p className="font-semibold">{opponentTeam.name} ({opponentTeam.record})</p>
              <p className="text-sm text-gray-600">
                Top Player: {opponentTop.name} ({opponentTop.projected.toFixed(1)} pts)
              </p>
            </div>
            <img src={opponentTeam.logo} alt={opponentTeam.name} className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Projected Score: {userTeam.projected.toFixed(1)} - {opponentTeam.projected.toFixed(1)}
        </p>
      </div>
    </div>
  );
}
