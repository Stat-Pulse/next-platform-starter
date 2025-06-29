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

const DepthChart = () => {
  const [teamId, setTeamId] = useState(null);
  const [depthData, setDepthData] = useState({});
  const [viewMode, setViewMode] = useState('current'); // 'current', 'projected', 'historical'
  const [selectedSeason, setSelectedSeason] = useState(2024); // Default to 2024 as per current data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // chartRefs is not directly used for unit strength bars on player cards in this layout,
  // but kept in case you want to add summary charts later.
  const chartRefs = useRef({});

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

    // Cleanup function for Chart.js instances (if any are used, e.g., for summary graphs)
    return () => {
      Object.values(chartRefs.current).forEach(ref => {
        if (ref && ref.chartInstance) {
          ref.chartInstance.destroy();
          ref.chartInstance = null;
        }
      });
    };
  }, [teamId, viewMode, selectedSeason]); // Dependencies for refetching data

  // --- Helper to render a single player card with mock PFF-like data ---
  // IMPORTANT: 'pff_grade', 'pff_rank', 'height_inches', 'weight_pounds', 'college', 'experience', 'contract_apy', 'contract_year'
  // are NOT coming from your current API. These are mocked for visual demonstration.
  // You need to extend your backend API and database to provide these for real data.
  const renderPlayerCard = (player, primaryPositionAbbr, isDefense = false) => {
    // Mock data for demonstration purposes to match the screenshot's detail
    const mockPffGrade = (Math.random() * (95 - 50) + 50).toFixed(1);
    const mockPffRank = Math.floor(Math.random() * 100) + 1;
    const mockTotalPlayers = Math.floor(Math.random() * (150 - 100) + 100);
    const mockHeightInches = Math.floor(Math.random() * (78 - 68) + 68); // 5'8" to 6'6"
    const mockWeightPounds = Math.floor(Math.random() * (320 - 180) + 180);
    const feet = Math.floor(mockHeightInches / 12);
    const inches = mockHeightInches % 12;

    const mockInjuryStatus = player.injury_status; // Use real injury status if available

    return (
      <div key={player.player_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 text-gray-800 text-sm h-full flex flex-col justify-between">
        <div className="flex items-center mb-1">
          <img
            src={player.headshot_url || `https://placehold.co/40x40/E2E8F0/1A202C?text=${primaryPositionAbbr}`}
            alt={`${player.player_name} headshot`}
            className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-300 mr-2 flex-shrink-0"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40/E2E8F0/1A202C?text=${primaryPositionAbbr}`; }}
          />
          <div className="flex-grow">
            <div className="font-bold text-base leading-tight">#{player.jersey_number} {player.player_name}</div>
            <div className="text-xs text-gray-600">{getDepthPositionLabel(player.depth_rank)}</div>
          </div>
        </div>
        <div className="text-xs text-gray-700 leading-tight">
          <div className="font-semibold">{primaryPositionAbbr}</div>
          <div className="text-xs text-gray-500 mb-1">
            {mockHeightInches ? `${feet}'${inches}"` : '—'} / {mockWeightPounds ? `${mockWeightPounds} lbs` : '—'} {isDefense ? 'D' : 'O'}{primaryPositionAbbr.substring(0,1)}
          </div>
          <div className="flex justify-between items-end">
            <span className="font-bold text-blue-600">{mockPffGrade}</span>
            <span className="text-gray-500 text-xs">
              {mockPffRank} / {mockTotalPlayers} {primaryPositionAbbr}
            </span>
          </div>
          {mockInjuryStatus && (
            <div className="text-red-500 font-bold text-xs mt-1">
              {mockInjuryStatus.startsWith('Q') ? 'Q' : (mockInjuryStatus.startsWith('D') ? 'D' : 'INJ')}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Helper to get starters for a specific position, with fallback for multiple WR/TE/LB etc.
  const getStartersForPosition = (posAbbr, count = 1) => {
    const players = (depthData[posAbbr] || []).filter(p => p.depth_rank === 1);
    return players.slice(0, count);
  };

  const years = Array.from({ length: 2024 - 1999 + 1 }, (_, i) => 1999 + i).reverse();

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b-2 pb-3 border-blue-600 flex items-center">
          <span className="mr-3 text-blue-600">📊</span> Depth Chart for {teamId || 'Selected Team'}
        </h1>

        {/* View Mode & Season Selection */}
        <div className="mb-8 flex flex-wrap items-center space-x-4">
          <button
            onClick={() => setViewMode('current')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-md
              ${viewMode === 'current' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            Current (2024)
          </button>
          <button
            onClick={() => setViewMode('projected')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-md
              ${viewMode === 'projected' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            Projected
          </button>
          <button
            onClick={() => setViewMode('historical')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-md
              ${viewMode === 'historical' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            Historical
          </button>
          {viewMode === 'historical' && (
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
              className="ml-4 p-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}
        </div>

        {/* Loading, Error, or No Data Messages */}
        {error ? (
          <div className="text-red-700 p-5 bg-red-50 border border-red-200 rounded-lg text-center font-medium">
            Error: {error}
          </div>
        ) : isLoading ? (
          <div className="text-center text-lg text-blue-600 p-5 bg-blue-50 rounded-lg">Loading Depth Chart...</div>
        ) : (
          <div className="relative w-full overflow-hidden rounded-lg shadow-inner border border-gray-300">
            {/* Background Grid - mimicking lines from screenshot */}
            <div className="absolute inset-0 grid grid-rows-7 z-0">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className={`h-full ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200 last:border-b-0`}></div>
                ))}
            </div>

            {Object.keys(depthData).filter(key => key !== 'unit_strength' && key !== 'message').length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <p className="text-gray-700 p-5 bg-yellow-50 border border-yellow-200 rounded-lg text-center font-medium">
                      {depthData.message || `No specific depth chart data available for ${teamId || 'the selected team'} for ${viewMode} view ${viewMode === 'historical' ? `in ${selectedSeason}` : ''}.`}
                  </p>
                </div>
            ) : (
                <div className="relative z-10"> {/* Content wrapper */}
                    {/* Defensive Side (Top) */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 p-4">
                        <div className="col-span-2 lg:col-span-1 flex flex-col items-center">
                            {getStartersForPosition('FS').map(player => renderPlayerCard(player, 'FS', true))}
                        </div>
                        <div className="col-span-2 lg:col-span-1 flex flex-col items-center">
                            {getStartersForPosition('SS').map(player => renderPlayerCard(player, 'SS', true))}
                        </div>
                        {/* Defensive Line */}
                        <div className="col-span-2 lg:col-span-3 grid grid-cols-5 gap-4 justify-center items-end mt-4">
                            <div className="flex flex-col items-center justify-end">
                                <span className="text-xs font-semibold text-gray-700 mb-1">CB</span>
                                {getStartersForPosition('CB',1).map(player => renderPlayerCard(player, 'CB', true))}
                            </div>
                            <div className="flex flex-col items-center justify-end">
                                <span className="text-xs font-semibold text-gray-700 mb-1">DRE</span>
                                {getStartersForPosition('DE',1).map(player => renderPlayerCard(player, 'DE', true))}
                            </div>
                            <div className="flex flex-col items-center justify-end">
                                <span className="text-xs font-semibold text-gray-700 mb-1">DRT</span>
                                {getStartersForPosition('DT',1).map(player => renderPlayerCard(player, 'DT', true))}
                            </div>
                            <div className="flex flex-col items-center justify-end">
                                <span className="text-xs font-semibold text-gray-700 mb-1">DLT</span>
                                {getStartersForPosition('DT',2).map(player => renderPlayerCard(player, 'DT', true))}
                            </div>
                            <div className="flex flex-col items-center justify-end">
                                <span className="text-xs font-semibold text-gray-700 mb-1">DLE</span>
                                {getStartersForPosition('DE',2).map(player => renderPlayerCard(player, 'DE', true))}
                            </div>
                             <div className="col-span-5 grid grid-cols-2 gap-4 justify-center items-end mt-4">
                                <div className="flex flex-col items-center justify-end">
                                    <span className="text-xs font-semibold text-gray-700 mb-1">WILL</span>
                                    {getStartersForPosition('LB',1).map(player => renderPlayerCard(player, 'LB', true))}
                                </div>
                                <div className="flex flex-col items-center justify-end">
                                    <span className="text-xs font-semibold text-gray-700 mb-1">MIKE</span>
                                    {getStartersForPosition('LB',2).map(player => renderPlayerCard(player, 'LB', true))}
                                </div>
                                <div className="flex flex-col items-center justify-end">
                                    <span className="text-xs font-semibold text-gray-700 mb-1">SAM</span>
                                    {getStartersForPosition('LB',3).map(player => renderPlayerCard(player, 'LB', true))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Central Star Logo */}
                    <div className="flex justify-center items-center py-6">
                        <svg className="w-24 h-24 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 .587l3.668 7.568 7.378 1.071-5.352 5.212 1.265 7.351L12 18.232l-6.509 3.427 1.265-7.351-5.352-5.212 7.378-1.071L12 .587z"/>
                        </svg>
                    </div>

                    {/* Offensive Side (Bottom) */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 p-4">
                        <div className="col-span-2 lg:col-span-3 grid grid-cols-5 gap-4 justify-center items-start mb-4">
                            <div className="flex flex-col items-center justify-start">
                                <span className="text-xs font-semibold text-gray-700 mb-1">WR</span>
                                {getStartersForPosition('WR',1).map(player => renderPlayerCard(player, 'WR'))}
                            </div>
                            <div className="flex flex-col items-center justify-start">
                                <span className="text-xs font-semibold text-gray-700 mb-1">LT</span>
                                {getStartersForPosition('LT').map(player => renderPlayerCard(player, 'LT'))}
                            </div>
                            <div className="flex flex-col items-center justify-start">
                                <span className="text-xs font-semibold text-gray-700 mb-1">LG</span>
                                {getStartersForPosition('LG').map(player => renderPlayerCard(player, 'LG'))}
                            </div>
                            <div className="flex flex-col items-center justify-start">
                                <span className="text-xs font-semibold text-gray-700 mb-1">C</span>
                                {getStartersForPosition('C').map(player => renderPlayerCard(player, 'C'))}
                            </div>
                            <div className="flex flex-col items-center justify-start">
                                <span className="text-xs font-semibold text-gray-700 mb-1">RG</span>
                                {getStartersForPosition('RG').map(player => renderPlayerCard(player, 'RG'))}
                            </div>
                            <div className="flex flex-col items-center justify-start">
                                <span className="text-xs font-semibold text-gray-700 mb-1">RT</span>
                                {getStartersForPosition('RT').map(player => renderPlayerCard(player, 'RT'))}
                            </div>
                            <div className="flex flex-col items-center justify-start">
                                <span className="text-xs font-semibold text-gray-700 mb-1">WR</span>
                                {getStartersForPosition('WR',2).map(player => renderPlayerCard(player, 'WR'))}
                            </div>
                             <div className="col-span-5 grid grid-cols-3 gap-4 justify-center items-start mt-4">
                                <div className="flex flex-col items-center justify-start">
                                    <span className="text-xs font-semibold text-gray-700 mb-1">SLOT</span>
                                    {getStartersForPosition('WR',3).map(player => renderPlayerCard(player, 'SLOT'))}
                                </div>
                                <div className="flex flex-col items-center justify-start">
                                    <span className="text-xs font-semibold text-gray-700 mb-1">TE</span>
                                    {getStartersForPosition('TE').map(player => renderPlayerCard(player, 'TE'))}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 lg:col-span-1 flex flex-col items-center mt-4">
                            {getStartersForPosition('QB').map(player => renderPlayerCard(player, 'QB'))}
                        </div>
                        <div className="col-span-2 lg:col-span-1 flex flex-col items-center mt-4">
                            {getStartersForPosition('RB').map(player => renderPlayerCard(player, 'RB'))}
                        </div>
                    </div>
                </div>
            )}
          </div>
        )}

        {/* Overall Unit Strength Section - remains outside the main lineup display for clarity */}
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
            This interactive depth chart provides a detailed visual overview of starter positioning.
            Player placements are approximate representations of a typical formation.
            Use the view mode and season selectors to explore current, projected, or historical lineups.
            <br/><br/>
            **Note:** Player attribute details (height, weight, PFF grades/ranks) are currently mocked for display purposes. For real data, please extend your backend API and database to include these fields.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepthChart;
