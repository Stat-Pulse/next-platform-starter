'use client'
import { useState } from 'react'

export default function SeasonSelector({ gameLogs }) {
  const seasons = [...new Set(gameLogs.map(g => g.season))].sort((a, b) => b - a)
  const [selectedSeason, setSelectedSeason] = useState(seasons[0])
  const filteredLogs = gameLogs.filter(g => g.season === selectedSeason)

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Game Logs - {selectedSeason}</h2>

      <select
        value={selectedSeason}
        onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
        style={{ marginBottom: '1rem', padding: '0.5rem' }}
      >
        {seasons.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Week</th>
            <th>Opponent</th>
            <th>Pass Yards</th>
            <th>Rush Yards</th>
            <th>Recv Yards</th>
            <th>Total TDs</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map(log => (
            <tr key={log.log_id}>
              <td>{log.week}</td>
              <td>{log.opponent}</td>
              <td>{log.passing_yards}</td>
              <td>{log.rushing_yards}</td>
              <td>{log.receiving_yards}</td>
              <td>{log.passing_tds + log.rushing_tds + log.receiving_tds}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}