import { useState, useEffect } from 'react';
import PlayerModal from '../components/fantasy/PlayerModal';
const [filteredPlayers, setFilteredPlayers] = useState([]);

useEffect(() => {
  async function fetchData() {
    const res = await fetch('/data/fantasy_stats.json');
    const data = await res.json();
    setFilteredPlayers(data);
  }
  fetchData();
}, []);

export default function FantasyStats() {
  const [scoringFormat, setScoringFormat] = useState('ppr');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [filteredPlayers, setFilteredPlayers] = useState(playersData);

  const formatPoints = (player) => {
    if (scoringFormat === 'ppr') return player.fantasy_points_ppr;
    if (scoringFormat === 'half') return player.fantasy_points_half_ppr;
    return player.fantasy_points_std;
  };

  const handleScoringChange = (e) => {
    setScoringFormat(e.target.value);
  };

  const openPlayerModal = (player) => {
    setSelectedPlayer(player);
  };

  const closeModal = () => {
    setSelectedPlayer(null);
  };

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Fantasy Player Stats</h1>

      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="scoring" className="text-sm font-semibold">Scoring:</label>
        <select
          id="scoring"
          value={scoringFormat}
          onChange={handleScoringChange}
          className="border px-3 py-1 rounded-md text-sm"
        >
          <option value="std">Standard</option>
          <option value="half">Half-PPR</option>
          <option value="ppr">PPR</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-md shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Player</th>
              <th className="p-2">Team</th>
              <th className="p-2">Pos</th>
              <th className="p-2">Points</th>
              <th className="p-2">PPG</th>
              <th className="p-2">Targets</th>
              <th className="p-2">Recs</th>
              <th className="p-2">Rush Yds</th>
              <th className="p-2">TDs</th>
              <th className="p-2">Snap%</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr
                key={player.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => openPlayerModal(player)}
              >
                <td className="p-2">{player.display_name}</td>
                <td className="p-2 text-center">{player.team}</td>
                <td className="p-2 text-center">{player.position}</td>
                <td className="p-2 text-center">{formatPoints(player)}</td>
                <td className="p-2 text-center">{player.fantasy_ppg.toFixed(1)}</td>
                <td className="p-2 text-center">{player.targets}</td>
                <td className="p-2 text-center">{player.receptions}</td>
                <td className="p-2 text-center">{player.rushing_yards}</td>
                <td className="p-2 text-center">{player.total_tds}</td>
                <td className="p-2 text-center">{player.snap_percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPlayer && (
        <PlayerModal player={selectedPlayer} format={scoringFormat} onClose={closeModal} />
      )}
    </main>
  );
}
