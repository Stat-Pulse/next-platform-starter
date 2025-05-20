'use client';
import SeasonSelector from './SeasonSelector';
import ReceivingMetricsTable from '@/components/player/ReceivingMetricsTable';

export default function PlayerProfileShell({ player, careerStats, gameLogs }) {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>{player?.player_name || 'Player Not Found'}</h1>
      <p>{player?.position} | {player?.team}</p>
      <p>College: {player?.college}</p>
      <p>Drafted: {player?.draft_club} #{player?.draft_number} ({player?.rookie_year})</p>

      <h2 style={{ marginTop: '2rem' }}>Career Stats</h2>
      {careerStats.length > 0 ? (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Season</th>
              <th>Pass Yards</th>
              <th>Rush Yards</th>
              <th>Recv Yards</th>
              <th>PPR Points</th>
            </tr>
          </thead>
          <tbody>
            {careerStats.map((row) => (
              <tr key={row.season}>
                <td>{row.season}</td>
                <td>{row.passing_yards}</td>
                <td>{row.rushing_yards}</td>
                <td>{row.receiving_yards}</td>
                <td>{parseFloat(row.fantasy_points_ppr).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No career stats available.</p>
      )}

      {/* Receiving Metrics Section */}
      <ReceivingMetricsTable playerId={player.player_id} />

      {/* Weekly Game Logs Section */}
      <SeasonSelector gameLogs={gameLogs} />
    </main>
  );
}
