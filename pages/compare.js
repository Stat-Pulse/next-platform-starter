// pages/compare.js
import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CompareSearch from '../components/CompareSearch'
import CompareFilters from '../components/CompareFilters'
import CustomizeMetricsModal from '../components/CustomizeMetricsModal'
import ComparisonSections from '../components/ComparisonSections'

export default function Compare() {
  const [players, setPlayers] = useState([])
  const [metrics, setMetrics] = useState(['fantasyPoints','efficiency','matchup'])
  const [isModalOpen, setIsModalOpen] = useState(false)

  'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CompareSearch from '../components/CompareSearch'
import CompareFilters from '../components/CompareFilters'
import CustomizeMetricsModal from '../components/CustomizeMetricsModal'
import ComparisonSections from '../components/ComparisonSections'

export default function Compare() {
  // rename to selectedPlayers (to match your child components)
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [metrics, setMetrics] = useState(['fantasyPoints','efficiency','matchup'])
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-6">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Compare Players</h2>

          {/* pass the correct props */}
          <CompareSearch
            selectedPlayers={selectedPlayers}
            onUpdate={setSelectedPlayers}
          />

          <CompareFilters
            metrics={metrics}
            onOpenCustomize={() => setIsModalOpen(true)}
            onSaveComparison={() => {
              /* you can extend this later */
            }}
          />

          <CustomizeMetricsModal
            isOpen={isModalOpen}
            metrics={metrics}
            onChange={setMetrics}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </main>

      {/* now pass selectedPlayers & metrics */}
      <ComparisonSections
        players={selectedPlayers}
        metrics={metrics}
      />

      <Footer />
    </>
  )
}
