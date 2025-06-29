import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Still used for overall unit strength or if we add it back consolidated

// Helper function to get readable depth position label
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

// Main DepthChart component
const DepthChart = () => {
  const [teamId, setTeamId] = useState(null);
  const [depthData, setDepthData] = useState({});
  const [viewMode, setViewMode] = useState('current'); // 'current', 'projected', 'historical'
  const [selectedSeason, setSelectedSeason] = useState(2024); // Default to 2024 as per current data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRefs = useRef({}); // Ref for Chart.js canvases (if used for consolidated charts later)

  // --- Effect to parse teamId from URL query on initial load ---
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

  // --- Effect to fetch depth chart data based on teamId, viewMode, and selectedSeason ---
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

    // Cleanup function for Chart.js instances (if used globally or consolidated later)
    return () => {
      Object.values(chartRefs.current).forEach(ref => {
        if (ref && ref.chartInstance) {
          ref.chartInstance.destroy();
          ref.chartInstance = null;
        }
      });
    };
  }, [teamId, viewMode, selectedSeason]); // Dependencies for refetching data

  // --- Helper to render a single player card ---
  const renderPlayerCard = (player) => (
    <div className="bg-gray-900/80 text-white rounded-md p-2 shadow-lg border border-gray-700 text-center transform hover:scale-105 transition-transform duration-200 ease-in-out cursor-pointer min-w-[80px] max-w-[120px]">
      <img
        src={player.headshot_url || `https://placehold.co/40x40/E2E8F0/1A202C?text=P`}
        alt={`${player.player_name} headshot`}
        className="w-12 h-12 rounded-full object-cover bg-gray-700 border border-gray-500 mx-auto mb-1"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/E2E8F0/1A202C?text=P'; }}
      />
      <div className="text-xs font-semibold leading-tight">{player.player_name}</div>
      <div className="text-[10px] text-gray-400">#{player.jersey_number} - {getDepthPositionLabel(player.depth_rank)}</div>
      {player.injury_status && (
        <span className="text-[9px] font-bold text-red-400 mt-0.5 block">
          {player.injury_status.startsWith('Q') ? 'Q' : (player.injury_status.startsWith('D') ? 'D' : 'INJ')}
        </span>
      )}
    </div>
  );

  // --- Component to render a position group on the field ---
  const FieldPositionGroup = ({ players, style, title }) => {
    if (!players || players.length === 0) return null;

    // Arrange players vertically if multiple for a spot, for readability
    return (
      <div className="absolute flex flex-col items-center space-y-1 z-10" style={style}>
        {/* Optional: Position group title for debugging/clarity if desired */}
        {/* <div className="text-white text-xs font-bold bg-black/50 px-1 py-0.5 rounded mb-1">{title}</div> */}
        {players.map(player => (
          <div key={player.player_id}>
            {renderPlayerCard(player)}
          </div>
        ))}
      </div>
    );
  };

  // Define explicit positions on the field (percentages relative to the field container)
  // These are approximations and might need fine-tuning based on the actual background image.
  const fieldPositions = {
    // Offense (assuming they are facing "up" towards defense)
    QB: { top: '75%', left: '50%', transform: 'translateX(-50%)' },
    RB: { top: '80%', left: '45%', transform: 'translateX(-50%)' }, // Slightly wider
    WR_LEFT_OUTSIDE: { top: '60%', left: '10%' },
    WR_RIGHT_OUTSIDE: { top: '60%', right: '10%' },
    WR_SLOT_LEFT: { top: '65%', left: '30%' },
    WR_SLOT_RIGHT: { top: '65%', right: '30%' },
    TE_LEFT: { top: '68%', left: '38%' }, // Closer to offensive line
    TE_RIGHT: { top: '68%', right: '38%' },
    C: { top: '70%', left: '50%', transform: 'translateX(-50%)' },
    LG: { top: '70%', left: '45%' },
    RG: { top: '70%', right: '45%' },
    LT: { top: '70%', left: '40%' },
    RT: { top: '70%', right: '40%' },

    // Defense (assuming they are facing "down" towards offense)
    NT: { top: '28%', left: '50%', transform: 'translateX(-50%)' },
    DT_LEFT: { top: '28%', left: '38%' },
    DT_RIGHT: { top: '28%', right: '38%' },
    DE_LEFT: { top: '25%', left: '20%' },
    DE_RIGHT: { top: '25%', right: '20%' },
    LB_MIDDLE: { top: '20%', left: '50%', transform: 'translateX(-50%)' },
    LB_LEFT_OUTSIDE: { top: '22%', left: '30%' },
    LB_RIGHT_OUTSIDE: { top: '22%', right: '30%' },
    CB_LEFT: { top: '12%', left: '10%' },
    CB_RIGHT: { top: '12%', right: '10%' },
    S_LEFT: { top: '8%', left: '30%' },
    S_RIGHT: { top: '8%', right: '30%' },

    // Special Teams (e.g., punt formation, positioned at one end)
    P: { top: '85%', left: '50%', transform: 'translateX(-50%)' },
    LS: { top: '70%', left: '50%', transform: 'translateX(-50%)' },
    K: { top: '80%', left: '50%', transform: 'translateX(-50%)' }, // Placeholder, often off to the side
  };

  // Helper to get players for a specific granular position (e.g., 'LT')
  const getPlayersForPosition = (posAbbr) => {
    // The backend API might return 'OL' as a group, or granular 'LT', 'LG', etc.
    // We assume it's granular. If it returns 'OL' with players, you'd need to
    // filter that 'OL' array by some 'sub_position' field within player objects.
    return depthData[posAbbr] || [];
  };

  const years = Array.from({ length: 2024 - 1999 + 1 }, (_, i) => 1999 + i).reverse();

  return (
    <div className="min-h-screen bg-gray-900 p-6 font-sans text-gray-100"> {/* Dark background for contrast */}
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-6 border-b-2 pb-3 border-blue-600 flex items-center">
          <span className="mr-3 text-blue-600">📊</span> Depth Chart for {teamId || 'Selected Team'}
        </h1>

        {/* View Mode & Season Selection */}
        <div className="mb-8 flex flex-wrap items-center space-x-4">
          <button
            onClick={() => setViewMode('current')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-md
              ${viewMode === 'current' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-600 text-gray-200 hover:bg-gray-700'}`}
          >
            Current (2024)
          </button>
          <button
            onClick={() => setViewMode('projected')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-md
              ${viewMode === 'projected' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-600 text-gray-200 hover:bg-gray-700'}`}
          >
            Projected
          </button>
          <button
            onClick={() => setViewMode('historical')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-md
              ${viewMode === 'historical' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-600 text-gray-200 hover:bg-gray-700'}`}
          >
            Historical
          </button>
          {viewMode === 'historical' && (
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
              className="ml-4 p-2.5 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}
        </div>

        {/* Loading, Error, or No Data Messages */}
        {error ? (
          <div className="text-red-400 p-5 bg-red-900/50 border border-red-700 rounded-lg text-center font-medium">
            Error: {error}
          </div>
        ) : isLoading ? (
          <div className="text-center text-lg text-blue-400 p-5 bg-blue-900/50 rounded-lg">Loading Depth Chart...</div>
        ) : (
          <div
            className="relative w-full aspect-[16/9] bg-green-800 rounded-lg shadow-inner overflow-hidden" // Use aspect ratio for consistent field shape
            style={{
              backgroundImage: 'url(https://i.imgur.com/kK3hW9c.png)', // Placeholder football field image
              backgroundSize: '100% 100%', // Scale to cover the entire area
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center'
            }}
          >
            {/* Conditional display based on whether any position group has players */}
            {Object.keys(depthData).filter(key => key !== 'unit_strength' && key !== 'message').length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-300 p-5 bg-gray-700/80 border border-gray-600 rounded-lg text-center font-medium">
                      {depthData.message || `No specific depth chart data available for ${teamId || 'the selected team'} for ${viewMode} view ${viewMode === 'historical' ? `in ${selectedSeason}` : ''}.`}
                  </p>
                </div>
            ) : (
                <>
                    {/* Offense */}
                    <FieldPositionGroup players={getPlayersForPosition('QB')} style={fieldPositions.QB} title="QB" />
                    <FieldPositionGroup players={getPlayersForPosition('RB')} style={fieldPositions.RB} title="RB" />
                    <FieldPositionGroup players={getPlayersForPosition('WR').filter(p => p.depth_rank === 1 && p.position === 'WR')} style={fieldPositions.WR_LEFT_OUTSIDE} title="WR (L)" /> {/* Assuming primary WR on left */}
                    <FieldPositionGroup players={getPlayersForPosition('WR').filter(p => p.depth_rank === 2 && p.position === 'WR')} style={fieldPositions.WR_RIGHT_OUTSIDE} title="WR (R)" /> {/* Assuming secondary WR on right */}
                    <FieldPositionGroup players={getPlayersForPosition('WR').filter(p => p.depth_rank === 3 && p.position === 'WR')} style={fieldPositions.WR_SLOT_LEFT} title="WR (SL)" />
                    <FieldPositionGroup players={getPlayersForPosition('TE').filter(p => p.depth_rank === 1)} style={fieldPositions.TE_LEFT} title="TE (L)" />
                    <FieldPositionGroup players={getPlayersForPosition('TE').filter(p => p.depth_rank === 2)} style={fieldPositions.TE_RIGHT} title="TE (R)" />
                    <FieldPositionGroup players={getPlayersForPosition('LT')} style={fieldPositions.LT} title="LT" />
                    <FieldPositionGroup players={getPlayersForPosition('LG')} style={fieldPositions.LG} title="LG" />
                    <FieldPositionGroup players={getPlayersForPosition('C')} style={fieldPositions.C} title="C" />
                    <FieldPositionGroup players={getPlayersForPosition('RG')} style={fieldPositions.RG} title="RG" />
                    <FieldPositionGroup players={getPlayersForPosition('RT')} style={fieldPositions.RT} title="RT" />

                    {/* Defense */}
                    <FieldPositionGroup players={getPlayersForPosition('DE').filter(p => p.depth_rank === 1)} style={fieldPositions.DE_LEFT} title="DE (L)" />
                    <FieldPositionGroup players={getPlayersForPosition('DE').filter(p => p.depth_rank === 2)} style={fieldPositions.DE_RIGHT} title="DE (R)" />
                    <FieldPositionGroup players={getPlayersForPosition('DT').filter(p => p.depth_rank === 1)} style={fieldPositions.DT_LEFT} title="DT (L)" />
                    <FieldPositionGroup players={getPlayersForPosition('DT').filter(p => p.depth_rank === 2)} style={fieldPositions.DT_RIGHT} title="DT (R)" />
                    <FieldPositionGroup players={getPlayersForPosition('NT')} style={fieldPositions.NT} title="NT" />
                    <FieldPositionGroup players={getPlayersForPosition('LB').filter(p => p.depth_rank === 1)} style={fieldPositions.LB_MIDDLE} title="MLB" />
                    <FieldPositionGroup players={getPlayersForPosition('LB').filter(p => p.depth_rank === 2)} style={fieldPositions.LB_LEFT_OUTSIDE} title="OLB (L)" />
                    <FieldPositionGroup players={getPlayersForPosition('LB').filter(p => p.depth_rank === 3)} style={fieldPositions.LB_RIGHT_OUTSIDE} title="OLB (R)" />
                    <FieldPositionGroup players={getPlayersForPosition('CB').filter(p => p.depth_rank === 1)} style={fieldPositions.CB_LEFT} title="CB (L)" />
                    <FieldPositionGroup players={getPlayersForPosition('CB').filter(p => p.depth_rank === 2)} style={fieldPositions.CB_RIGHT} title="CB (R)" />
                    <FieldPositionGroup players={getPlayersForPosition('S').filter(p => p.depth_rank === 1)} style={fieldPositions.S_LEFT} title="S (L)" />
                    <FieldPositionGroup players={getPlayersForPosition('S').filter(p => p.depth_rank === 2)} style={fieldPositions.S_RIGHT} title="S (R)" />

                    {/* Special Teams (simple placement) */}
                    <FieldPositionGroup players={getPlayersForPosition('P')} style={fieldPositions.P} title="P" />
                    <FieldPositionGroup players={getPlayersForPosition('LS')} style={fieldPositions.LS} title="LS" />
                    <FieldPositionGroup players={getPlayersForPosition('K')} style={fieldPositions.K} title="K" />

                    {/* Placeholder for any "Other Positions" not explicitly mapped to field */}
                    {Object.keys(depthData)
                    .filter(pos => ![
                        ...['QB', 'RB', 'WR', 'TE', 'LT', 'LG', 'C', 'RG', 'RT'], // Offense
                        ...['DE', 'DT', 'NT', 'LB', 'CB', 'S'], // Defense
                        ...['K', 'P', 'LS'], // Special Teams
                        'unit_strength', 'message'
                    ].includes(pos))
                    .map(pos => (
                      <FieldPositionGroup
                        key={pos}
                        players={depthData[pos]}
                        style={{ top: '90%', left: `${Math.random() * 80 + 10}%`, transform: 'translateX(-50%)' }} // Random placement for unmapped
                        title={pos}
                      />
                    ))}
                </>
            )}
          </div>
        )}

        {/* Overall Unit Strength Section (re-added outside the field for clarity) */}
        {depthData.unit_strength && Object.keys(depthData.unit_strength).filter(key => key !== 'message').length > 0 && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-xl font-bold text-blue-400 mb-4 border-b pb-2 border-blue-600">Unit Strengths</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Object.entries(depthData.unit_strength).map(([position, strength]) => (
                <div key={position} className="bg-gray-900 p-3 rounded-lg flex flex-col items-center">
                  <div className="text-lg font-semibold text-gray-200 mb-1">{position}</div>
                  <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${strength}%` }}
                      title={`Strength: ${strength}/100`}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{strength}/100</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analyst Commentary */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-xl font-bold text-blue-400 mb-3 border-b pb-2 border-blue-600">Analyst Notes</h3>
          <p className="text-gray-300 text-base">
            This dynamic depth chart provides a visual overview of player positioning on the field.
            Player placements are approximate and based on typical formations.
            Use the toggles above to explore current, projected, or historical lineups for the team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepthChart;
