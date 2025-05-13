import React from 'react';

export default function PlayerModal({ player, format, onClose }) {
  const fantasyPoints = format === 'ppr'
    ? player.fantasy_points_ppr
    : format === 'half'
    ? player.fantasy_points_half_ppr
    : player.fantasy_points_std;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-md p-6 w-full max-w-2xl shadow-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-red-600">
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-2">{player.display_name}</h2>
        <p className="text-sm text-gray-600 mb-4">{player.position} - {player.team}</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Fantasy Points ({format.toUpperCase()}):</strong> {fantasyPoints}</p>
            <p><strong>PPG:</strong> {player.fantasy_ppg}</p>
            <p><strong>Targets:</strong> {player.targets}</p>
            <p><strong>Receptions:</strong> {player.receptions}</p>
            <p><strong>Receiving Yards:</strong> {player.receiving_yards}</p>
            <p><strong>Receiving TDs:</strong> {player.receiving_tds}</p>
          </div>
          <div>
            <p><strong>Rushing Yards:</strong> {player.rushing_yards}</p>
            <p><strong>Rushing TDs:</strong> {player.rushing_tds}</p>
            <p><strong>Snap %:</strong> {player.snap_percentage}%</p>
            <p><strong>Target Share:</strong> {player.target_share}%</p>
            <p><strong>Air Yards:</strong> {player.air_yards}</p>
            <p><strong>Red Zone Targets:</strong> {player.red_zone_targets}</p>
          </div>
        </div>
      </div>
    </div>
  );
}