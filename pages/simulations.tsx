'use client'

import { useState, useEffect, useRef } from 'react'
import SidebarNavigation from '../components/SidebarNavigation'
import SectionWrapper from '../components/SectionWrapper'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function SimulationsLab() {
  // Drag-and-Drop State for Proposed Trade Analysis
  const [tradeComponents, setTradeComponents] = useState<string[]>([])
  const availableTrades = ['Player X', 'Player Y + Pick 32', '2 Picks']
  const handleDrop = (item: { id: string }) => {
    if (!tradeComponents.includes(item.id)) {
      setTradeComponents([...tradeComponents, item.id])
    }
  }

  // Chart Data for Win Probability Distribution
  const winProbData = {
    labels: ['0-10', '11-20', '21-30', '31+'],
    datasets: [
      {
        label: 'Eagles Win Margin (%)',
        data: [10, 20, 50, 20],
        backgroundColor: 'rgba(200, 32, 32, 0.8)', // primary-600
        borderColor: 'rgba(200, 32, 32, 1)',
        borderWidth: 1,
      },
    ],
  }

  const winProbOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { title: { display: true, text: 'Probability (%)', color: '#E0E0E0' }, ticks: { color: '#E0E0E0' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }, x: { ticks: { color: '#E0E0E0' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } } },
    plugins: { title: { display: true, text: 'Win Probability Distribution', color: '#E0E0E0' }, legend: { labels: { color: '#E0E0E0' } } },
  }

  // 3D Scene for Path to Championship Visualizer
  const ChampionshipPath3D = () => {
    const groupRef = useRef<THREE.Group>(null)
    useEffect(() => {
      const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }) // Red for teams
      const sphere1 = new THREE.Mesh(sphereGeometry, material)
      sphere1.position.set(-2, 1, 0)
      const sphere2 = new THREE.Mesh(sphereGeometry, material.clone())
      sphere2.position.set(2, 1, 0)
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2, 1, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(2, 1, 0)])
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }) // Green for path
      const line = new THREE.Line(lineGeometry, lineMaterial)
      if (groupRef.current) {
        groupRef.current.add(sphere1, sphere2, line)
      }
    }, [])

    return (
      <group ref={groupRef}>
        <OrbitControls />
      </group>
    )
  }

  // Simulation Controls Component
  const [variables, setVariables] = useState({ efficiency: 0, injury: 0, homeAdv: 0 })
  const SimulationControls = ({ variables, setVariables, onChange }) => {
    const handleChange = (e) => {
      const { name, value } = e.target
      const newValue = parseInt(value)
      setVariables((prev) => {
        const updated = { ...prev, [name]: newValue }
        if (onChange) {
          onChange(updated)
        }
        return updated
      })
    }

    return (
      <div className="bg-mediumBackground/50 p-4 rounded-lg mb-4">
        <label className="block text-grayText mb-2">Efficiency Boost (%): {variables.efficiency}</label>
        <input
          type="range"
          name="efficiency"
          min="-20"
          max="20"
          value={variables.efficiency}
          onChange={handleChange}
          className="w-full accent-primary-600"
        />
        <label className="block text-grayText mb-2 mt-4">Injury Impact (%): {variables.injury}</label>
        <input
          type="range"
          name="injury"
          min="0"
          max="100"
          value={variables.injury}
          onChange={handleChange}
          className="w-full accent-primary-600"
        />
        <label className="block text-grayText mb-2 mt-4">Home Advantage (%): {variables.homeAdv}</label>
        <input
          type="range"
          name="homeAdv"
          min="0"
          max="10"
          value={variables.homeAdv}
          onChange={handleChange}
          className="w-full accent-primary-600"
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-mainBackground">
      <SidebarNavigation />
      <main className="flex-1 min-h-screen p-0">
        <SectionWrapper title="Simulations Lab: Model the Game. Predict the Future">
          <div className="glass-card p-6 max-w-4xl mx-auto">
            <h3 className="text-3xl font-semibold text-lightText mb-6">Simulations Lab</h3>
            <p className="text-grayText mb-8">Your ultimate 'What-If' engine as of 7:54 PM CDT, June 25, 2025.</p>

            {/* 1. Game Outcome Simulator */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Game Outcome Simulator</h4>
              <SimulationControls
                variables={variables}
                setVariables={setVariables}
                onChange={(vars) => console.log('Simulation variables updated:', vars)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Matchup: Eagles vs. Chiefs</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Adjustments: Jalen Hurts +{variables.efficiency}% Efficiency</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Situational Bias: Home Advantage +{variables.homeAdv}%</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Randomness: Realistic</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg h-64">
                  <Bar data={winProbData} options={winProbOptions} />
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Play-by-Play: Key Drive at 3rd Quarter</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Simulate Game
              </a>
            </div>

            {/* 2. Season Outcome Predictor */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Season Outcome Predictor</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Playoff Probability: Eagles - 75%</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Championship Odds: Chiefs - 40%</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Draft Pick: Cardinals - #15</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Schedule Impact: Medium</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Trade Scenario: +5% Odds</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Predict Season
              </a>
            </div>

            {/* 3. Player Career Trajectory & Development Simulator */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Player Career Trajectory & Development Simulator</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Player: Caleb Williams</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Coaching: High Impact Coach</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Training: Intensive</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Injury: Low Risk</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Team: Eagles</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Hall of Fame: 60% Probability</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Simulate Career
              </a>
            </div>

            {/* 4. Draft Impact Simulator */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Draft Impact Simulator</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Mock Draft: Eagles - WR</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Your Team: Eagles Draft</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Roster Fit: 85% Compatibility</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Simulate Draft
              </a>
            </div>

            {/* 5. Trade & Free Agency Impact Simulator */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Trade & Free Agency Impact Simulator</h4>
              <DndProvider backend={HTML5Backend}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-mediumBackground/50 p-4 rounded-lg">
                    <p className="text-grayText">Available Trades:</p>
                    {availableTrades.map((trade) => (
                      <DraggableTrade key={trade} id={trade}>{trade}</DraggableTrade>
                    ))}
                  </div>
                  <DropZone onDrop={handleDrop} tradeComponents={tradeComponents} />
                </div>
                <div className="mt-4">
                  <p className="text-grayText">Proposed Trade: {tradeComponents.join(' for ')}</p>
                  {/* Future Enhancement: Calculate impact on rankings, odds, cap */}
                </div>
              </DndProvider>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Simulate Trade
              </a>
            </div>

            {/* 6. Visualization of Simulation Results */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Visualization of Simulation Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Dynamic Charts: Win Probabilities</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg h-64">
                  <Canvas>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <ChampionshipPath3D />
                  </Canvas>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Scenario Comparison: Trade Impact</p>
                  {/* Future Enhancement: Side-by-side comparison */}
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Outcome Exploration: Key Plays</p>
                  {/* Future Enhancement: Drill-down interface */}
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                View Results
              </a>
            </div>

            {/* 7. Methodology & Transparency */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-lightText mb-4">Methodology & Transparency</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Model: Monte Carlo Simulations</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Data Inputs: League Stats</p>
                </div>
                <div className="bg-mediumBackground/50 p-4 rounded-lg">
                  <p className="text-grayText">Assumptions: Limited by Data</p>
                </div>
              </div>
              <a href="#" className="btn bg-primary-600 hover:bg-primary-500 text-lightText mt-4 inline-block">
                Learn Methodology
              </a>
            </div>
          </div>
        </SectionWrapper>
      </main>
    </div>
  )
}

// Drag-and-Drop Components
const DraggableTrade = ({ id, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'trade',
    item: { id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }))
  return (
    <div ref={drag as unknown as React.Ref<HTMLDivElement>} className="cursor-move p-2 bg-gray-700/50 rounded" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  )
}

const DropZone = ({ onDrop, tradeComponents }) => {
  const [, drop] = useDrop(() => ({
    accept: 'trade',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }))
  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      className="border-dashed border-2 border-gray-700 p-4 rounded-lg h-24 flex items-center justify-center"
      style={{ borderColor: '#A0A0A0' }}
    >
      {tradeComponents.length === 0 ? 'Drop trade components here' : 'Trade Proposal: ' + tradeComponents.join(' for ')}
    </div>
  )
}