'use client';
import { useState } from 'react';

const teamMap = {
  1: 'ARI', 2: 'ATL', 3: 'BAL', 4: 'BUF', 5: 'CAR', 6: 'CHI', 7: 'CIN', 8: 'CLE',
  9: 'DAL', 10: 'DEN', 11: 'DET', 12: 'GB', 13: 'HOU', 14: 'IND', 15: 'JAX',
  16: 'KC', 17: 'LV', 18: 'LAC', 19: 'LAR', 20: 'MIA', 21: 'MIN', 22: 'NE',
  23: 'NO', 24: 'NYG', 25: 'NYJ', 26: 'PHI', 27: 'PIT', 28: 'SF', 29: 'SEA',
  30: 'TB', 31: 'TEN', 32: 'WAS'
};

export default function SeasonSelector({ gameLogs }) {
  const seasons = [...new Set(gameLogs.map((log) => log.season))]
    .sort((a, b) => b - a);
  const [selectedSeason, setSelectedSeason] = useState(seasons[0] || '');

  const filteredLogs = gameLogs.filter((log) => log.season === selectedSeason);

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="inline-flex space-x-4">
          {seasons.map((season) => {
            const isActive = season === selectedSeason;
            return (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`
                  px-4 py-2 text-sm font-medium whitespace-nowrap
                  ${
                    isActive
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-600 hover:text-primary'
                  }
                  transition
                `}
              >
                {season}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      {filteredLogs.length > 0 ? (
        <div className="overflow-x-auto border rounded-md shadow-sm">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-100 uppercase text-xs tracking-widest text-gray-700">
              <tr>
                <th className="p-3 text-left">Week</th>
                <th className="p-3 text-left">Opponent</th>
                <th className="p-3 text-center">Pass Yards</th>
                <th className="p-3 text-center">Rush Yards</th>
                <th className="p-3 text-center">Recv Yards</th>
                <th className="p-3 text-center">Total TDs</th>
                <th className="p-3 text-center">PPR Points</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr
                  key={idx}
                  className={`
                    ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    hover:bg-gray-100 transition
                  `}
                >
                  <td className="p-3">{log.week}</td>
                  <td className="p-3">{teamMap[log.opponent_team_id] || 'N/A'}</td>
                  <td className="p-3 text-center">{log.passing_yards || 0}</td>
                  <td className="p-3 text-center">{log.rushing_yards || 0}</td>
                  <td className="p-3 text-center">{log.receiving_yards || 0}</td>
                  <td className="p-3 text-center">{log.total_tds || 0}</td>
                  <td className="p-3 text-center">
                    {log.fantasy_points_ppr
                      ? log.fantasy_points_ppr.toFixed(1)
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No game logs available for this season.</p>
      )}
    </div>
  );
}
