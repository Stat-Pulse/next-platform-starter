import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

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

const DepthChart = () => {
  const [teamId, setTeamId] = useState(null);
  const [depthData, setDepthData] = useState({});
  const [viewMode, setViewMode] = useState('current'); // 'current', 'projected', 'historical'
  const [selectedSeason, setSelectedSeason] = useState(2024); // Default to 2024 as per current data
  const [activeUnit, setActiveUnit] = useState('offense'); // 'offense', 'defense', 'specialTeams'
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
  const renderPlayerCard = (player, positionAbbr) => (
    <div
      key={player.player_id}
      className="bg-gray-900/80 text-white rounded-md p-1 sm:p-2 shadow-lg border border-gray-700 text-center transform hover:scale-105 transition-transform duration-200 ease-in-out cursor-pointer
                 min-w-[70px] max-w-[110px] sm:min-w-[80px] sm:max-w-[120px] md:min-w-[90px] md:max-w-[130px]
                 flex flex-col items-center justify-center"
    >
      <img
        src={player.headshot_url || `https://placehold.co/40x40/E2E8F0/1A202C?text=${positionAbbr}`}
        alt={`${player.player_name} headshot`}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover bg-gray-700 border border-gray-500 mb-1"
        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40/E2E8F0/1A202C?text=${positionAbbr}`; }}
      />
      <div className="text-[10px] sm:text-xs font-semibold leading-tight text-white whitespace-nowrap overflow-hidden text-ellipsis w-full">
        {player.player_name}
      </div>
      <div className="text-[9px] sm:text-[10px] text-gray-400">
        #{player.jersey_number} {getDepthPositionLabel(player.depth_rank)}
      </div>
      {player.injury_status && (
        <span className="text-[8px] sm:text-[9px] font-bold text-red-400 mt-0.5 block">
          {player.injury_status.startsWith('Q') ? 'Q' : (player.injury_status.startsWith('D') ? 'D' : 'INJ')}
        </span>
      )}
    </div>
  );

  // --- Component to render a position group on the field ---
  const FieldPositionGroup = ({ players, style, positionLabel }) => {
    // Filter to only show starters (depth_rank: 1)
    const starters = players.filter(p => p.depth_rank === 1);
    if (starters.length === 0) return null;

    // Display the first starter for the position
    const mainPlayer = starters[0];

    return (
      <div className="absolute flex flex-col items-center z-10" style={style}>
        {renderPlayerCard(mainPlayer, positionLabel)}
      </div>
    );
  };

  // Define explicit positions on the vertical field (percentages relative to the field container)
  const fieldPositions = {
    // Offensive positions (assuming team is at bottom, driving upwards)
    QB: { top: '85%', left: '50%', transform: 'translate(-50%, -50%)' },
    RB: { top: '78%', left: '50%', transform: 'translate(-50%, -50%)' },
    WR1: { top: '70%', left: '15%', transform: 'translate(-50%, -50%)' }, // Left outside receiver
    WR2: { top: '70%', left: '85%', transform: 'translate(-50%, -50%)' }, // Right outside receiver
    SLOT: { top: '73%', left: '65%', transform: 'translate(-50%, -50%)' }, // Slot receiver (approx.)
    TE: { top: '73%', left: '35%', transform: 'translate(-50%, -50%)' }, // Tight End (approx.)
    LT: { top: '75%', left: '40%', transform: 'translate(-50%, -50%)' },
    LG: { top: '75%', left: '46%', transform: 'translate(-50%, -50%)' },
    C: { top: '75%', left: '50%', transform: 'translate(-50%, -50%)' },
    RG: { top: '75%', left: '54%', transform: 'translate(-50%, -50%)' },
    RT: { top: '75%', left: '60%', transform: 'translate(-50%, -50%)' },

    // Defensive positions (assuming team is at top, defending downwards)
    DE1: { top: '15%', left: '15%', transform: 'translate(-50%, -50%)' },
    DE2: { top: '15%', left: '85%', transform: 'translate(-50%, -50%)' },
    DT1: { top: '20%', left: '40%', transform: 'translate(-50%, -50%)' },
    DT2: { top: '20%', left: '60%', transform: 'translate(-50%, -50%)' },
    NT: { top: '20%', left: '50%', transform: 'translate(-50%, -50%)' },
    LB_MLB: { top: '30%', left: '50%', transform: 'translate(-50%, -50%)' },
    LB_OLB1: { top: '25%', left: '30%', transform: 'translate(-50%, -50%)' },
    LB_OLB2: { top: '25%', left: '70%', transform: 'translate(-50%, -50%)' },
    CB1: { top: '5%', left: '5%', transform: 'translate(-50%, -50%)' },
    CB2: { top: '5%', left: '95%', transform: 'translate(-50%, -50%)' },
    S1: { top: '10%', left: '35%', transform: 'translate(-50%, -50%)' },
    S2: { top: '10%', left: '65%', transform: 'translate(-50%, -50%)' },

    // Special Teams positions (kickoff/punt formation, very simplified)
    K: { top: '90%', left: '50%', transform: 'translate(-50%, -50%)' },
    P: { top: '90%', left: '50%', transform: 'translate(-50%, -50%)' },
    LS: { top: '75%', left: '50%', transform: 'translate(-50%, -50%)' },
  };

  // Helper to get players for a specific granular position (e.g., 'LT')
  const getStartersForPosition = (posAbbr) => {
    return (depthData[posAbbr] || []).filter(p => p.depth_rank === 1);
  };

  const years = Array.from({ length: 2024 - 1999 + 1 }, (_, i) => 1999 + i).reverse();

  // Determine which player sets to render based on activeUnit
  const renderPlayersOnField = () => {
    if (Object.keys(depthData).filter(key => key !== 'unit_strength' && key !== 'message').length === 0) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-300 p-5 bg-gray-700/80 border border-gray-600 rounded-lg text-center font-medium">
              {depthData.message || `No specific depth chart data available for ${teamId || 'the selected team'} for ${viewMode} view ${viewMode === 'historical' ? `in ${selectedSeason}` : ''}.`}
          </p>
        </div>
      );
    }

    // Heuristic for spreading out players if a single position (e.g., WR, DE) returns multiple starters
    // This assumes specific player names or sub-positions might not be in the data.
    // Adjust `slice` indices or logic if your backend provides more granular position fields (e.g., WR1, WR2)
    if (activeUnit === 'offense') {
      return (
        <>
          <FieldPositionGroup players={getStartersForPosition('QB')} style={fieldPositions.QB} positionLabel="QB" />
          <FieldPositionGroup players={getStartersForPosition('RB').slice(0,1)} style={fieldPositions.RB} positionLabel="RB" />
          <FieldPositionGroup players={getStartersForPosition('WR').slice(0,1)} style={fieldPositions.WR1} positionLabel="WR1" />
          <FieldPositionGroup players={getStartersForPosition('WR').slice(1,2)} style={fieldPositions.WR2} positionLabel="WR2" />
          <FieldPositionGroup players={getStartersForPosition('WR').slice(2,3)} style={fieldPositions.SLOT} positionLabel="SLOT" />
          <FieldPositionGroup players={getStartersForPosition('TE').slice(0,1)} style={fieldPositions.TE} positionLabel="TE" />
          <FieldPositionGroup players={getStartersForPosition('LT').slice(0,1)} style={fieldPositions.LT} positionLabel="LT" />
          <FieldPositionGroup players={getStartersForPosition('LG').slice(0,1)} style={fieldPositions.LG} positionLabel="LG" />
          <FieldPositionGroup players={getStartersForPosition('C').slice(0,1)} style={fieldPositions.C} positionLabel="C" />
          <FieldPositionGroup players={getStartersForPosition('RG').slice(0,1)} style={fieldPositions.RG} positionLabel="RG" />
          <FieldPositionGroup players={getStartersForPosition('RT').slice(0,1)} style={fieldPositions.RT} positionLabel="RT" />
        </>
      );
    } else if (activeUnit === 'defense') {
      return (
        <>
          <FieldPositionGroup players={getStartersForPosition('DE').slice(0,1)} style={fieldPositions.DE1} positionLabel="DE1" />
          <FieldPositionGroup players={getStartersForPosition('DE').slice(1,2)} style={fieldPositions.DE2} positionLabel="DE2" />
          <FieldPositionGroup players={getStartersForPosition('DT').slice(0,1)} style={fieldPositions.DT1} positionLabel="DT1" />
          <FieldPositionGroup players={getStartersForPosition('DT').slice(1,2)} style={fieldPositions.DT2} positionLabel="DT2" />
          <FieldPositionGroup players={getStartersForPosition('NT').slice(0,1)} style={fieldPositions.NT} positionLabel="NT" />
          <FieldPositionGroup players={getStartersForPosition('LB').slice(0,1)} style={fieldPositions.LB_MLB} positionLabel="MLB" />
          <FieldPositionGroup players={getStartersForPosition('LB').slice(1,2)} style={fieldPositions.LB_OLB1} positionLabel="OLB1" />
          <FieldPositionGroup players={getStartersForPosition('LB').slice(2,3)} style={fieldPositions.LB_OLB2} positionLabel="OLB2" />
          <FieldPositionGroup players={getStartersForPosition('CB').slice(0,1)} style={fieldPositions.CB1} positionLabel="CB1" />
          <FieldPositionGroup players={getStartersForPosition('CB').slice(1,2)} style={fieldPositions.CB2} positionLabel="CB2" />
          <FieldPositionGroup players={getStartersForPosition('S').slice(0,1)} style={fieldPositions.S1} positionLabel="S1" />
          <FieldPositionGroup players={getStartersForPosition('S').slice(1,2)} style={fieldPositions.S2} positionLabel="S2" />
        </>
      );
    } else if (activeUnit === 'specialTeams') {
      return (
        <>
          <FieldPositionGroup players={getStartersForPosition('K').slice(0,1)} style={fieldPositions.K} positionLabel="K" />
          <FieldPositionGroup players={getStartersForPosition('P').slice(0,1)} style={fieldPositions.P} positionLabel="P" />
          <FieldPositionGroup players={getStartersForPosition('LS').slice(0,1)} style={fieldPositions.LS} positionLabel="LS" />
        </>
      );
    }
    return null;
  };


  return (
    <div className="min-h-screen bg-gray-900 p-6 font-sans text-gray-100">
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-6 border-b-2 pb-3 border-blue-600">
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

        {/* Unit Selection Buttons */}
        <div className="mb-8 flex flex-wrap items-center justify-center space-x-4">
          <button
            onClick={() => setActiveUnit('offense')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-md
              ${activeUnit === 'offense' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-600 text-gray-200 hover:bg-gray-700'}`}
          >
            Offense
          </button>
          <button
            onClick={() => setActiveUnit('defense')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-md
              ${activeUnit === 'defense' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-600 text-gray-200 hover:bg-gray-700'}`}
          >
            Defense
          </button>
          <button
            onClick={() => setActiveUnit('specialTeams')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-md
              ${activeUnit === 'specialTeams' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-600 text-gray-200 hover:bg-gray-700'}`}
          >
            Special Teams
          </button>
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
            className="relative w-full aspect-[9/16] max-h-[800px] mx-auto bg-gray-700 rounded-lg shadow-inner overflow-hidden border border-gray-600" // Vertical aspect ratio and max height
            style={{
              // Base64 encoded SVG for vertical football field lines (grey, black lines, dark grey endzones, 7 rectangles)
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 1000'%3E%3Crect width='100%25' height='100%25' fill='%236B7280'/%3E%3C!-- End Zones --%3E%3Crect x='0' y='0' width='100%25' height='5%25' fill='%23374151'/%3E%3Crect x='0' y='95%25' width='100%25' height='5%25' fill='%23374151'/%3E%3C!-- 6 lines for 7 even rectangles --%3E%3Cline x1='0' y1='17.857%25' x2='100%25' y2='17.857%25' stroke='%23000' stroke-width='2'/%3E%3Cline x1='0' y1='30.714%25' x2='100%25' y2='30.714%25' stroke='%23000' stroke-width='2'/%3E%3Cline x1='0' y1='43.571%25' x2='100%25' y2='43.571%25' stroke='%23000' stroke-width='2'/%3E%3Cline x1='0' y1='56.428%25' x2='100%25' y2='56.428%25' stroke='%23000' stroke-width='2'/%3E%3Cline x1='0' y1='69.285%25' x2='100%25' y2='69.285%25' stroke='%23000' stroke-width='2'/%3E%3Cline x1='0' y1='82.142%25' x2='100%25' y2='82.142%25' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E")`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center'
            }}
          >
            {renderPlayersOnField()}
          </div>
        )}

        {/* Overall Unit Strength Section (placed below the field for clarity) */}
        {depthData.unit_strength && Object.keys(depthData.unit_strength).filter(key => key !== 'message').length > 0 && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-xl font-bold text-blue-400 mb-4 border-b pb-2 border-blue-600">Overall Unit Strengths</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
            This interactive depth chart provides a dynamic visual overview of player positioning on the field for starters.
            Toggle between Offense, Defense, and Special Teams to see the primary lineup.
            Player placements are approximate and based on typical formations for the selected unit.
            Use the view mode and season selectors to explore current, projected, or historical lineups.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepthChart;
