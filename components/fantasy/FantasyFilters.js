import React from 'react';

export default function FantasyFilters({
  filters,
  onFilterChange,
  minFantasyPoints,
  setMinFantasyPoints
}) {
  const positions = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'];

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Position</label>
        <select
          value={filters.position}
          onChange={(e) => onFilterChange('position', e.target.value)}
          className="mt-1 p-2 border rounded-md text-sm"
        >
          <option value="">All</option>
          {positions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Team</label>
        <select
          value={filters.team}
          onChange={(e) => onFilterChange('team', e.target.value)}
          className="mt-1 p-2 border rounded-md text-sm"
        >
          <option value="">All</option>
          {filters.teamOptions.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Bye Week</label>
        <select
          value={filters.bye}
          onChange={(e) => onFilterChange('bye', e.target.value)}
          className="mt-1 p-2 border rounded-md text-sm"
        >
          <option value="">All</option>
          {Array.from({ length: 14 }, (_, i) => i + 1).map((week) => (
            <option key={week} value={week}>
              Week {week}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Min Fantasy Points</label>
        <input
          type="number"
          value={minFantasyPoints}
          onChange={(e) => setMinFantasyPoints(e.target.value)}
          placeholder="e.g. 50"
          className="mt-1 p-2 border rounded-md text-sm w-24"
        />
      </div>
    </div>
  );
}
