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

 // This useEffect now performs the REAL API call.
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

        // =================================================================
        // VVV THIS IS THE IMPORTANT DEBUGGING LINE VVV
        console.log('Data received from API:', data);
        // =================================================================

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
  
  // This function now only displays REAL data from the API.
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
    const players = (depthData[posAbbr] || []).filter(p => p.depth_rank === 1);
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push(players[i] || null);
    }
    return result;
  };

  const years = Array.from({ length: 2025 - 1999 + 1 }, (_, i) => 1999 + i).reverse();

  const renderCombinedPlayers = () => {
    if (isLoading) {
      return <div className="text-center p-10">Loading Players...</div>;
    }
    if (error) {
      return <div className="text-center p-10 text-red-600">Error: {error}</div>;
    }
    if (depthData.message) {
      return <div className="text-center p-10">{depthData.message}</div>;
    }
    if (Object.keys(depthData).length === 0) {
      return <div className="text-center p-10">No data available.</div>;
    }

    return (
        <div className="pt-32">
            {/* Defensive Unit */}
            <div className="flex flex-col items-center w-full gap-y-6 mb-16">
                <div className="flex justify-center w-full max-w-lg mx-auto gap-x-28">
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">FS</span>{getStartersForPosition('S', 2).slice(0, 1).map((p) => renderPlayerCard(p, 'FS'))}</div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">SS</span>{getStartersForPosition('S', 2).slice(1, 2).map((p) => renderPlayerCard(p, 'SS'))}</div>
                </div>
                <div className="flex justify-center w-full max-w-lg mx-auto gap-x-12">
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">WILL</span>{getStartersForPosition('LB', 3).slice(0, 1).map((p) => renderPlayerCard(p, 'WILL'))}</div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">MIKE</span>{getStartersForPosition('LB', 3).slice(1, 2).map((p) => renderPlayerCard(p, 'MIKE'))}</div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">SAM</span>{getStartersForPosition('LB', 3).slice(2, 3).map((p) => renderPlayerCard(p, 'SAM'))}</div>
                </div>
                <div className="flex justify-center items-end w-full max-w-5xl mx-auto gap-x-2">
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">CB</span>{getStartersForPosition('CB', 2).slice(0, 1).map((p) => renderPlayerCard(p, 'CB'))}</div>
                    <div className="flex-grow flex justify-center gap-x-4">
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">DE</span>{getStartersForPosition('DE', 2).slice(0, 1).map((p) => renderPlayerCard(p, 'DE'))}</div>
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">DT</span>{getStartersForPosition('DT', 2).slice(0, 1).map((p) => renderPlayerCard(p, 'DT'))}</div>
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">DT</span>{getStartersForPosition('DT', 2).slice(1, 2).map((p) => renderPlayerCard(p, 'DT'))}</div>
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">DE</span>{getStartersForPosition('DE', 2).slice(1, 2).map((p) => renderPlayerCard(p, 'DE'))}</div>
                    </div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">CB</span>{getStartersForPosition('CB', 2).slice(1, 2).map((p) => renderPlayerCard(p, 'CB'))}</div>
                </div>
            </div>
            {/* Offensive Unit */}
            <div className="flex flex-col items-center w-full gap-y-8">
                <div className="flex justify-center items-start w-full max-w-5xl mx-auto gap-x-4">
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">WR</span>{getStartersForPosition('WR', 3).slice(0, 1).map((p) => renderPlayerCard(p, 'WR'))}</div>
                    <div className="flex-grow flex justify-center gap-x-2">
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">TE</span>{getStartersForPosition('TE', 1).map((p) => renderPlayerCard(p, 'TE'))}</div>
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">LT</span>{getStartersForPosition('LT', 1).map((p) => renderPlayerCard(p, 'LT'))}</div>
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">LG</span>{getStartersForPosition('LG', 1).map((p) => renderPlayerCard(p, 'LG'))}</div>
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">C</span>{getStartersForPosition('C', 1).map((p) => renderPlayerCard(p, 'C'))}</div>
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">RG</span>{getStartersForPosition('RG', 1).map((p) => renderPlayerCard(p, 'RG'))}</div>
                        <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">RT</span>{getStartersForPosition('RT', 1).map((p) => renderPlayerCard(p, 'RT'))}</div>
                    </div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">SLOT</span>{getStartersForPosition('WR', 3).slice(2, 3).map((p) => renderPlayerCard(p, 'SLOT'))}</div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">WR</span>{getStartersForPosition('WR', 3).slice(1, 2).map((p) => renderPlayerCard(p, 'WR'))}</div>
                </div>
                <div className="flex justify-center w-full max-w-sm mx-auto gap-x-10">
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">QB</span>{getStartersForPosition('QB', 1).map((p) => renderPlayerCard(p, 'QB'))}</div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">HB</span>{getStartersForPosition('RB', 1).map((p) => renderPlayerCard(p, 'HB'))}</div>
                </div>
            </div>
        </div>
    );
  };
  
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