// File: components/fantasy/StatsHeader.js

import React from 'react';
import ScoringToggle from './ScoringToggle';

export default function StatsHeader({ scoringFormat, setScoringFormat, filters, setFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white p-4 rounded-md shadow mb-6">
      <ScoringToggle format={scoringFormat} setFormat={setScoringFormat} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <select
          name="position"
          value={filters.position}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-md text-sm"
        >
          <option value="">All Positions</option>
          <option value="QB">QB</option>
          <option value="RB">RB</option>
          <option value="WR">WR</option>
          <option value="TE">TE</option>
          <option value="DEF">DEF</option>
        </select>

        <select
          name="team"
          value={filters.team}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-md text-sm"
        >
          <option value="">All Teams</option>
          {[
            "ARI","ATL","BAL","BUF","CAR","CHI","CIN","CLE","DAL","DEN","DET","GB",
            "HOU","IND","JAX","KC","LAC","LAR","LV","MIA","MIN","NE","NO","NYG","NYJ",
            "PHI","PIT","SEA","SF","TB","TEN","WAS"
          ].map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>

        <select
          name="byeWeek"
          value={filters.byeWeek}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-md text-sm"
        >
          <option value="">All Bye Weeks</option>
          {[...Array(14)].map((_, i) => (
            <option key={i + 1} value={i + 1}>Week {i + 1}</option>
          ))}
        </select>

        <input
          type="number"
          name="minPoints"
          value={filters.minPoints}
          onChange={handleChange}
          placeholder="Min Fantasy Points"
          className="border border-gray-300 p-2 rounded-md text-sm"
        />

        <input
          type="number"
          name="minUsage"
          value={filters.minUsage}
          onChange={handleChange}
          placeholder="Min Snap %"
          className="border border-gray-300 p-2 rounded-md text-sm"
        />
      </div>
    </div>
  );
}
