import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // For Chart.js

const getDepthPositionLabel = (depthRank) => {
  switch (depthRank) {
    case 1: return 'Starter';
    case 2: return 'Backup';
    case 3: return '3rd String';
    case 4: return '4th String';
    case 5: return '5th String';
    default: return 'Depth';
  }
};

const DepthChart = () => {
  const [teamId, setTeamId] = useState(null);
  const [depthData, setDepthData] = useState({});
  const [viewMode, setViewMode] = useState('current'); // 'current', 'projected', 'historical'
  const [selectedSeason, setSelectedSeason] = useState(2025); // For historical view, default to 2025
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRefs = useRef({});

  // Parse teamId from URL query on initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const team = urlParams.get('team');
    if (team) {
      setTeamId(team.toUpperCase()); // Ensure uppercase for consistency with DB
    } else {
      setError("No team specified in URL. Please navigate from a team page (e.g., /teams/DAL).");
      setIsLoading(false);
    }
  }, []);

  // Fetch depth chart data based on teamId, viewMode, and selectedSeason
  useEffect(() => {
    if (!teamId) return; // Don't fetch until teamId is set

    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors

      let apiUrl = `${window.location.origin}/api/depth-chart?team=${teamId}&viewMode=${viewMode}`;
      if (viewMode === 'historical') {
        apiUrl += `&season=${selectedSeason}`;
      }

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to fetch depth data for ${viewMode} view.`);
        }
        setDepthData(data);
      } catch (err) {
        console.error("Error fetching depth chart data:", err);
        setError(err.message);
        setDepthData({}); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup Chart instances on unmount or viewMode/season change
    return () => {
      Object.values(chartRefs.current).forEach(ref => {
        if (ref && ref.chartInstance) {
          ref.chartInstance.destroy();
          ref.chartInstance = null;
        }
      });
    };
  }, [teamId, viewMode, selectedSeason]);

  // Effect to initialize/update Chart.js instances for unit strength
  useEffect(() => {
    // Destroy all existing charts when depthData changes or component mounts/unmounts
    Object.values(chartRefs.current).forEach(ref => {
      if (ref && ref.chartInstance) {
        ref.chartInstance.destroy();
        ref.chartInstance = null;
      }
    });

    if (!depthData || Object.keys(depthData).length === 0 || !depthData.unit_strength) {
      return; // Skip if no data or unit_strength is missing
    }

    const categories = ['QB', 'RB', 'WR', 'OL', 'DL', 'LB', 'DB', 'ST']; // Define categories for charts

    categories.forEach((pos) => {
      if (depthData.unit_strength[pos] != null && chartRefs.current[pos]) {
        const newChart = new Chart(chartRefs.current[pos].getContext('2d'), {
          type: 'bar',
          data: {
            labels: [pos],
            datasets: [{
              label: 'Unit Strength',
              data: [depthData.unit_strength[pos]],
              backgroundColor: '#34D399', // A nice green color
              borderColor: '#059669',
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true, mode: 'index', intersect: false }
            },
            scales: {
              y: { beginAtZero: true, max: 100, ticks: { color: '#000000' } },
              x: { ticks: { color: '#000000' } }
            }
          },
        });
        chartRefs.current[pos].chartInstance = newChart;
      }
    });
  }, [depthData]); // Re-run when depthData changes


  // Helper to render groups of positions
  const renderPositionGroup = (positions, title) => (
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {positions.map(position => {
            const players = depthData[position] || [];
            if (players.length === 0) return null; // Only render if players exist for the position
  
            return (
              <div key={position} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-lg text-blue-700 mb-2">{position}</h4>
                <ul className="space-y-2 text-black">
                  {players.map(player => (
                    <li key={player.player_id} className="flex items-center space-x-2">
                      <img
                        src={player.headshot_url || `https://placehold.co/40x40/E2E8F0/1A202C?text=Player`}
                        alt={`${player.player_name} headshot`}
                        className="w-8 h-8 rounded-full object-cover bg-white border border-gray-300"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/E2E8F0/1A202C?text=Player'; }}
                      />
                      <span className="font-medium">#{player.jersey_number} {player.player_name}</span>
                      <span className="text-gray-600 text-sm">({getDepthPositionLabel(player.depth_rank)})</span>
                      {player.injury_status && ( // Only show injury status if it exists
                        <span className="ml-auto px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                          {player.injury_status.startsWith('Q') ? 'Q' : (player.injury_status.startsWith('D') ? 'D' : 'IR')}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                {/* Unit Strength Chart */}
                {depthData.unit_strength?.[position] != null && (
                  <div className="h-24 w-full mt-4">
                    <canvas ref={(ref) => (chartRefs.current[position] = ref)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );

  const years = Array.from({ length: 2025 - 1999 + 1 }, (_, i) => 1999 + i).reverse(); // 2025 down to 1999


  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900 font-sans">
      <div className="container mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6 flex items-center">
          Depth Chart for {teamId || 'Selected Team'}
        </h1>

        {/* View Mode & Season Selection */}
        <div className="mb-6 flex flex-wrap items-center space-x-4">
          <button
            onClick={() => setViewMode('current')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'current' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Current (2025)
          </button>
          <button
            onClick={() => setViewMode('projected')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'projected' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Projected
          </button>
          <button
            onClick={() => setViewMode('historical')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'historical' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Historical
          </button>
          {viewMode === 'historical' && (
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
              className="ml-4 p-2 border rounded-lg bg-white text-gray-800"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}
        </div>

        {error ? (
          <div className="text-red-600 p-4 bg-red-100 rounded-lg">{error}</div>
        ) : isLoading ? (
          <div className="text-center text-lg text-blue-600">Loading Depth Chart...</div>
        ) : (
          <div className="relative w-full">
            {Object.keys(depthData).filter(key => key !== 'unit_strength' && key !== 'message').length === 0 ? (
                <p className="text-black p-4 bg-yellow-50 rounded-lg">
                    {depthData.message || `No specific depth chart data available for ${teamId || 'the selected team'} for ${viewMode} view ${viewMode === 'historical' ? `in ${selectedSeason}` : ''}.`}
                </p>
            ) : (
                <>
                    {renderPositionGroup(['QB', 'RB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT'], 'Offense')}
                    {renderPositionGroup(['DE', 'DT', 'LB', 'CB', 'S', 'NT'], 'Defense')}
                    {renderPositionGroup(['K', 'P', 'LS'], 'Special Teams')}
                    {/* Render any other positions not categorized above */}
                    {Object.keys(depthData)
                    .filter(pos => ![...['QB', 'RB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT'], ...['DE', 'DT', 'LB', 'CB', 'S', 'NT'], ...['K', 'P', 'LS'], 'unit_strength'].includes(pos))
                    .length > 0 && (
                        renderPositionGroup(
                        Object.keys(depthData).filter(pos => ![...['QB', 'RB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT'], ...['DE', 'DT', 'LB', 'CB', 'S', 'NT'], ...['K', 'P', 'LS'], 'unit_strength'].includes(pos)),
                        'Other Positions'
                        )
                    )}
                </>
            )}
          </div>
        )}

        {/* Analyst Commentary */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Analyst Notes</h3>
          <p className="text-gray-700">This section provides commentary on the team's depth, potential changes, and player performance implications.</p>
        </div>
      </div>
    </div>
  );
};

export default DepthChart;
