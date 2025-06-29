import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Kept for Overall Unit Strength section

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

    // Cleanup function for Chart.js instances
    return () => {
      Object.values(chartRefs.current).forEach(ref => {
        if (ref && ref.chartInstance) {
          ref.chartInstance.destroy();
          ref.chartInstance = null;
        }
      });
    };
  }, [teamId, viewMode, selectedSeason]);

  // --- Helper to render a single player card ---
  const renderPlayerCard = (player, primaryPositionAbbr, isDefense = false) => {
    // Mock data for demonstration
    const mockPffGrade = (Math.random() * (95 - 50) + 50).toFixed(1);
    const mockPffRank = Math.floor(Math.random() * 100) + 1;
    const mockTotalPlayers = Math.floor(Math.random() * (150 - 100) + 100);
    const mockHeightInches = Math.floor(Math.random() * (78 - 68) + 68);
    const mockWeightPounds = Math.floor(Math.random() * (320 - 180) + 180);
    const feet = Math.floor(mockHeightInches / 12);
    const inches = mockHeightInches % 12;
    const mockInjuryStatus = player.injury_status;

    return (
      <div key={player.player_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 text-gray-800 text-sm h-full flex flex-col justify-between flex-shrink-0"
           style={{ width: '120px' }}>
        <div className="flex items-center mb-1">
          <img
            src={player.headshot_url || `https://placehold.co/40x40/E2E8F0/1A202C?text=${primaryPositionAbbr}`}
            alt={`${player.player_name} headshot`}
            className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-300 mr-2 flex-shrink-0"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40/E2E8F0/1A202C?text=${primaryPositionAbbr}`; }}
          />
          <div className="flex-grow">
            <div className="font-bold text-base leading-tight">#{player.jersey_number} {player.player_name}</div>
          </div>
        </div>
        <div className="text-xs text-gray-700 leading-tight">
          <div className="font-semibold">{primaryPositionAbbr}</div>
          <div className="text-xs text-gray-500 mb-1">
            {mockHeightInches ? `${feet}'${inches}"` : '—'} / {mockWeightPounds ? `${mockWeightPounds} lbs` : '—'}
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

  // Helper to get starters for a specific position
  const getStartersForPosition = (posAbbr, count = 1) => {
    const players = (depthData[posAbbr] || []).filter(p => p.depth_rank === 1);
    return players.slice(0, count);
  };

  const years = Array.from({ length: 2024 - 1999 + 1 }, (_, i) => 1999 + i).reverse();

  // Combined offense and defense players in one view
  const renderCombinedPlayers = () => {
    if (Object.keys(depthData).filter(key => key !== 'unit_strength' && key !== 'message').length === 0) {
      return (
        <div className="flex items-center justify-center h-full p-8">
          <p className="text-gray-700 p-5 bg-yellow-50 border border-yellow-200 rounded-lg text-center font-medium">
              {depthData.message || `No specific depth chart data available for ${teamId || 'the selected team'} for ${viewMode} view ${viewMode === 'historical' ? `in ${selectedSeason}` : ''}.`}
          </p>
        </div>
      );
    }

    // REVISED: Using justify-center to vertically center the entire formation.
    // Increased gap-y-16 to spread out offense and defense significantly.
    return (
      <div className="flex flex-col h-full justify-center items-center px-2 gap-y-16">
        {/* Defensive Side (Top) */}
        <div className="flex flex-col items-center w-full gap-y-6"> {/* Increased gap between defensive rows */}
            {/* Top Row: FS / SS */}
            <div className="flex justify-center w-full max-w-[450px] mx-auto gap-x-24">
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">FS</span>
                    {getStartersForPosition('S',1).map(player => renderPlayerCard(player, 'FS', true))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">SS</span>
                    {getStartersForPosition('S',2).map(player => renderPlayerCard(player, 'SS', true))}
                </div>
            </div>

            {/* CBs and D-Line/Edge */}
            <div className="flex justify-center w-full max-w-[800px] mx-auto gap-x-6">
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">CB</span>
                    {getStartersForPosition('CB',1).map(player => renderPlayerCard(player, 'CB', true))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">DRE</span>
                    {getStartersForPosition('DE',1).map(player => renderPlayerCard(player, 'DRE', true))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">DRT</span>
                    {getStartersForPosition('DT',1).map(player => renderPlayerCard(player, 'DRT', true))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">DLT</span>
                    {getStartersForPosition('DT',2).map(player => renderPlayerCard(player, 'DLT', true))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">DLE</span>
                    {getStartersForPosition('DE',2).map(player => renderPlayerCard(player, 'DLE', true))}
                </div>
                 <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">CB</span>
                    {getStartersForPosition('CB',2).map(player => renderPlayerCard(player, 'CB', true))}
                </div>
            </div>

            {/* LBs */}
            <div className="flex justify-center w-full max-w-[600px] mx-auto gap-x-12">
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">WILL</span>
                    {getStartersForPosition('LB',1).map(player => renderPlayerCard(player, 'WILL', true))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">MIKE</span>
                    {getStartersForPosition('LB',2).map(player => renderPlayerCard(player, 'MIKE', true))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">SAM</span>
                    {getStartersForPosition('LB',3).map(player => renderPlayerCard(player, 'SAM', true))}
                </div>
            </div>
        </div>

        {/* Offensive Side (Bottom) */}
        <div className="flex flex-col items-center w-full gap-y-6"> {/* Increased gap between offensive rows */}
            {/* WRs, TEs, O-Line */}
            <div className="flex justify-center w-full max-w-[800px] mx-auto gap-x-6">
                 <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">WR</span>
                    {getStartersForPosition('WR',1).map(player => renderPlayerCard(player, 'WR'))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">LT</span>
                    {getStartersForPosition('LT').map(player => renderPlayerCard(player, 'LT'))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">LG</span>
                    {getStartersForPosition('LG').map(player => renderPlayerCard(player, 'LG'))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">C</span>
                    {getStartersForPosition('C').map(player => renderPlayerCard(player, 'C'))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">RG</span>
                    {getStartersForPosition('RG').map(player => renderPlayerCard(player, 'RG'))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">RT</span>
                    {getStartersForPosition('RT').map(player => renderPlayerCard(player, 'RT'))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">WR</span>
                    {getStartersForPosition('WR',2).map(player => renderPlayerCard(player, 'WR'))}
                </div>
            </div>

            {/* Slot & TE */}
            <div className="flex justify-center w-full max-w-[450px] mx-auto gap-x-20">
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">SLOT</span>
                    {getStartersForPosition('WR',3).map(player => renderPlayerCard(player, 'SLOT'))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">TE</span>
                    {getStartersForPosition('TE').map(player => renderPlayerCard(player, 'TE'))}
                </div>
            </div>

            {/* QB & HB */}
            <div className="flex justify-center w-full max-w-[350px] mx-auto gap-x-24">
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">QB</span>
                    {getStartersForPosition('QB').map(player => renderPlayerCard(player, 'QB'))}
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold text-gray-500 mb-2 block">HB</span>
                    {getStartersForPosition('RB').map(player => renderPlayerCard(player, 'HB'))}
                </div>
            </div>
        </div>
      </div>
    );
  };


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

        {/* Main Field Display Area */}
        {error ? (
          <div className="text-red-700 p-5 bg-red-50 border border-red-200 rounded-lg text-center font-medium">
            Error: {error}
          </div>
        ) : isLoading ? (
          <div className="text-center text-lg text-blue-600 p-5 bg-blue-50 rounded-lg">Loading Depth Chart...</div>
        ) : (
          <div
            className="relative w-full mx-auto rounded-lg shadow-inner overflow-hidden"
            style={{
                minHeight: '950px', // Increased height slightly
                backgroundColor: '#FBFBFB', // A very clean, almost white color
                border: '1px solid #D1D5DB',
            }}
          >
            {/* Background structure with Endzones */}
            <div className="absolute inset-0 z-0 flex flex-col">
                {/* Top end zone */}
                <div style={{
                    height: '14%', // End zone height
                    background: 'linear-gradient(145deg, #A47B1B, #E6C66E, #A47B1B)',
                }}></div>
                {/* REVISED: Main field area which will contain the lines */}
                <div className="relative flex-grow">
                    {/* This div will hold the horizontal lines */}
                    <div className="absolute inset-0 flex flex-col justify-between py-5">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="w-full h-[1px] bg-gray-200"></div>
                        ))}
                    </div>
                </div>
                {/* Bottom end zone */}
                <div style={{
                    height: '14%', // End zone height
                    background: 'linear-gradient(145deg, #A47B1B, #E6C66E, #A47B1B)',
                }}></div>
            </div>
            {/* Player content, sits on top */}
            <div className="relative z-10 h-full">
                {renderCombinedPlayers()}
            </div>
          </div>
        )}

        {/* Overall Unit Strength Section */}
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