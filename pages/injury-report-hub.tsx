'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SectionWrapper from '../components/SectionWrapper'

// === START DND IMPORTS AND CONFIGURATION ===

// 1. Drag‑and‑drop hooks
import { useDrag, useDrop } from 'react-dnd'

// 2. Multi‑backend provider preset:
//    automatically switches between HTML5 (mouse) and Touch backends
import { DndProvider } from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch'

// === END DND IMPORTS AND CONFIGURATION ===


import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function InjuryReportHub() {
  // Drag-and-Drop State for Watchlist
  const [watchlist, setWatchlist] = useState<string[]>([])
  const handleDrop = (item: { id: string }) => {
    if (!watchlist.includes(item.id)) {
      setWatchlist([...watchlist, item.id])
    }
  }

  // Chart Data for Historical Return Curves
  const returnCurveData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
      {
        label: 'ACL Recovery Curve',
        data: [20, 40, 60, 80, 90],
        backgroundColor: 'rgba(200, 32, 32, 0.8)', // primary-600
        borderColor: 'rgba(200, 32, 32, 1)',
        borderWidth: 1,
      },
    ],
  }

  const returnCurveOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { title: { display: true, text: 'Performance (%)', color: '#E0E0E0' }, ticks: { color: '#E0E0E0' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }, x: { ticks: { color: '#E0E0E0' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } } },
    plugins: { title: { display: true, text: 'Average ACL Recovery', color: '#E0E0E0' }, legend: { labels: { color: '#E0E0E0' } } },
  }

  // 3D Scene for Interactive Body Maps
  const BodyMap3D = () => {
    const geometry = new THREE.BoxGeometry(2, 3, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    return (
      <group>
        <primitive object={new THREE.Mesh(geometry, material)} />
        <OrbitControls />
      </group>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-20rem)]">
        <SectionWrapper title="Injury Report Hub: Predictive Health & Performance Analytics">
          <div className="glass-card p-6 max-w-4xl mx-auto">
            <h3 className="text-3xl font-semibold text-lightText mb-6">Injury Report Hub</h3>
            <p className="text-grayText mb-8">Your definitive source for understanding player health, tracking recovery, and assessing injury impact as of 12:30 PM EDT, June 23, 2025.</p>

            {/* 1. Centralized & Filterable Injury Feed */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Centralized & Filterable Injury Feed</h4>
              <p className="text-grayText mb-4">Real-time updates with customizable filters.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Real-time Updates: e.g., 'Kyler Murray - Out'.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Filters: League, Team, Injury Type, Severity, Status, Timeline, Body Part.</p>
                </div>
              </div>
              {/* Corrected DndProvider usage */}
              <DndProvider options={HTML5toTouch}>
                <div className="flex gap-2 mb-2">
                  <DraggablePlayer id="player1">Kyler Murray</DraggablePlayer>
                  <DraggablePlayer id="player2">Jalen Hurts</DraggablePlayer>
                </div>
                <DropZone onDrop={handleDrop} watchlist={watchlist} />
                <p className="text-grayText mt-2">Watchlist: {watchlist.join(', ')}</p>
              </DndProvider>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Set Filters
              </a>
            </div>

            {/* 2. Predictive Injury Analytics */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Predictive Injury Analytics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Injury Risk Assessment: Load Management, Predictive Probability.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Red Flag Alerts: Elevated risk notifications.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Return-to-Play: Personalized timelines, Re-injury Probability.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Performance Drop-off: Post-injury predictions.</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                View Predictions
              </a>
            </div>

            {/* 3. Performance Impact Analysis */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Performance Impact Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">"Injury Adjusted" Performance: Before vs. After.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Team Impact Simulator: Quantify absence impact.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Replacement Player Analysis: Suggest replacements.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg h-64">
                  <Bar data={returnCurveData} options={returnCurveOptions} />
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Analyze Impact
              </a>
            </div>

            {/* 4. Advanced Visualizations */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Advanced Visualizations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg h-64">
                  <Canvas>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <BodyMap3D />
                  </Canvas>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Heatmaps of Injury Hotspots: Common areas by position.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Player Health Timelines: Injury history.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Team Injury Burden Graph: Cumulative cost.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Recovery Progress Charts: Milestone tracking.</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                View Visuals
              </a>
            </div>

            {/* 5. Deep-Dive Research & Archival Data */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Deep-Dive Research & Archival Data</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Comprehensive Injury Database: Searchable archive.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Injury Biomechanics Library: Mechanism explanations.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Medical Glossary & Resources: Injury terms.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Statistical Correlations: Factors vs. injury rates.</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Explore Research
              </a>
            </div>

            {/* 6. User-Generated Insights & Community */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">User-Generated Insights & Community</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Crowdsourced "Eye Test" Reports: Flag concerns.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Discussion Forums: Debate injuries.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">"What Are They Missing?": Identify hidden injuries.</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Join Community
              </a>
            </div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  )
}

// Drag-and-Drop Components
interface DraggablePlayerProps {
  id: string;
  children: React.ReactNode;
}

const DraggablePlayer = ({ id, children }: DraggablePlayerProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'player',
    item: { id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }))
  return (
    <div ref={drag} className="cursor-move p-2 bg-gray-700/50 rounded" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  )
}

interface DropZoneProps {
  onDrop: (item: { id: string }) => void;
  watchlist: string[];
}

const DropZone = ({ onDrop, watchlist }: DropZoneProps) => {
  const [, drop] = useDrop(() => ({
    accept: 'player',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }))
  return (
    <div
      ref={drop}
      className="border-dashed border-2 border-gray-700 p-4 rounded-lg h-24 flex items-center justify-center"
      style={{ borderColor: '#A0A0A0' }}
    >
      {watchlist.length === 0 ? 'Drop players here' : 'Watchlist: ' + watchlist.join(', ')}
    </div>
  )
}