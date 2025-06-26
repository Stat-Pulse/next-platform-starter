'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SectionWrapper from '../components/SectionWrapper'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { io } from 'socket.io-client' // For live tracking (future enhancement)

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function DraftHQ() {
  // Drag-and-Drop State for User Mock Drafts
  const [mockDraft, setMockDraft] = useState<string[]>([])
  const availablePicks = ['Caleb Williams (QB)', 'Drake Maye (QB)', 'Marvin Harrison Jr. (WR)']
  const handleDrop = (item: { id: string }) => {
    if (!mockDraft.includes(item.id)) {
      setMockDraft([...mockDraft, item.id])
    }
  }

  // Chart Data for Draft Slot Value Chart
  const slotValueData = {
    labels: ['Pick 1', 'Pick 10', 'Pick 20', 'Pick 32'],
    datasets: [
      {
        label: 'Average Win Shares',
        data: [15, 10, 7, 4],
        backgroundColor: 'rgba(200, 32, 32, 0.8)', // primary-600
        borderColor: 'rgba(200, 32, 32, 1)',
        borderWidth: 1,
      },
    ],
  }

  const slotValueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { title: { display: true, text: 'Win Shares', color: '#E0E0E0' }, ticks: { color: '#E0E0E0' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }, x: { ticks: { color: '#E0E0E0' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } } },
    plugins: { title: { display: true, text: 'Draft Slot Value', color: '#E0E0E0' }, legend: { labels: { color: '#E0E0E0' } } },
  }

  // 3D Scene for Dynamic Visual Draft Board
  const DraftBoard3D = () => {
    const groupRef = useRef<THREE.Group>(null)
    useEffect(() => {
      if (!groupRef.current) return;
      const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }) // Red for teams
      const sphere1 = new THREE.Mesh(sphereGeometry, material)
      sphere1.position.set(-2, 1, 0)
      const sphere2 = new THREE.Mesh(sphereGeometry, material.clone())
      sphere2.position.set(2, 1, 0)
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2, 1, 0), new THREE.Vector3(2, 1, 0)])
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }) // Green for pick movement
      const line = new THREE.Line(lineGeometry, lineMaterial)
      groupRef.current.add(sphere1, sphere2, line)

      const boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3)
      const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }) // Blue for picks
      const box1 = new THREE.Mesh(boxGeometry, boxMaterial)
      box1.position.set(0, 0, 0)
      groupRef.current.add(box1)
    }, [])

    return (
      <group ref={groupRef}>
        <OrbitControls />
      </group>
    )
  }

  // Live Draft Tracking (Future Enhancement Placeholder)
  useEffect(() => {
    const socket = io('http://localhost:3000')
    socket.on('draftUpdate', (data) => {
      console.log('Draft update received:', data)
      // Update state with real-time picks (e.g., setMockDraft, animate 3D board)
    })
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-20rem)]">
        <SectionWrapper title="Draft HQ: Your Command Center for Scouting & Strategy">
          <div className="glass-card p-6 max-w-4xl mx-auto">
            <h3 className="text-3xl font-semibold text-lightText mb-6">Draft HQ</h3>
            <p className="text-grayText mb-8">The definitive destination for dissecting the 2025 NFL Draft as of 1:45 PM CDT, June 25, 2025.</p>

            {/* 1. Interactive Draft Board & Big Board */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Interactive Draft Board & Big Board</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg h-64">
                  <Canvas>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <DraftBoard3D />
                  </Canvas>
                  {/* Future Enhancement: Real-time pick updates via WebSocket */}
                  {/* <p className="text-grayText mt-2">Live Pick: #1 - Caleb Williams</p> */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Best Available: Caleb Williams</p>
                  <p className="text-grayText">Tiered Rankings: Tier 1 - QB</p>
                  <p className="text-grayText">Positional Rankings: WR - Top 5</p>
                  {/* Future Enhancement: Add hover/click for player cards */}
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                View Draft Board
              </a>
            </div>

            {/* 2. Prospect Analytical Profiles */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Prospect Analytical Profiles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Player DNA: Adjusted Yards Per Attempt - 7.5</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Athletic Profile: 40-yard - 4.5s (85th percentile)</p>
                  {/* Future Enhancement: Interactive percentile chart */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Player Comps: Similarity to Lamar Jackson - 88%</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Injury Risk: Low (5% probability)</p>
                  {/* Future Enhancement: Link to Injury Report Hub */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Cognitive Assessment: High Decision Speed</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Film Study: Key Play Highlights</p>
                  {/* Future Enhancement: Embed AI-tagged video clips */}
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                View Profiles
              </a>
            </div>

            {/* 3. Team-Specific Strategy & Needs Analysis */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Team-Specific Strategy & Needs Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Team: Eagles - Need: WR</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Draft Capital: 3 Picks in 2025</p>
                  {/* Future Enhancement: Dynamic pick tracker */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Front Office Tendency: Early QB Picks</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Scheme Fit: Marvin Harrison Jr. - 90%</p>
                  {/* Future Enhancement: Interactive scheme fit calculator */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Mock Draft: Eagles - WR at #10</p>
                  {/* Future Enhancement: Automated mock generator */}
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Simulate Strategy
              </a>
            </div>

            {/* 4. Predictive Analytics & Modeling */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Predictive Analytics & Modeling</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Player Projection: 2500 yards, 20 TD</p>
                  {/* Future Enhancement: Confidence intervals */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg h-64">
                  <Bar data={slotValueData} options={slotValueOptions} />
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Trade Probability: 60% Trade Up</p>
                  {/* Future Enhancement: Real-time probability calculator */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Boom/Bust: High Ceiling - 80%</p>
                  {/* Future Enhancement: Detailed ceiling/floor analysis */}
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Predict Draft
              </a>
            </div>

            {/* 5. Live Draft Tracker & Post-Draft Analysis */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Live Draft Tracker & Post-Draft Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Pick #1: Caleb Williams - A+</p>
                  {/* Future Enhancement: Real-time pick updates */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Post-Draft Grade: Eagles - B</p>
                  {/* Future Enhancement: Team grade breakdown */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Undrafted Gem: QB Smith</p>
                  {/* Future Enhancement: Gem tracker with profiles */}
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Track Draft
              </a>
            </div>

            {/* 6. Community & Expert Insights */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Community & Expert Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">User Mock Draft: Share Yours</p>
                  <DndProvider backend={HTML5Backend}>
                    <div className="flex gap-2">
                      {availablePicks.map((pick) => (
                        <DraggablePick key={pick} id={pick}>{pick}</DraggablePick>
                      ))}
                    </div>
                    <DropZone onDrop={handleDrop} mockDraft={mockDraft} />
                    <p className="text-grayText mt-2">Your Draft: {mockDraft.join(', ')}</p>
                    {/* Future Enhancement: Trade simulation and ranking calculation */}
                  </DndProvider>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Expert Mock: Caleb at #1</p>
                  {/* Future Enhancement: Detailed expert explanations */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Draft Chat: Live Now</p>
                  {/* Future Enhancement: Live chat embed */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Scout's Corner: GM Insights</p>
                  {/* Future Enhancement: Video interview embed */}
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
const DraggablePick = ({ id, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'pick',
    item: { id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }))
  return (
    <div ref={drag as unknown as React.Ref<HTMLDivElement>} className="cursor-move p-2 bg-gray-700/50 rounded" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  )
}

const DropZone = ({ onDrop, mockDraft }) => {
  const [, drop] = useDrop(() => ({
    accept: 'pick',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }))
  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className="border-dashed border-2 border-gray-700 p-4 rounded-lg h-24 flex items-center justify-center"
      style={{ borderColor: '#A0A0A0' }}
    >
      {mockDraft.length === 0 ? 'Drop picks here' : 'Your Mock Draft: ' + mockDraft.join(', ')}
    </div>
  )
}
