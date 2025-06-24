'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SectionWrapper from '../components/SectionWrapper'
import { DndProvider } from 'react-dnd'
import { useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Define types for DnD items
type PreferenceItem = { id: string }

export default function LeagueNewsHub() {
  // Drag-and-Drop State for Personalized Feeds
  const [feedPreferences, setFeedPreferences] = useState<string[]>([])
  const availablePreferences = ['Dallas Cowboys', 'Josh Allen', 'Trades', 'Injuries', 'High Impact']
  
  const handleDrop = useCallback((item: PreferenceItem) => {
    if (!feedPreferences.includes(item.id)) {
      setFeedPreferences(prev => [...prev, item.id])
    }
  }, [feedPreferences])

  // Memoize chart data for better performance
  const heatmapData = useMemo(() => ({
    labels: ['June 15', 'June 20', 'June 23', 'June 25'],
    datasets: [
      {
        label: 'News Volume',
        data: [10, 15, 25, 12],
        backgroundColor: 'rgba(200, 32, 32, 0.8)',
        borderColor: 'rgba(200, 32, 32, 1)',
        borderWidth: 1,
      },
    ],
  }), [])

  const heatmapOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: { 
      y: { 
        title: { display: true, text: 'Volume', color: '#E0E0E0' }, 
        ticks: { color: '#E0E0E0' }, 
        grid: { color: 'rgba(255, 255, 255, 0.1)' } 
      }, 
      x: { 
        ticks: { color: '#E0E0E0' }, 
        grid: { color: 'rgba(255, 255, 255, 0.1)' } 
      } 
    },
    plugins: { 
      title: { display: true, text: 'League Activity Heatmap', color: '#E0E0E0' }, 
      legend: { labels: { color: '#E0E0E0' } } 
    },
  }), [])

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-20rem)]">
        <SectionWrapper title="League News Hub: Beyond the Headlines">
          <div className="glass-card p-6 max-w-4xl mx-auto">
            <h3 className="text-3xl font-semibold text-lightText mb-6">League News Hub</h3>
            <p className="text-grayText mb-8">Transforming raw information into actionable insights as of 1:15 PM EDT, June 23, 2025.</p>

            {/* 1. Dynamic & Customizable News Feed */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Dynamic & Customizable News Feed</h4>
              <p className="text-grayText mb-4">Intelligent filtering and personalized feeds.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Filters: Team, News Type, Impact, Source, Timeframe.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Top Stories by Impact: e.g., 'Kyler Murray Injury'.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Trending Topics: Injuries, Trades.</p>
                </div>
              </div>
              <DndProvider backend={HTML5Backend}>
                <div className="flex gap-2 mb-2">
                  {availablePreferences.map((pref) => (
                    <DraggablePreference key={pref} id={pref}>{pref}</DraggablePreference>
                  ))}
                </div>
                <DropZone onDrop={handleDrop} feedPreferences={feedPreferences} />
                <p className="text-grayText mt-2">Personalized Feed: {feedPreferences.join(', ')}</p>
              </DndProvider>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Customize Feed
              </a>
            </div>

            {/* 2. News Impact Analysis & Visualizations */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">News Impact Analysis & Visualizations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Link to Analytics Lab: Usage impact.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Link to Injury Report: Recovery timeline.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Link to Power Rankings: Grade shift.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Impact Meter: High Impact (80%).</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Before & After Stats: Player X - 300 vs. 250 yards.</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg h-64">
                  <Canvas>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <TransactionFlow3D />
                  </Canvas>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Analyze Impact
              </a>
            </div>

            {/* 3. The "Rumor Mill" & Reliability Tracker */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">The "Rumor Mill" & Reliability Tracker</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Rumor: QB Trade - 85% Reliability</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Trending Rumors: Coaching Change</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Debunked: False Injury Report</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Source Tracking: Updated reliability</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Explore Rumors
              </a>
            </div>

            {/* 4. Interactive News Timelines & Trends */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Interactive News Timelines & Trends</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Story Progression: Coaching Search</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg h-64">
                  <Bar data={heatmapData} options={heatmapOptions} />
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Sentiment Analysis: Neutral</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">News-Driven Trends: QB Injuries</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                View Trends
              </a>
            </div>

            {/* 5. Rich Media Integration & Commentary */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Rich Media Integration & Commentary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Embedded Video: Press Conference</p>
                  {/* Placeholder for video: Add iframe or player */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Infographic: Salary Cap Impact</p>
                  {/* Placeholder for infographic: Add SVG or image */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Analyst Commentary: Trade Implications</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Community Q&A: Premium Feature</p>
                  {/* Placeholder for discussion: Add form or link */}
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                View Media
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
interface DraggableProps {
  id: string;
  children: React.ReactNode;
}

const DraggablePreference = ({ id, children }: DraggableProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'preference',
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))
  
  return (
    <div 
      ref={drag} 
      className="cursor-move p-2 bg-gray-700/50 rounded" 
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {children}
    </div>
  )
}

interface DropZoneProps {
  onDrop: (item: PreferenceItem) => void;
  feedPreferences: string[];
}

const DropZone = ({ onDrop, feedPreferences }: DropZoneProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'preference',
    drop: (item: PreferenceItem) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))
  
  return (
    <div
      ref={drop}
      className={`border-dashed border-2 p-4 rounded-lg h-24 flex items-center justify-center transition-colors ${
        isOver ? 'border-primary-500 bg-primary-900/20' : 'border-gray-700'
      }`}
    >
      {feedPreferences.length === 0 
        ? 'Drop preferences here' 
        : 'Feed: ' + feedPreferences.join(', ')}
    </div>
  )
}

// Fixed 3D Component for Transaction Flow Visualizer
const TransactionFlow3D = () => {
  const groupRef = useRef<THREE.Group>(null)
  
  useEffect(() => {
    if (!groupRef.current) return;
    
    const group = groupRef.current
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    
    const sphere1 = new THREE.Mesh(sphereGeometry, material)
    sphere1.position.set(-2, 0, 0)
    
    const sphere2 = new THREE.Mesh(sphereGeometry.clone(), material.clone())
    sphere2.position.set(2, 0, 0)
    
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(2, 0, 0)
    ])
    
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 })
    const line = new THREE.Line(lineGeometry, lineMaterial)
    
    group.add(sphere1, sphere2, line)
    
    return () => {
      group.remove(sphere1, sphere2, line)
      sphereGeometry.dispose()
      material.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
    }
  }, [])

  return (
    <>
      <group ref={groupRef} />
      <OrbitControls enableZoom={true} enablePan={false} />
    </>
  )
}