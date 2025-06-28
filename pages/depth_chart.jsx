import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Chart from 'chart.js/auto';
import { FaChartBar } from 'react-icons/fa'; // For icons

// *** IMPORTANT: You will replace these mock fetch functions with actual API calls to your database. ***

// Function to simulate fetching data from your DB for 'current' view
// Replace this with your actual API call, e.g., fetch('/api/depth-chart/current')
const fetchCurrentDepthData = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    QB: [
      { player_id: '1', player_name: 'Dak Prescott', jersey_number: 4, height_inches: 75, weight_pounds: 238, college: 'Mississippi State', experience: 8, depth_position: 1, injury_status: null, contract_year: 2025, contract_apy: 40000000 },
      { player_id: '2', player_name: 'Cooper Rush', jersey_number: 10, height_inches: 74, weight_pounds: 225, college: 'Central Michigan', experience: 6, depth_position: 2, injury_status: null, contract_year: 2024, contract_apy: 1000000 },
    ],
    RB: [
      { player_id: '3', player_name: 'Ezekiel Elliott', jersey_number: 21, height_inches: 72, weight_pounds: 228, college: 'Ohio State', experience: 8, depth_position: 1, injury_status: 'Q - Knee', contract_year: 2025, contract_apy: 3000000 },
      { player_id: '4', player_name: 'Rico Dowdle', jersey_number: 23, height_inches: 71, weight_pounds: 215, college: 'South Carolina', experience: 3, depth_position: 2, injury_status: null, contract_year: 2024, contract_apy: 800000 },
    ],
    // Add WR, OL, DL, LB, DB data similarly
    unit_strength: { QB: 85, RB: 75, WR: 90, OL: 80, DL: 70, LB: 65, DB: 85 },
  };
};

// Function to simulate fetching data from your DB for 'projected' view
// Replace this with your actual API call, e.g., fetch('/api/depth-chart/projected')
const fetchProjectedDepthData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    QB: [
      { player_id: '5', player_name: 'Trey Lance', jersey_number: 15, height_inches: 77, weight_pounds: 224, college: 'North Dakota State', experience: 4, depth_position: 1, injury_status: null, contract_year: 2026, contract_apy: 5000000 },
      { player_id: '1', player_name: 'Dak Prescott', jersey_number: 4, height_inches: 75, weight_pounds: 238, college: 'Mississippi State', experience: 8, depth_position: 2, injury_status: null, contract_year: 2025, contract_apy: 40000000 },
    ],
    RB: [
      { player_id: '6', player_name: 'Tony Pollard', jersey_number: 20, height_inches: 70, weight_pounds: 209, college: 'Memphis', experience: 6, depth_position: 1, injury_status: null, contract_year: 2026, contract_apy: 7000000 },
      { player_id: '4', player_name: 'Rico Dowdle', jersey_number: 23, height_inches: 71, weight_pounds: 215, college: 'South Carolina', experience: 3, depth_position: 2, injury_status: null, contract_year: 2024, contract_apy: 800000 },
    ],
    unit_strength: { QB: 80, RB: 85, WR: 92, OL: 78, DL: 72, LB: 68, DB: 88 },
  };
};

// Function to simulate fetching data from your DB for 'historical' view
// Replace this with your actual API call, e.g., fetch('/api/depth-chart/historical?year=2010')
const fetchHistoricalDepthData = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    QB: [
      { player_id: '7', player_name: 'Tony Romo', jersey_number: 9, height_inches: 74, weight_pounds: 230, college: 'Eastern Illinois', experience: 14, depth_position: 1, injury_status: 'Retired', contract_year: 2016, contract_apy: 18000000 },
      { player_id: '8', player_name: 'Drew Bledsoe', jersey_number: 11, height_inches: 77, weight_pounds: 238, college: 'Washington State', experience: 14, depth_position: 2, injury_status: null, contract_year: 2006, contract_apy: 6000000 },
    ],
    RB: [
      { player_id: '9', player_name: 'Emmitt Smith', jersey_number: 22, height_inches: 69, weight_pounds: 216, college: 'Florida', experience: 15, depth_position: 1, injury_status: 'Retired', contract_year: 2002, contract_apy: 5000000 },
      { player_id: '10', player_name: 'Troy Hambrick', jersey_number: 34, height_inches: 72, weight_pounds: 235, college: 'Savannah State', experience: 5, depth_position: 2, injury_status: null, contract_year: 2003, contract_apy: 750000 },
    ],
    unit_strength: { QB: 90, RB: 95, WR: 80, OL: 85, DL: 90, LB: 80, DB: 90 },
  };
};


const getDepthPositionLabel = (depthPosition) => {
  switch (depthPosition) {
    case 1: return 'Starter';
    case 2: return 'Backup';
    case 3: return '3rd String';
    case 4: return '4th String';
    case 5: return '5th String';
    default: return 'Depth'; // For any other number
  }
};


const DepthChart = () => {
  const [depthData, setDepthData] = useState({ QB: [], RB: [], unit_strength: {} }); // Initialize with empty data
  const [viewMode, setViewMode] = useState('current');
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const chartRefs = useRef({});

  // Effect to fetch data based on viewMode
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      let dataToLoad;
      try {
        switch (viewMode) {
          case 'current':
            dataToLoad = await fetchCurrentDepthData();
            break;
          case 'projected':
            dataToLoad = await fetchProjectedDepthData();
            break;
          case 'historical':
            dataToLoad = await fetchHistoricalDepthData();
            break;
          default:
            dataToLoad = await fetchCurrentDepthData();
        }
        setDepthData(dataToLoad);
      } catch (error) {
        console.error("Failed to fetch depth data:", error);
        // Optionally set an error state here to display a message to the user
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup function for charts when component unmounts or effect re-runs
    return () => {
      Object.values(chartRefs.current).forEach(ref => {
        if (ref && ref.chartInstance && ref.chartInstance.destroy) {
          ref.chartInstance.destroy();
          ref.chartInstance = null; // Clear the reference
        }
      });
    };
  }, [viewMode]); // Re-run when viewMode changes

  // Effect to initialize/update unit strength charts
  useEffect(() => {
    if (!depthData || Object.keys(depthData.unit_strength).length === 0) {
      return; // Do not draw charts if data is not yet loaded or empty
    }

    Object.keys(depthData.unit_strength).forEach((pos) => {
      if (chartRefs.current[pos]) {
        // Destroy existing chart instance if it exists before creating a new one
        if (chartRefs.current[pos].chartInstance) {
          chartRefs.current[pos].chartInstance.destroy();
        }

        const newChart = new Chart(chartRefs.current[pos].getContext('2d'), {
          type: 'bar',
          data: { labels: [pos], datasets: [{ label: 'Unit Strength', data: [depthData.unit_strength[pos]], backgroundColor: '#00ff99' }] },
          options: { responsive: true, plugins: { legend: { display: false }, tooltip: { enabled: true } }, scales: { y: { beginAtZero: true, max: 100 } } },
        });
        chartRefs.current[pos].chartInstance = newChart; // Store chart instance for cleanup
      }
    });
  }, [depthData]); // Re-run when depthData changes


  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-purple-900 to-teal-900 p-6 text-gray-100 font-sans relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto"
      >
        <h1 className="text-4xl font-extrabold text-neon-green-500 mb-6 flex items-center">
          <FaChartBar className="mr-2" /> Depth Chart
        </h1>

        {/* View Mode Toggle */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setViewMode('current')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'current' ? 'bg-neon-green-700' : 'bg-purple-800'} text-white`}
          >
            Current
          </button>
          <button
            onClick={() => setViewMode('projected')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'projected' ? 'bg-neon-green-700' : 'bg-purple-800'} text-white`}
          >
            Projected
          </button>
          <button
            onClick={() => setViewMode('historical')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'historical' ? 'bg-neon-green-700' : 'bg-purple-800'} text-white`}
          >
            Historical
          </button>
        </div>

        {isLoading ? (
          <div className="text-center text-lg text-neon-green-500">Loading Depth Chart...</div>
        ) : (
          <div
            className="relative w-full h-[600px] bg-cover bg-center"
            style={{ backgroundImage: 'url(https://www.pff.com/static-assets/images/cowboys-field.png)' }}
          >
            {/* QB Section */}
            {depthData.QB && depthData.QB.length > 0 && (
              <motion.div
                className="absolute top-[10%] left-[40%] w-32"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-bold text-neon-green-300 mb-2">QB</h3>
                {depthData.QB.map((player, index) => (
                  <motion.div
                    key={player.player_id}
                    className={`bg-gray-800/70 p-3 rounded-lg shadow-md border border-silver-400 mb-2 ${index === 0 ? 'border-2 border-neon-green-500' : ''}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{player.player_name} #{player.jersey_number}</span>
                      <span className="text-silver-300">{getDepthPositionLabel(player.depth_position)}</span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center">
                      {player.injury_status && (
                        <span className="mr-2 text-red-500 font-bold" title={player.injury_status}>
                          {player.injury_status.startsWith('Q') ? 'Q' : (player.injury_status.startsWith('D') ? 'D' : 'INJ')}
                        </span>
                      )}
                      <span className="mr-2">{`Exp: ${player.experience}`}</span>
                      <span>{`$${(player.contract_apy / 1000000).toFixed(1)}M`}</span>
                    </div>
                  </motion.div>
                ))}
                {depthData.unit_strength.QB && (
                    <canvas ref={(ref) => (chartRefs.current.QB = ref)} className="w-full h-16 mt-2" />
                )}
              </motion.div>
            )}

            {/* RB Section (Example for other positions) */}
            {depthData.RB && depthData.RB.length > 0 && (
              <motion.div
                className="absolute top-[30%] left-[35%] w-32"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-bold text-neon-green-300 mb-2">RB</h3>
                {depthData.RB.map((player, index) => (
                  <motion.div
                    key={player.player_id}
                    className={`bg-gray-800/70 p-3 rounded-lg shadow-md border border-silver-400 mb-2 ${index === 0 ? 'border-2 border-neon-green-500' : ''}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{player.player_name} #{player.jersey_number}</span>
                      <span className="text-silver-300">{getDepthPositionLabel(player.depth_position)}</span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center">
                      {player.injury_status && (
                        <span className="mr-2 text-red-500 font-bold" title={player.injury_status}>
                          {player.injury_status.startsWith('Q') ? 'Q' : (player.injury_status.startsWith('D') ? 'D' : 'INJ')}
                        </span>
                      )}
                      <span className="mr-2">{`Exp: ${player.experience}`}</span>
                      <span>{`$${(player.contract_apy / 1000000).toFixed(1)}M`}</span>
                    </div>
                  </motion.div>
                ))}
                {depthData.unit_strength.RB && (
                    <canvas ref={(ref) => (chartRefs.current.RB = ref)} className="w-full h-16 mt-2" />
                )}
              </motion.div>
            )}

            {/* Add WR, OL, DL, LB, DB sections with similar structure, adjusting positions on the field */}
            {/* Remember to add corresponding data to your real fetch functions */}
            {/* Example for WR - adjust top/left as needed */}
            {/* {depthData.WR && depthData.WR.length > 0 && (
              <motion.div
                className="absolute top-[20%] left-[60%] w-32"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-lg font-bold text-neon-green-300 mb-2">WR</h3>
                {depthData.WR.map((player, index) => (
                  <motion.div
                    key={player.player_id}
                    className={`bg-gray-800/70 p-3 rounded-lg shadow-md border border-silver-400 mb-2 ${index === 0 ? 'border-2 border-neon-green-500' : ''}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{player.player_name} #{player.jersey_number}</span>
                      <span className="text-silver-300">{getDepthPositionLabel(player.depth_position)}</span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center">
                      {player.injury_status && (
                        <span className="mr-2 text-red-500 font-bold" title={player.injury_status}>
                          {player.injury_status.startsWith('Q') ? 'Q' : (player.injury_status.startsWith('D') ? 'D' : 'INJ')}
                        </span>
                      )}
                      <span className="mr-2">{`Exp: ${player.experience}`}</span>
                      <span>{`$${(player.contract_apy / 1000000).toFixed(1)}M`}</span>
                    </div>
                  </motion.div>
                ))}
                {depthData.unit_strength.WR && (
                    <canvas ref={(ref) => (chartRefs.current.WR = ref)} className="w-full h-16 mt-2" />
                )}
              </motion.div>
            )} */}

          </div>
        )}

        {/* Analyst Commentary */}
        <motion.div
          className="mt-6 bg-gray-800/70 p-6 rounded-lg shadow-lg border border-silver-400"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-neon-green-300 mb-2">Analyst Notes</h3>
          <p className="text-gray-300">Close battle at RB: Elliott vs. Dowdle—watch for snap share shifts.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DepthChart;