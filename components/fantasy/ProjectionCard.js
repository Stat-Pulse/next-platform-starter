import React from 'react';

export default function ProjectionCard({ player, projection }) {
  if (!player || !projection) {
    return (
      <div className="bg-white p-4 rounded-md shadow text-sm text-gray-500">
        No projection data available.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md p-4 shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">Projection: Week {projection.week}</h3>
      <p className="text-sm text-gray-600 mb-1"><strong>Opponent:</strong> {projection.opponent}</p>
      <p className="text-sm text-gray-600 mb-1"><strong>Projected Fantasy Points:</strong> {projection.fantasy_points}</p>
      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>Passing Yards:</strong> {projection.passing_yards}</p>
          <p><strong>Passing TDs:</strong> {projection.passing_tds}</p>
          <p><strong>Interceptions:</strong> {projection.interceptions}</p>
        </div>
        <div>
          <p><strong>Rushing Yards:</strong> {projection.rushing_yards}</p>
          <p><strong>Rushing TDs:</strong> {projection.rushing_tds}</p>
          <p><strong>Receptions:</strong> {projection.receptions}</p>
        </div>
      </div>
    </div>
  );
}
