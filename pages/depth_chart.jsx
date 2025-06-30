import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const getDepthPositionLabel = (depthRank) => {
  switch (depthRank) {
    case 1: return 'Starter';
    case 2: return 'Backup';
    case 3: return '3rd String';
    default: return 'Depth';
  }
};

const DepthChart = () => {
  const [teamId, setTeamId] = useState(null);
  const [depthData, setDepthData] = useState({});
  const [viewMode, setViewMode] = useState('current');
  const [selectedSeason, setSelectedSeason] = useState(2025); // Set default to the latest season
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRefs = useRef({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const team = urlParams.get('team');
    if (team) {
      setTeamId(team.toUpperCase());
    } else {
      setError("No team specified in URL.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!teamId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      let apiUrl = `/api/depth-chart?team=${teamId}&viewMode=${viewMode}`;
      if (viewMode === 'historical') {
        apiUrl += `&season=${selectedSeason}`;
      }

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('Data received from API:', data);

        if (!response.ok) {
          throw new Error(data.error || `Failed to fetch depth data.`);
        }
        setDepthData(data);
      } catch (err) {
        console.error("Error fetching depth chart data:", err);
        setError(err.message);
        setDepthData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, [teamId, viewMode, selectedSeason]);

  const renderPlayerCard = (player, primaryPositionAbbr) => {
    if (!player) {
      return <div style={{width: '95px', height: '45px', visibility: 'hidden'}}></div>;
    }

    return (
      <div key={player.player_id} className="bg-white rounded-md shadow-sm border border-gray-200 p-1 text-center text-gray-800 flex flex-col justify-center items-center"
           style={{ width: '95px', height: '45px' }}>
        <div className="font-bold text-xs">
          {player.jersey_number ? `#${player.jersey_number} ` : ''}{player.player_name}
        </div>
        <div className="text-[8px] text-gray-500 mt-1">
          {primaryPositionAbbr}
        </div>
      </div>
    );
  };

  const getStartersForPosition = (posAbbr, count = 1) => {
    // Using `==` handles cases where depth_rank might be the string "1" instead of the number 1.
    // This is a much safer way to filter.
    const players = (depthData[posAbbr] || []).filter(p => p.depth_rank == 0); 
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(players[i] || null);
    }
    return result;
  };

  const years = Array.from({ length: 2025 - 1999 + 1 }, (_, i) => 1999 + i).reverse();

  const renderCombinedPlayers = () => {
    // 1. Check for loading, error, or empty states first.
    if (isLoading) {
      return <div className="text-center p-10">Loading Players...</div>;
    }
    if (error) {
      return <div className="text-center p-10 text-red-600">Error: {error}</div>;
    }
    if (depthData.message) {
        return <div className="text-center p-10">{depthData.message}</div>;
    }

    // =================================================================
    // VVV THIS IS THE FINAL DEBUGGING LOG VVV
    // It will show us the contents of the Quarterback array.
    if (depthData.QB) {
      console.log("Contents of the QB player array:", depthData.QB);
    }
    // =================================================================


    // Check if the data object is empty for other reasons
    if (Object.keys(depthData).length === 0) {
      return <div className="text-center p-10">No data available.</div>;
    }

    // ... rest of the function ...

    // 2. Get player groups using the CORRECT keys from your API data.
    const freeSafeties = getStartersForPosition('FS', 1);
    const strongSafeties = getStartersForPosition('SS', 1);
    const linebackers = getStartersForPosition('ILB', 3); // Using ILB now
    const cornerbacks = getStartersForPosition('CB', 2);
    const defensiveEnds = getStartersForPosition('DE', 2);
    // Combine DT and NT for the interior line, taking the first two available.
    const defensiveTackles = [...getStartersForPosition('DT', 2), ...getStartersForPosition('NT', 1)];

    const wideReceivers = getStartersForPosition('WR', 3);
    const tightEnds = getStartersForPosition('TE', 1);
    const tackles = getStartersForPosition('T', 2);   // Using generic T for Tackles
    const guards = getStartersForPosition('G', 2);     // Using generic G for Guards
    const center = getStartersForPosition('C', 1);
    const quarterback = getStartersForPosition('QB', 1);
    const runningback = getStartersForPosition('RB', 1);


    return (
        <div className="pt-32">
            {/* --- Defensive Unit --- */}
            <div className="flex flex-col items-center w-full gap-y-6 mb-16">
                {/* 3. Render each player by taking them from the correct arrays. */}
                <div className="flex justify-center w-full max-w-lg mx-auto gap-x-28">
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">FS</span>{renderPlayerCard(freeSafeties[0], 'FS')}</div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">SS</span>{renderPlayerCard(strongSafeties[0], 'SS')}</div>
                </div>
                <div className="flex justify-center w-full max-w-lg mx-auto gap-x-12">
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">WILL</span>{renderPlayerCard(linebackers[0], 'WILL')}</div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">MIKE</span>{renderPlayerCard(linebackers[1], 'MIKE')}</div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">SAM</span>{renderPlayerCard(linebackers[2], 'SAM')}</div>
                </div>
                <div className="flex justify-center items-end w-full max-w-5xl mx-auto gap-x-2">
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">CB</span>{renderPlayerCard(cornerbacks[0], 'CB')}</div>
                    <div className="flex-grow flex justify-center gap-x-4">
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">DE</span>{renderPlayerCard(defensiveEnds[0], 'DE')}</div>
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">DT</span>{renderPlayerCard(defensiveTackles[0], 'DT')}</div>
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">DT</span>{renderPlayerCard(defensiveTackles[1], 'DT')}</div>
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">DE</span>{renderPlayerCard(defensiveEnds[1], 'DE')}</div>
                    </div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">CB</span>{renderPlayerCard(cornerbacks[1], 'CB')}</div>
                </div>
            </div>

            {/* --- Offensive Unit --- */}
            <div className="flex flex-col items-center w-full gap-y-8">
                <div className="flex justify-center items-start w-full max-w-5xl mx-auto gap-x-4">
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">WR</span>{renderPlayerCard(wideReceivers[0], 'WR')}</div>
                    <div className="flex-grow flex justify-center gap-x-2">
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">TE</span>{renderPlayerCard(tightEnds[0], 'TE')}</div>
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">LT</span>{renderPlayerCard(tackles[0], 'LT')}</div>
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">LG</span>{renderPlayerCard(guards[0], 'LG')}</div>
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">C</span>{renderPlayerCard(center[0], 'C')}</div>
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">RG</span>{renderPlayerCard(guards[1], 'RG')}</div>
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">RT</span>{renderPlayerCard(tackles[1], 'RT')}</div>
                    </div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">SLOT</span>{renderPlayerCard(wideReceivers[1], 'SLOT')}</div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">WR</span>{renderPlayerCard(wideReceivers[2], 'WR')}</div>
                </div>
                <div className="flex justify-center w-full max-w-sm mx-auto gap-x-10">
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">QB</span>{renderPlayerCard(quarterback[0], 'QB')}</div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">HB</span>{renderPlayerCard(runningback[0], 'HB')}</div>
                </div>
            </div>
        </div>
    );
  };
  
  // =================================================================
  // VVV THIS IS THE MISSING CODE VVV
  // =================================================================
  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b-2 pb-3 border-blue-600">
          Depth Chart for {teamId || '...'}
        </h1>
        <div className="mb-8 flex flex-wrap items-center space-x-4">
            {/* Your view mode buttons and selectors go here */}
        </div>
        <div
            className="relative w-full mx-auto rounded-lg shadow-inner overflow-hidden"
            style={{ minHeight: '750px', backgroundColor: '#FBFBFB', border: '1px solid #D1D5DB' }}>
            <div className="absolute inset-0 z-0 flex flex-col">
                <div style={{ height: '14%', background: 'linear-gradient(145deg, #A47B1B, #E6C66E, #A47B1B)' }}></div>
                <div className="relative flex-grow">
                    <div className="absolute inset-0 flex flex-col justify-between py-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="w-full h-[1px] bg-gray-200"></div>
                        ))}
                    </div>
                </div>
                <div style={{ height: '14%', background: 'linear-gradient(145deg, #A47B1B, #E6C66E, #A47B1B)' }}></div>
            </div>
            <div className="relative z-10 h-full">
                {renderCombinedPlayers()}
            </div>
          </div>
      </div>
    </div>
  );
};

export default DepthChart;