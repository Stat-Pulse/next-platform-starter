import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const getDepthPositionLabel = (depthRank) => {
  switch (depthRank) {
    case 1: return 'Starter';
    case 2: return 'Backup';
    case 3: return '3rd String';
    // ... other cases
    default: return 'Depth';
  }
};

const DepthChart = () => {
  const [teamId, setTeamId] = useState(null);
  const [depthData, setDepthData] = useState({});
  const [viewMode, setViewMode] = useState('current');
  const [selectedSeason, setSelectedSeason] = useState(2024);
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
      // This is a mock to simulate a successful fetch with a full team
      setTimeout(() => {
        const mockApiResponse = {
          S: [{ player_id: 1, depth_rank: 1, player_name: 'J. Adams', jersey_number: 33 }, { player_id: 2, depth_rank: 1, player_name: 'Q. Diggs', jersey_number: 6 }],
          CB: [{ player_id: 3, depth_rank: 1, player_name: 'D. Reed', jersey_number: 2 }, { player_id: 4, depth_rank: 1, player_name: 'T. Woolen', jersey_number: 27 }],
          DE: [{ player_id: 5, depth_rank: 1, player_name: 'D. Jones', jersey_number: 52 }, { player_id: 6, depth_rank: 1, player_name: 'U. Nwosu', jersey_number: 10 }],
          DT: [{ player_id: 7, depth_rank: 1, player_name: 'B. Mone', jersey_number: 91 }, { player_id: 8, depth_rank: 1, player_name: 'A. Woods', jersey_number: 97 }],
          LB: [{ player_id: 9, depth_rank: 1, player_name: 'C. Barton', jersey_number: 57 }, { player_id: 10, depth_rank: 1, player_name: 'J. Brooks', jersey_number: 56 }, { player_id: 11, depth_rank: 1, player_name: 'D. Taylor', jersey_number: 59 }],
          WR: [{ player_id: 12, depth_rank: 1, player_name: 'D. Metcalf', jersey_number: 14 }, { player_id: 13, depth_rank: 1, player_name: 'T. Lockett', jersey_number: 16 }, { player_id: 14, depth_rank: 1, player_name: 'D. Eskridge', jersey_number: 1 }],
          LT: [{ player_id: 15, depth_rank: 1, player_name: 'C. Cross', jersey_number: 72 }],
          LG: [{ player_id: 16, depth_rank: 1, player_name: 'D. Lewis', jersey_number: 66 }],
          C: [{ player_id: 17, depth_rank: 1, player_name: 'A. Blythe', jersey_number: 63 }],
          RG: [{ player_id: 18, depth_rank: 1, player_name: 'G. Jackson', jersey_number: 68 }],
          RT: [{ player_id: 19, depth_rank: 1, player_name: 'A. Lucas', jersey_number: 75 }],
          TE: [{ player_id: 20, depth_rank: 1, player_name: 'N. Fant', jersey_number: 87 }],
          QB: [{ player_id: 21, depth_rank: 1, player_name: 'G. Smith', jersey_number: 7 }],
          RB: [{ player_id: 22, depth_rank: 1, player_name: 'K. Walker', jersey_number: 9 }],
        };
        setDepthData(mockApiResponse);
        setIsLoading(false);
      }, 500);
    };

    fetchData();

    return () => {
      Object.values(chartRefs.current).forEach(ref => {
        if (ref && ref.chartInstance) {
          ref.chartInstance.destroy();
        }
      });
    };
  }, [teamId, viewMode, selectedSeason]);

  // REVISED: Made player boxes smaller and text more compact.
  const renderPlayerCard = (player, primaryPositionAbbr) => {
    // Return an invisible placeholder if no player exists, to maintain spacing.
    if (!player) return <div style={{width: '95px', height: '45px', visibility: 'hidden'}}></div>;
    return (
      <div key={player.player_id} className="bg-white rounded-md shadow-sm border border-gray-200 p-1 text-center text-gray-800 flex flex-col justify-center items-center"
           style={{ width: '95px', height: '45px' }}>
        <div className="font-bold text-xs">#{player.jersey_number} {player.player_name}</div>
        <div className="text-[8px] text-gray-500 mt-1">{primaryPositionAbbr}</div>
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

  const years = Array.from({ length: 2024 - 1999 + 1 }, (_, i) => 1999 + i).reverse();

  const renderCombinedPlayers = () => {
    if (isLoading || Object.keys(depthData).length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                {isLoading ? <p>Loading...</p> : <p>No data available.</p>}
            </div>
        );
    }

    // FINAL REVISION using CSS Grid for perfect centering.
    return (
      // 1. Switched from 'flex' to 'grid' and 'place-items-center'.
      // This is a more forceful way to center the content in the middle of the parent.
      <div className="pt-68">

        {/* 2. Added a single wrapper div for all content.
            The grid will center this one item perfectly. */}
        <div>
            {/* The defensive unit */}
            <div className="flex flex-col items-center w-full gap-y-6 mb-16"> {/* Added margin-bottom (mb-16) for the line-of-scrimmage gap */}
                {/* Safeties (Deepest) */}
                <div className="flex justify-center w-full max-w-lg mx-auto gap-x-28">
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">FS</span>{getStartersForPosition('S', 2).slice(0, 1).map((p) => renderPlayerCard(p, 'FS'))}</div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">SS</span>{getStartersForPosition('S', 2).slice(1, 2).map((p) => renderPlayerCard(p, 'SS'))}</div>
                </div>

                {/* Linebackers */}
                <div className="flex justify-center w-full max-w-lg mx-auto gap-x-12">
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">WILL</span>{getStartersForPosition('LB', 3).slice(0, 1).map((p) => renderPlayerCard(p, 'WILL'))}</div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">MIKE</span>{getStartersForPosition('LB', 3).slice(1, 2).map((p) => renderPlayerCard(p, 'MIKE'))}</div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">SAM</span>{getStartersForPosition('LB', 3).slice(2, 3).map((p) => renderPlayerCard(p, 'SAM'))}</div>
                </div>

                {/* D-Line & CBs */}
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


            {/* The offensive unit */}
            <div className="flex flex-col items-center w-full gap-y-8">
                {/* O-Line & WRs */}
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

                {/* QB & HB */}
                <div className="flex justify-center w-full max-w-sm mx-auto gap-x-10">
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">QB</span>{getStartersForPosition('QB', 1).map((p) => renderPlayerCard(p, 'QB'))}</div>
                    <div className="flex flex-col items-center"><span className="text-xs font-semibold text-gray-400 mb-1 block">HB</span>{getStartersForPosition('RB', 1).map((p) => renderPlayerCard(p, 'HB'))}</div>
                </div>
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

        {/* Controls can go here */}
        <div className="mb-8 flex flex-wrap items-center space-x-4">
            {/* Your buttons and selectors would go here */}
        </div>

        {/* Main Field Display Area */}
        <div
            className="relative w-full mx-auto rounded-lg shadow-inner overflow-hidden"
            style={{
                minHeight: '950px',
                backgroundColor: '#FBFBFB',
                border: '1px solid #D1D5DB',
            }}
          >
            {/* Background structure with Endzones and Lines */}
            <div className="absolute inset-0 z-0 flex flex-col">
                <div style={{ height: '14%', background: 'linear-gradient(145deg, #A47B1B, #E6C66E, #A47B1B)' }}></div>
                <div className="relative flex-grow">
                    <div className="absolute inset-0 flex flex-col justify-between py-5">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="w-full h-[1px] bg-gray-200"></div>
                        ))}
                    </div>
                </div>
                <div style={{ height: '14%', background: 'linear-gradient(145deg, #A47B1B, #E6C66E, #A47B1B)' }}></div>
            </div>
            {/* Player content, sits on top */}
            <div className="relative z-10 h-full">
                {renderCombinedPlayers()}
            </div>
          </div>
      </div>
    </div>
  );
};

export default DepthChart;