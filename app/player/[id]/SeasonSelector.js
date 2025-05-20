'use client';
import { useState, useEffect, useRef } from 'react';

const teamMap = {
  1: 'ARI', 2: 'ATL', 3: 'BAL', 4: 'BUF', 5: 'CAR', 6: 'CHI', 7: 'CIN', 8: 'CLE',
  9: 'DAL', 10: 'DEN', 11: 'DET', 12: 'GB', 13: 'HOU', 14: 'IND', 15: 'JAX',
  16: 'KC', 17: 'LV', 18: 'LAC', 19: 'LAR', 20: 'MIA', 21: 'MIN', 22: 'NE',
  23: 'NO', 24: 'NYG', 25: 'NYJ', 26: 'PHI', 27: 'PIT', 28: 'SF', 29: 'SEA',
  30: 'TB', 31: 'TEN', 32: 'WAS'
};

export default function SeasonSelector({ gameLogs }) {
  const seasons = [...new Set(gameLogs.map((log) => log.season))].sort((a, b) => b - a);
  const [selectedSeason, setSelectedSeason] = useState(seasons[0] || '');
  const chartRef = useRef(null);

  const filteredLogs = gameLogs.filter((log) => log.season === selectedSeason);

  useEffect(() => {
    if (chartRef.current && typeof window.Chart !== 'undefined') {
      const ctx = chartRef.current.getContext('2d');
      if (window.myChart) window.myChart.destroy();
      window.myChart = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: filteredLogs.map((log) => `Week ${log.week}`),
          datasets: [{
            label: 'Receiving Yards',
            data: filteredLogs.map((log) => log.receiving_yards || 0),
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            fill: true,
            tension: 0.3,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `Receiving Yards by Week (${selectedSeason})` },
          },
          scales: {
            x: { title: { display: true, text: 'Week' } },
            y: { title: { display: true, text: 'Receiving Yards' }, beginAtZero: true },
          },
        },
      });
    }
  }, [selectedSeason, filteredLogs]);

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="season-select" className="mr-2 text-gray-700">
          Select Season:
        </label>
        <select
          id="season-select"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
          className="border rounded p-1"
        >
          {seasons.map((season) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>
      </div>
      {filteredLogs.length > 0 ? (
        <>
          <div className="mb-8">
            <canvas ref={chartRef} style={{ maxWidth: '100%', height: 'auto' }}></canvas>
          </div>
          <div className="overflow-x-auto border rounded-md">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-2">Week</th>
                  <th className="p-2">Opponent</th>
                  <th className="p-2">Pass Yards</th>
                  <th className="p-2">Rush Yards</th>
                  <th className="p-2">Recv Yards</th>
                  <th className="p-2">Total TDs</th>
                  <th className="p-2">PPR Points</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{log.week}</td>
                    <td className="p-2">{teamMap[log.opponent_team_id] || 'N/A'}</td>
                    <td className="p-2">{log.passing_yards || 0}</td>
                    <td className="p-2">{log.rushing_yards || 0}</td>
                    <td className="p-2">{log.receiving_yards || 0}</td>
                    <td className="p-2">{log.total_tds || 0}</td>
                    <td className="p-2">{log.fantasy_points_ppr ? log.fantasy_points_ppr.toFixed(1) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500">No game logs available for this season.</p>
      )}
    </div>
  );
}

// Load Chart.js via CDN (add this to your page or layout)
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
script.async = true;
document.body.appendChild(script);
