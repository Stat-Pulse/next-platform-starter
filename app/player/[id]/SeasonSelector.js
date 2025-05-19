'use client';

import { useState } from 'react';

export default function SeasonSelector({ gameLogs }) {
  const seasons = [...new Set(gameLogs.map(g => g.season))].sort((a, b) => b - a);
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]);

  const filteredLogs = gameLogs.filter(g => g.season === selectedSeason);

  return (
    <div style={{ marginTop: '3rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Game Logs - {selectedSeason}</h2>

      <select
        value={selectedSeason}
        onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
        style={{ marginBottom: '1rem', padding: '0.5rem' }}
      >
        {seasons.map(season => (
          <option key={season} value={season}>
            {season}
          </option>
        ))}
      </select>

      <table border="1" cellPadding="6" style={{ width: '100%', fontSize: '0.9rem' }}>
        <thead style={{ backgroundColor: '#f3f3f3' }}>
          <tr>
            <th>Week</th>
            <th>Opponent</th>
            <th>Pass Yards</th>
            <th>Rush Yards</th>
            <th>Recv Yards</th>
            <th>Total TDs</th>
            <th>PPR Points</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log, i) => (
            <tr key={i}>
              <td>{log.week}</td>
              <td>{log.opponent_team_id}</td>
              <td>{log.passing_yards}</td>
              <td>{log.rushing_yards}</td>
              <td>{log.receiving_yards}</td>
              <td>{log.passing_tds + log.rushing_tds + log.receiving_tds}</td>
              <td>{parseFloat(log.fantasy_points_ppr || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
