import React from 'react';

export default function FantasyCompare({ players, format }) {
  const getPoints = (player) => {
    if (format === 'ppr') return player.fantasy_points_ppr;
    if (format === 'half') return player.fantasy_points_half_ppr;
    return player.fantasy_points_std;
  };

  return (
    <div className="bg-white rounded-md p-4 shadow mb-6 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Fantasy Player Comparison</h3>
      {players.length < 2 ? (
        <p className="text-sm text-gray-500">Select at least 2 players to compare.</p>
      ) : (
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Player</th>
              <th className="p-2">Team</th>
              <th className="p-2">Pos</th>
              <th className="p-2">Fantasy Points</th>
              <th className="p-2">PPG</th>
              <th className="p-2">Targets</th>
              <th className="p-2">Receptions</th>
              <th className="p-2">Yards</th>
              <th className="p-2">TDs</th>
              <th className="p-2">Snap %</th>
              <th className="p-2">Target Share</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, i) => (
              <tr key={i} className="border-t">
                <td className="p-2 font-medium">{player.display_name}</td>
                <td className="p-2">{player.team}</td>
                <td className="p-2">{player.position}</td>
                <td className="p-2">{getPoints(player)}</td>
                <td className="p-2">{player.fantasy_ppg}</td>
                <td className="p-2">{player.targets}</td>
                <td className="p-2">{player.receptions}</td>
                <td className="p-2">{player.receiving_yards || player.rushing_yards}</td>
                <td className="p-2">{player.receiving_tds || player.rushing_tds}</td>
                <td className="p-2">{player.snap_percentage}%</td>
                <td className="p-2">{player.target_share}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
