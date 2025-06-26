'use client'

import { useState, useEffect, useRef } from 'react'
import SidebarNavigation from '../components/SidebarNavigation'
import SectionWrapper from '../components/SectionWrapper'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js'
import { Scatter } from 'react-chartjs-2'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend)

export default function MediaVault() {
  // Drag-and-Drop State for Build Your Own Playlists
  const [playlists, setPlaylists] = useState<string[]>([])
  const availableClips = ['Mahomes No-Look Pass', 'Blown Coverage vs. WR', 'QB Scramble']
  const handleDrop = (item: { id: string }) => {
    if (!playlists.includes(item.id)) {
      setPlaylists([...playlists, item.id])
    }
  }

  // Chart Data for Shot Charts/Heatmaps
  const shotChartData = {
    datasets: [
      {
        label: 'Shot Efficiency',
        data: [
          { x: 10, y: 20, r: 10 }, // Example point with radius for heat
          { x: 30, y: 40, r: 15 },
          { x: 50, y: 60, r: 8 },
        ],
        backgroundColor: 'rgba(200, 32, 32, 0.6)', // primary-600 with transparency
        pointRadius: 10,
        pointHoverRadius: 15,
      },
    ],
  }

  const shotChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { title: { display: true, text: 'X Position', color: '#E0E0E0' }, ticks: { color: '#E0E0E0' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }, y: { title: { display: true, text: 'Y Position', color: '#E0E0E0' }, ticks: { color: '#E0E0E0' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } } },
    plugins: { title: { display: true, text: 'Shot Chart', color: '#E0E0E0' }, legend: { display: false } },
  }

  // 3D Scene for Player Tracking Data
  const PlayerTracking3D = () => {
    const groupRef = useRef<THREE.Group>(null)
    useEffect(() => {
      if (!groupRef.current) return
      const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32)
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }) // Red for player
      const sphere = new THREE.Mesh(sphereGeometry, material)
      sphere.position.set(0, 1, 0)
      groupRef.current.add(sphere)

      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(2, 0, 0),
      ])
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }) // Green for movement
      const line = new THREE.Line(lineGeometry, lineMaterial)
      groupRef.current.add(line)
    }, [])

    return (
      <group ref={groupRef as unknown as React.Ref<THREE.Group>}>
        <OrbitControls />
      </group>
    )
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside className="w-full md:w-64 bg-mediumBackground/80 border-r border-gray-800">
        <SidebarNavigation />
      </aside>
      <main className="flex-1 min-h-[calc(100vh-0rem)]">
        <SectionWrapper title="The Media Vault: Visualizing Performance, Unlocking Insights">
          <div className="glass-card p-6 max-w-4xl mx-auto">
            <h3 className="text-3xl font-semibold text-lightText mb-6">The Media Vault</h3>
            <p className="text-grayText mb-8">Your immersive portal into the visual world of sports as of 5:50 PM CDT, June 25, 2025.</p>

            {/* 1. Comprehensive & Data-Rich Video Library */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Comprehensive & Data-Rich Video Library</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Full Game Replays: Eagles vs. Cowboys</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Curated Highlights: Top QB Rushes</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Historical Footage: Super Bowl XXV</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Player Library: Patrick Mahomes</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Explore Library
              </a>
            </div>

            {/* 2. Interactive Play-by-Play & Statistical Overlays */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Interactive Play-by-Play & Statistical Overlays</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg h-64">
                  <Canvas>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <PlayerTracking3D />
                  </Canvas>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Dynamic Overlay: EPA +2.5</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Route Trees: Visible Routes</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg h-64">
                  <Scatter data={shotChartData} options={shotChartOptions} />
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Custom Filters: Select Metrics</p>
                  {/* Placeholder for overlay filters: Add checkbox component */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Annotate: Draw on Video</p>
                  {/* Placeholder for drawing tool: Add canvas or library */}
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Analyze Plays
              </a>
            </div>

            {/* 3. Advanced Search & Filtering Capabilities */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Advanced Search & Filtering Capabilities</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">AI Tags: QB Scramble</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Natural Search: 'Mahomes Step-Back'</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Filters: Player, Opponent, Play Type</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Filters: Down, Outcome, Personnel</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Search Vault
              </a>
            </div>

            {/* 4. Comparative & Analytical Playlists */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Comparative & Analytical Playlists</h4>
              <DndProvider backend={HTML5Backend}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-mediumBackground/50 p-4 rounded-lg">
                    <p className="text-grayText">Available Clips:</p>
                    {availableClips.map((clip) => (
                      <DraggableClip key={clip} id={clip}>{clip}</DraggableClip>
                    ))}
                  </div>
                  <DropZone onDrop={handleDrop} playlists={playlists} />
                </div>
                <div className="mt-4">
                  <p className="text-grayText">Your Playlist: {playlists.join(', ')}</p>
                  {/* Future Enhancement: Side-by-side comparison tool */}
                </div>
              </DndProvider>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Create Playlist
              </a>
            </div>

            {/* 5. Community & Collaborative Features */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Community & Collaborative Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Shareable Clips: Share Annotations</p>
                  {/* Future Enhancement: Add share button with API */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Community Playlists: Discover Curated</p>
                  {/* Future Enhancement: Add playlist gallery */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Commentary: Discuss Plays</p>
                  {/* Future Enhancement: Add comment section */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">User Content: Submit Breakdowns</p>
                  {/* Future Enhancement: Add upload form */}
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Join Community
              </a>
            </div>

            {/* 6. Integration with Other Hubs */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Integration with Other Hubs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Link to Analytics Lab: Player Usage</p>
                  {/* Future Enhancement: Dynamic link to /analytics-lab */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Link to Injury Report: Injury Clips</p>
                  {/* Future Enhancement: Dynamic link to /injury-report-hub */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Link to Power Rankings: Grade Impact</p>
                  {/* Future Enhancement: Dynamic link to /power-rankings-grades */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">News Context: Trade Video</p>
                  {/* Future Enhancement: Dynamic link to /league-news-hub */}
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Explore Integrations
              </a>
            </div>
          </div>
        </SectionWrapper>
      </main>
    </div>
  )
}


const DraggableClip = ({ id, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'clip',
    item: { id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      drag(ref.current);
    }
  }, [drag]);

  return (
    <div
      ref={ref}
      className="cursor-move p-2 bg-gray-700/50 rounded"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {children}
    </div>
  );
}

const DropZone = ({ onDrop, playlists }) => {
  const [, drop] = useDrop(() => ({
    accept: 'clip',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }))
  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className="border-dashed border-2 border-gray-700 p-4 rounded-lg h-24 flex items-center justify-center"
      style={{ borderColor: '#A0A0A0' }}
    >
      {playlists.length === 0 ? 'Drop clips here' : 'Your Playlist: ' + playlists.join(', ')}
    </div>
  )
}

// 3D Component for Player Tracking Data
const PlayerTracking3D = () => {
  const groupRef = useRef<THREE.Group>(null)
  useEffect(() => {
    if (!groupRef.current) return
    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }) // Red for player
    const sphere = new THREE.Mesh(sphereGeometry, material)
    sphere.position.set(0, 1, 0)
    groupRef.current.add(sphere)

    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(2, 0, 0),
    ])
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }) // Green for movement
    const line = new THREE.Line(lineGeometry, lineMaterial)
    groupRef.current.add(line)
  }, [])

  return (
    <group ref={groupRef as unknown as React.Ref<THREE.Group>}>
      <OrbitControls />
    </group>
  )
}