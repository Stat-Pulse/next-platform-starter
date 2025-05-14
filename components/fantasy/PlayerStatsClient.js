// File: components/fantasy/PlayerStatsClient.js

import React, { useState, useEffect } from 'react';
import ScoringToggle from './ScoringToggle';
import FantasyFilters from './FantasyFilters';
import FantasyTable from './FantasyTable';
import PlayerModal from './PlayerModal';
import TrendGraph from './TrendGraph';
import FantasyCompare from './FantasyCompare';

export default function PlayerStatsClient() {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [scoringFormat, setScoringFormat] = useState('ppr'); // 'std', 'half'
  const [sortDescending, setSortDescending] = useState(true);

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
      try {
        const [qbsRes, rbsRes, wrsRes, tesRes] = await Promise.all([
          fetch('/data/2024_qbs_sorted.json'),
          fetch('/data/2024_rbs_sorted.json'),
          fetch('/data/2024_wrs_sorted.json'),
          fetch('/data/2024_tes_sorted.json'),
        ]);

        const [qbs, rbs, wrs, tes] = await Promise.all([
          qbsRes.json(),
          rbsRes.json(),
          wrsRes.json(),
          tesRes.json(),
        ]);

        const allPlayers = [...qbs, ...rbs, ...wrs, ...tes];
        setPlayers(allPlayers);
        setFilteredPlayers(allPlayers);
      } catch (error) {
        console.error("Failed to load player data:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = players
      .filter(p => {
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
      })
      .sort((a, b) => {
        const ap =
          scoringFormat === 'ppr'
            ? a.fantasy_points_ppr
            : scoringFormat === 'half'
            ? a.fantasy_points_half_ppr
            : a.fantasy_points_std;

        const bp =
          scoringFormat === 'ppr'
            ? b.fantasy_points_ppr
            : scoringFormat === 'half'
            ? b.fantasy_points_half_ppr
            : b.fantasy_points_std;

        return sortDescending ? bp - ap : ap - bp;
      });

    setFilteredPlayers(filtered);
  }, [filters, players, scoringFormat, sortDescending]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Fantasy Player Stats</h1>

      <ScoringToggle format={scoringFormat} setFormat={setScoringFormat} />

      <div className="mt-4">
        <FantasyFilters filters={filters} setFilters={setFilters} />

        <div className="mt-2 text-right">
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() =>
              setFilters({
                position: '',
                team: '',
                byeWeek: '',
                minPoints: 0,
                minUsage: 0,
              })
            }
          >
            Reset Filters
          </button>
        </div>

        <div className="mt-2 text-right">
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => setSortDescending(prev => !prev)}
          >
            Sort: {sortDescending ? 'High → Low' : 'Low → High'}
          </button>
        </div>
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