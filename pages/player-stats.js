// File: pages/player-stats.js

import React, { useState, useEffect } from 'react';
import StatsHeader from '../components/Stats/StatsHeader';
import StatsTable from '../components/Stats/StatsTable';
import PlayerModal from '../components/Stats/PlayerModal';

export default function PlayerStatsPage() {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [scoringFormat, setScoringFormat] = useState('PPR');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [filters, setFilters] = useState({
    position: '',
    team: '',
    byeWeek: '',
    minPoints: 0,
    minUsage: 0
  });

  useEffect(() => {
    // Load your JSON data or API data here
    async function fetchPlayers() {
      const response = await fetch('/api/fantasy-players'); // Placeholder
      const data = await response.json();
      setPlayers(data);
      setFilteredPlayers(data);
    }
    fetchPlayers();
  }, []);

  useEffect(() => {
    let filtered = players.filter(p => {
      return (
        (filters.position ? p.position === filters.position : true) &&
        (filters.team ? p.team === filters.team : true) &&
        (filters.byeWeek ? p.byeWeek === filters.byeWeek : true) &&
        (p.fantasy_points_ppr >= filters.minPoints) &&
        (p.snap_percentage >= filters.minUsage)
      );
    });
    setFilteredPlayers(filtered);
  }, [filters, players]);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Fantasy Player Stats</h1>
      <StatsHeader 
        scoringFormat={scoringFormat} 
        setScoringFormat={setScoringFormat}
        filters={filters}
        setFilters={setFilters}
      />
      <StatsTable 
        players={filteredPlayers} 
        scoringFormat={scoringFormat} 
        onPlayerClick={handlePlayerClick} 
      />
      {selectedPlayer && (
        <PlayerModal 
          player={selectedPlayer} 
          onClose={() => setSelectedPlayer(null)}
          scoringFormat={scoringFormat}
        />
      )}
    </div>
  );
}