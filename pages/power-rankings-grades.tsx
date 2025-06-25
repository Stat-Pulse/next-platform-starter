'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SectionWrapper from '../components/SectionWrapper'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)

export default function PowerRankingsGrades() {
  // Drag-and-Drop State for Build Your Own Ranking
  const [customMetrics, setCustomMetrics] = useState<string[]>([])
  const availableMetrics = ['Yards per Play', 'EPA', 'DVOA', 'Success Rate', 'Eye Test Score']
  const handleDrop = (item: { id: string }) => {
    if (!customMetrics.includes(item.id)) {
      setCustomMetrics([...customMetrics, item.id])
    }
  }

  // Chart Data for Ranking Trajectory
  const trajectoryData = {
    labels: ['Week 1', 'Week 5', 'Week 10', 'Week 15'],
    datasets: [
      {
        label: 'Eagles True Strength',
        data: [75, 80, 85, 88],
        borderColor: 'rgba(200, 32, 32, 1)', // primary-600
        backgroundColor: 'rgba(200, 32, 32, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Chiefs True Strength',
        data: [80, 82, 84, 86],
        borderColor: 'rgba(0, 191, 255, 1)', // accentBlue
        backgroundColor: 'rgba(0, 191, 255, 0.2)',
        tension: 0.1,
      },
    ],
  }

  const trajectoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { title: { display: true, text: 'True Strength Rating', color: '#E0E0E0' }, ticks: { color: '#E0E0E0' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }, x: { ticks: { color: '#E0E0E0' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } } },
    plugins: { title: { display: true, text: 'Ranking Trajectory', color: '#E0E0E0' }, legend: { labels: { color: '#E0E0E0' } } },
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-20rem)]">
        <SectionWrapper title="Power Rankings & Grades: The Definitive Strength Assessment">
          <div className="glass-card p-6 max-w-4xl mx-auto">
            <h3 className="text-3xl font-semibold text-lightText mb-6">Power Rankings & Grades</h3>
            <p className="text-grayText mb-8">The most comprehensive and insightful assessment of team and player strength as of 12:50 PM EDT, June 23, 2025.</p>

            {/* 1. Multi-Dimensional Power Rankings */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Multi-Dimensional Power Rankings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">True Strength: Eagles - 88, Chiefs - 86</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Predictive Power: Eagles +2%</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Performance-Based: Cardinals - 85</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Consistency Index: Ravens - 90%</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Consensus: Differs by 5 points</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Deviation Analysis: Explained by injuries</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                View Rankings
              </a>
            </div>

            {/* 2. Deep Dive Team & Positional Grades */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Deep Dive Team & Positional Grades</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Overall Team: Eagles - 87</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Offense: QB - 90, OL - 85</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Defense: DL - 88, LB - 82</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Special Teams: K - 87</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Player Contribution: Jalen Hurts - 15%</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                View Grades
              </a>
            </div>

            {/* 3. Interactive & Customizable Grading System */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">"Build Your Own Ranking" Tool</h4>
              <DndProvider backend={HTML5Backend}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-mediumBackground/50 p-4 rounded-lg">
                    <p className="text-grayText">Available Metrics:</p>
                    {availableMetrics.map((metric) => (
                      <DraggableMetric key={metric} id={metric}>{metric}</DraggableMetric>
                    ))}
                  </div>
                  {/* PASS customMetrics AS PROP */}
                  <DropZone onDrop={handleDrop} customMetrics={customMetrics} />
                </div>
                <div className="mt-4">
                  <p className="text-grayText">Custom Metrics: {customMetrics.join(', ')}</p>
                </div>
              </DndProvider>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Build Ranking
              </a>
            </div>

            {/* 4. Visualizations & Trends */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Visualizations & Trends</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg h-64">
                  <Line data={trajectoryData} options={trajectoryOptions} />
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Strength of Schedule: Eagles - 0.75</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Comparative Grade Radars: Coming Soon</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg h-64">
                  <Canvas>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <TeamTree3D />
                  </Canvas>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Matchup Grade Predictions: Eagles vs. Chiefs</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                View Trends
              </a>
            </div>

            {/* 5. Transparency & Methodology */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Transparency & Methodology</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Methodology: Algorithm details</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Data Sources: League data, tracking</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Bias Disclosure: Ongoing refinement</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Last Updated: June 23, 2025</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Learn Methodology
              </a>
            </div>

            {/* 6. Expert Commentary & Community Insights */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Expert Commentary & Community Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Analyst Commentary: Weekly breakdowns</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Community Debate: Share opinions</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">"What If" Scenarios: e.g., Pass blocking +10%</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Join Discussion
              </a>
            </div>
          </div>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  )
}

// DraggableMetric Type
type DraggableMetricProps = {
  id: string
  children: React.ReactNode
}
const DraggableMetric: React.FC<DraggableMetricProps> = ({ id, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'metric',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      drag(ref.current)
    }
  }, [drag])
  return (
    <div
      ref={ref}
      className="cursor-move p-2 bg-gray-700/50 rounded"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {children}
    </div>
  )
}

// DropZone Type
type DropZoneProps = {
  onDrop: (item: { id: string }) => void
  customMetrics: string[]
}
const DropZone: React.FC<DropZoneProps> = ({ onDrop, customMetrics }) => {
  const [, drop] = useDrop(() => ({
    accept: 'metric',
    drop: (item) => onDrop(item),
  }))
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      drop(ref.current)
    }
  }, [drop])
  return (
    <div
      ref={ref}
      className="border-dashed border-2 border-gray-700 p-4 rounded-lg h-32 flex items-center justify-center"
      style={{ borderColor: '#A0A0A0' }}
    >
      {customMetrics.length === 0
        ? 'Drop metrics here'
        : 'Selected Metrics: ' + customMetrics.join(', ')}
    </div>
  )
}

// 3D Team Tree
const TeamTree3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  useEffect(() => {
    if (!groupRef.current) return
    // Clear group first
    while (groupRef.current.children.length > 0) {
      groupRef.current.remove(groupRef.current.children[0])
    }
    // Add sphere
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const sphere = new THREE.Mesh(sphereGeometry, material)
    sphere.position.set(0, 1, 0)
    groupRef.current.add(sphere)
    // Add boxes
    const boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3)
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const box1 = new THREE.Mesh(boxGeometry, boxMaterial)
    box1.position.set(-1, 0, 0)
    const box2 = new THREE.Mesh(boxGeometry, boxMaterial)
    box2.position.set(1, 0, 0)
    groupRef.current.add(box1)
    groupRef.current.add(box2)
  }, [])
  return (
    <group ref={groupRef as React.MutableRefObject<THREE.Group>}>
      <OrbitControls />
    </group>
  )
}