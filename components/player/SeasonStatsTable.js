

import React from 'react';

const SeasonStatsTable = ({ seasonStats }) => {
  if (!seasonStats || seasonStats.length === 0) {
    return <p className="text-gray-500 italic">No season stats available.</p>;
  }

  const statHeaders = Object.keys(seasonStats[0]).filter(
    key => !['season', 'season_type'].includes(key)
  );

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Season</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
            {statHeaders.map((header) => (
              <th key={header} className="border border-gray-300 px-4 py-2 text-left capitalize">
                {header.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {seasonStats.map((row, idx) => (
            <tr key={idx} className="even:bg-white odd:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{row.season}</td>
              <td className="border border-gray-300 px-4 py-2">{row.season_type}</td>
              {statHeaders.map((key) => (
                <td key={key} className="border border-gray-300 px-4 py-2">
                  {row[key] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SeasonStatsTable;