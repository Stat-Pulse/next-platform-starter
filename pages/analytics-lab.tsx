/** @jsxImportSource @react-three/fiber */
import { useState, useRef } from 'react'
import SectionWrapper from '../components/SectionWrapper'
import { DndProvider, HTML5toTouch } from 'react-dnd-multi-backend'
import { useDrag, useDrop } from 'react-dnd'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AnalyticsLab() {
  // Drag-and-Drop State for Customizable Dashboard
  const [widgets, setWidgets] = useState<string[]>([])
  const handleDrop = (item: { id: string }) => {
    if (!widgets.includes(item.id)) {
      setWidgets([...widgets, item.id])
    }
  }

  // Chart Data for Advanced Statistical Explorers
  const trendData = {
    labels: ['Week 1', 'Week 5', 'Week 10', 'Week 15'],
    datasets: [
      {
        label: 'QB Efficiency',
        data: [75, 82, 90, 88],
        backgroundColor: 'rgba(200, 32, 32, 0.8)', // primary-600
        borderColor: 'rgba(200, 32, 32, 1)',
        borderWidth: 1,
      },
    ],
  }

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { title: { display: true, text: 'Efficiency (%)', color: '#E0E0E0' }, ticks: { color: '#E0E0E0' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }, x: { ticks: { color: '#E0E0E0' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } } },
    plugins: { title: { display: true, text: 'Performance Trends', color: '#E0E0E0' }, legend: { labels: { color: '#E0E0E0' } } },
  }

  // 3D Scene for Cutting-Edge Visualizations
  const ThreeDScene = () => {
    const sphereRef = useRef<THREE.Mesh>(null)

    return (
      <group>
        <mesh ref={sphereRef}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color={0xff0000} />
        </mesh>
        <OrbitControls />
      </group>
    )
  }

  return (
    <>
      <main className="min-h-[calc(100vh-20rem)]">
        <SectionWrapper title="Analytics Lab">
          <div className="glass-card p-6 max-w-4xl mx-auto">
            <h3 className="text-3xl font-semibold text-lightText mb-6">Analytics Lab</h3>
            <p className="text-grayText mb-8">Advanced tools and data for NFL analysis as of 12:02 PM EDT, June 23, 2025.</p>

            {/* 1. Customizable Dashboard & Workbench */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Customizable Dashboard & Workbench</h4>
              <p className="text-grayText mb-4">Build your own analytics experience.</p>
              <DndProvider options={HTML5toTouch}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-mediumBackground/50 p-4 rounded-lg">
                    <DraggableWidget id="widget1">Stats Widget</DraggableWidget>
                  </div>
                  <div className="bg-mediumBackground/50 p-4 rounded-lg">
                    <DraggableWidget id="widget2">Metrics Widget</DraggableWidget>
                  </div>
                  <DropZone onDrop={handleDrop} widgets={widgets} />
                </div>
                <div className="mt-4">
                  <p className="text-grayText">Current Widgets: {widgets.join(', ')}</p>
                </div>
              </DndProvider>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Customize Dashboard
              </a>
            </div>

            {/* 2. Advanced Statistical Explorers */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Advanced Statistical Explorers</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Player DNA Profiler: e.g., 'Average time to throw under pressure'.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Situational Splits: By down, quarter, etc.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg h-64">
                  <Bar data={trendData} options={trendOptions} />
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Player Archetype Analysis: e.g., 'Dual-threat QB'.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Team Synergy Visualizer: Unit performance metrics.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Game Flow & Momentum Analyzer: WPA/EPA trackers.</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Explore Stats
              </a>
            </div>

            {/* 3. Predictive Analytics Suite */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Predictive Analytics Suite</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Proprietary Prediction Models: Game outcomes, injuries.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">"What-If" Scenario Generator: Adjust variables.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Fantasy Sports Optimizer: Optimize lineups.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Betting Edge Calculator: Data-driven bets.</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Predict Now
              </a>
            </div>

            {/* 4. Cutting-Edge Visualizations */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Cutting-Edge Visualizations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Interactive Heatmaps & Shot Charts: Efficiency zones.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Sankey Diagrams for Play Flow: Decision points.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg h-64">
                  <Canvas>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <ThreeDScene />
                  </Canvas>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Network Graphs: Player interactions.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Customizable Infographics: Export your data.</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                View Visuals
              </a>
            </div>

            {/* 5. Data Playground & API Access */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Data Playground & API Access</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Raw Data Access: Download datasets.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">API for Custom Applications: Build your tools.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Data Dictionary: Methodology explained.</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Access Data
              </a>
            </div>

            {/* 6. Community & Collaboration Features */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Community & Collaboration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Shareable Insights: Share dashboards.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Community Forums: Discuss findings.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Expert Commentary: Analyst deep dives as of June 23, 2025.</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Join Community
              </a>
            </div>
          </div>
        </SectionWrapper>
      </main>
    </>
  )
}

// Drag-and-Drop Components
type DraggableWidgetProps = {
  id: string
  children: React.ReactNode
}

const DraggableWidget = ({ id, children }: DraggableWidgetProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'widget',
    item: { id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }))
  return (
    <div
      ref={(node) => {
        if (node) drag(node)
      }}
      className="cursor-move p-2 bg-gray-700/50 rounded"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {children}
    </div>
  )
}

type DropZoneProps = {
  onDrop: (item: { id: string }) => void
  widgets: string[]
}

const DropZone = ({ onDrop, widgets }: DropZoneProps) => {
  const [, drop] = useDrop(() => ({
    accept: 'widget',
    drop: (item: { id: string }) => onDrop(item),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }))
  return (
    <div
      ref={(node) => {
        if (node) drop(node)
      }}
      className="border-dashed border-2 border-gray-700 p-4 rounded-lg h-32 flex items-center justify-center"
      style={{ borderColor: '#A0A0A0' }}
    >
      {widgets.length === 0 ? 'Drop widgets here' : 'Widgets: ' + widgets.join(', ')}
    </div>
  )
}