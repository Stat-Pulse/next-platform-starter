// File: pages/player-stats.js

import React, { useState, useEffect } from 'react';
import ScoringToggle from '../components/fantasy/ScoringToggle';
import FantasyFilters from '../components/fantasy/FantasyFilters';
import FantasyTable from '../components/fantasy/FantasyTable';
import PlayerModal from '../components/fantasy/PlayerModal';
import TrendGraph from '../components/fantasy/TrendGraph';
import FantasyCompare from '../components/fantasy/FantasyCompare';

export default function PlayerStatsPage() {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [scoringFormat, setScoringFormat] = useState('ppr'); // 'std', 'half'
  const [filters, setFilters] = useState({
    position: '',
    team: '',
    byeWeek: '',
    minPoints: 0,
    minUsage: 0
  });

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [comparePlayers, setComparePlayers] = useState([]);
  const [showTrends, setShowTrends] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/data/fantasy/2024_qbs_sorted.json','/data/fantasy/2024_rbs_sorted.json', '/data/fantasy/2024_wrs_sorted.json', '/data/fantasy/2024_tes_sorted.json'); // Adjust path as needed
      const data = await res.json();
      setPlayers(data);
      setFilteredPlayers(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = players.filter(p => {
      const points =
        scoringFormat === 'ppr'
          ? p.fantasy_points_ppr
          : scoringFormat === 'half'
          ? p.fantasy_points_half_ppr
          : p.fantasy_points_std;

      return (
        (!filters.position || p.position === filters.position) &&
        (!filters.team || p.team === filters.team) &&
        (!filters.byeWeek || p.bye_week === parseInt(filters.byeWeek)) &&
        (points >= filters.minPoints) &&
        (p.snap_percentage >= filters.minUsage)
      );
    });

    setFilteredPlayers(filtered);
  }, [filters, players, scoringFormat]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Fantasy Player Stats</h1>

      <ScoringToggle format={scoringFormat} setFormat={setScoringFormat} />

      <div className="mt-4">
        <FantasyFilters filters={filters} setFilters={setFilters} />
      </div>

      <div className="mt-6">
        <FantasyTable
          players={filteredPlayers}
          format={scoringFormat}
          onPlayerClick={setSelectedPlayer}
          onCompareSelect={setComparePlayers}
          showTrends={showTrends}
        />
      </div>

      {comparePlayers.length > 1 && (
        <FantasyCompare players={comparePlayers} format={scoringFormat} />
      )}

      {showTrends && (
        <TrendGraph players={filteredPlayers} format={scoringFormat} />
      )}

      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          format={scoringFormat}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}
