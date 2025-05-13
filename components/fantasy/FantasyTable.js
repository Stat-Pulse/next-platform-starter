import React from 'react';

export default function FantasyTable({ players, format, onPlayerClick }) {
  const getFantasyPoints = (player) => {
    if (format === 'ppr') return player.fantasy_points_ppr;
    if (format === 'half') return player.fantasy_points_half_ppr;
    return player.fantasy_points_std;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Player</th>
            <th className="p-2">Team</th>
            <th className="p-2">Pos</th>
            <th className="p-2">Points ({format.toUpperCase()})</th>
            <th className="p-2">PPG</th>
            <th className="p-2">Snap%</th>
            <th className="p-2">Target Share</th>
            <th className="p-2">Red Zone</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr
              key={player.player_id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onPlayerClick(player)}
            >
              <td className="p-2">{player.display_name}</td>
              <td className="p-2">{player.team}</td>
              <td className="p-2">{player.position}</td>
              <td className="p-2 font-medium">{getFantasyPoints(player)}</td>
              <td className="p-2">{player.fantasy_ppg}</td>
              <td className="p-2">{player.snap_percentage}%</td>
              <td className="p-2">{player.target_share}%</td>
              <td className="p-2">{player.red_zone_targets}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
