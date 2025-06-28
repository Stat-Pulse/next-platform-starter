import { useState } from 'react'
import SectionWrapper from '../components/SectionWrapper'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AnalyticsLab() {
  // Simple state for widget management (without drag-and-drop for now)
  const [selectedWidgets, setSelectedWidgets] = useState([])
  
  const toggleWidget = (widgetId) => {
    setSelectedWidgets(prev => 
      prev.includes(widgetId) 
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    )
  }

  // Chart Data for Advanced Statistical Explorers
  const trendData = {
    labels: ['Week 1', 'Week 5', 'Week 10', 'Week 15'],
    datasets: [
      {
        label: 'QB Efficiency',
        data: [75, 82, 90, 88],
        backgroundColor: 'rgba(200, 32, 32, 0.8)',
        borderColor: 'rgba(200, 32, 32, 1)',
        borderWidth: 1,
      },
    ],
  }

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { 
      y: { 
        title: { display: true, text: 'Efficiency (%)', color: '#E0E0E0' }, 
        ticks: { color: '#E0E0E0' }, 
        grid: { color: 'rgba(255, 255, 255, 0.1)' } 
      }, 
      x: { 
        ticks: { color: '#E0E0E0' }, 
        grid: { color: 'rgba(255, 255, 255, 0.1)' } 
      } 
    },
    plugins: { 
      title: { display: true, text: 'Performance Trends', color: '#E0E0E0' }, 
      legend: { labels: { color: '#E0E0E0' } } 
    },
  }

  // Simple 3D visualization placeholder
  const ThreeDVisualization = () => {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/20 to-red-600/20 rounded-lg">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 bg-red-500 rounded-full mx-auto mb-4 animate-pulse shadow-lg"></div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-red-600 rounded-full animate-ping"></div>
          </div>
          <p className="text-white font-semibold">3D Player Movement</p>
          <p className="text-gray-300 text-sm">Interactive visualization</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-[calc(100vh-20rem)]">
      <SectionWrapper title="Analytics Lab">
        <div className="glass-card p-6 max-w-4xl mx-auto">
          <h3 className="text-3xl font-semibold text-lightText mb-6">Analytics Lab</h3>
          <p className="text-grayText mb-8">Advanced tools and data for NFL analysis as of 12:02 PM EDT, June 23, 2025.</p>

          {/* 1. Customizable Dashboard & Workbench */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-lightText mb-4">Customizable Dashboard & Workbench</h4>
            <p className="text-grayText mb-4">Build your own analytics experience.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <button 
                  onClick={() => toggleWidget('stats')}
                  className={`w-full p-3 rounded cursor-pointer transition-all ${
                    selectedWidgets.includes('stats') 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  📊 Stats Widget
                </button>
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <button 
                  onClick={() => toggleWidget('metrics')}
                  className={`w-full p-3 rounded cursor-pointer transition-all ${
                    selectedWidgets.includes('metrics') 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  📈 Metrics Widget
                </button>
              </div>
            </div>

            <div className="border-dashed border-2 border-gray-700 p-4 rounded-lg h-32 flex items-center justify-center">
              <div className="text-center">
                <p className="text-grayText">
                  {selectedWidgets.length === 0 
                    ? 'Select widgets above to add them to your dashboard' 
                    : `Active widgets: ${selectedWidgets.join(', ')}`
                  }
                </p>
              </div>
            </div>
            
            <button className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4">
              Customize Dashboard
            </button>
          </div>

          {/* 2. Advanced Statistical Explorers */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-lightText mb-4">Advanced Statistical Explorers</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">Player DNA Profiler</h5>
                <p className="text-grayText text-sm">Average time to throw under pressure, pocket presence metrics</p>
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">Situational Splits</h5>
                <p className="text-grayText text-sm">Performance by down, quarter, field position</p>
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg h-64">
                <Bar data={trendData} options={trendOptions} />
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">Player Archetype Analysis</h5>
                <p className="text-grayText text-sm">Dual-threat QB, pocket passer classification</p>
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">Team Synergy Visualizer</h5>
                <p className="text-grayText text-sm">Unit performance and chemistry metrics</p>
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">Game Flow Analyzer</h5>
                <p className="text-grayText text-sm">Win Probability Added (WPA) and EPA tracking</p>
              </div>
            </div>
            <button className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4">
              Explore Advanced Stats
            </button>
          </div>

          {/* 3. Predictive Analytics Suite */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-lightText mb-4">Predictive Analytics Suite</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">🔮 Prediction Models</h5>
                <p className="text-grayText text-sm">Game outcomes, injury risk, performance forecasts</p>
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">🎯 Scenario Generator</h5>
                <p className="text-grayText text-sm">What-if analysis with adjustable variables</p>
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">⚡ Fantasy Optimizer</h5>
                <p className="text-grayText text-sm">Optimal lineup generation and player projections</p>
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">💰 Betting Calculator</h5>
                <p className="text-grayText text-sm">Data-driven betting insights and edge analysis</p>
              </div>
            </div>
            <button className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4">
              Run Predictions
            </button>
          </div>

          {/* 4. Cutting-Edge Visualizations */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-lightText mb-4">Cutting-Edge Visualizations</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">🗺️ Interactive Heatmaps</h5>
                <p className="text-grayText text-sm">Field zones, efficiency maps, target areas</p>
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">🌊 Play Flow Diagrams</h5>
                <p className="text-grayText text-sm">Sankey diagrams showing decision points</p>
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg h-64">
                <ThreeDVisualization />
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">🕸️ Network Graphs</h5>
                <p className="text-grayText text-sm">Player interaction patterns and connections</p>
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">📊 Custom Infographics</h5>
                <p className="text-grayText text-sm">Export-ready data visualizations</p>
              </div>
            </div>
            <button className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4">
              Explore Visualizations
            </button>
          </div>

          {/* 5. Data Playground & API Access */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-lightText mb-4">Data Playground & API Access</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">📥 Raw Data Access</h5>
                <p className="text-grayText text-sm">Download clean, structured datasets</p>
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">🔧 API Integration</h5>
                <p className="text-grayText text-sm">Build custom applications with our API</p>
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">📚 Data Dictionary</h5>
                <p className="text-grayText text-sm">Complete methodology and field explanations</p>
              </div>
            </div>
            <button className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4">
              Access Developer Tools
            </button>
          </div>

          {/* 6. Community & Collaboration Features */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-lightText mb-4">Community & Collaboration</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">🔗 Shareable Insights</h5>
                <p className="text-grayText text-sm">Export and share custom dashboards</p>
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">💬 Community Forums</h5>
                <p className="text-grayText text-sm">Discuss findings with other analysts</p>
              </div>
              <div className="bg-mediumBackground/50 p-4 rounded-lg">
                <h5 className="text-lightText font-semibold mb-2">🎓 Expert Commentary</h5>
                <p className="text-grayText text-sm">Professional analyst deep dives and insights</p>
              </div>
            </div>
            <button className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4">
              Join the Community
            </button>
          </div>
        </div>
      </SectionWrapper>
    </main>
  )
}