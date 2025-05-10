// pages/compare.js
'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CompareSearch from '../components/CompareSearch'
import CompareFilters from '../components/CompareFilters'
import CustomizeMetricsModal from '../components/CustomizeMetricsModal'
import ComparisonSections from '../components/ComparisonSections'

export default function Compare() {
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [metrics, setMetrics]                 = useState(['fantasyPoints','efficiency','matchup'])
  const [isModalOpen, setIsModalOpen]         = useState(false)

  return (
    <>
      <Header />

      <main className="bg-gray-100 py-6">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Compare Players
          </h2>

          {/* DEBUG #1: show the current selectedPlayers array */}
          <pre className="bg-red-100 text-red-800 p-2 mb-4">
            DEBUG selectedPlayers = {JSON.stringify(selectedPlayers)}
          </pre>

          <CompareSearch
            selectedPlayers={selectedPlayers}
            onUpdate={setSelectedPlayers}
          />

          {/* DEBUG #2: tell us when we have 2+ players */}
          <div className="text-blue-600 mb-4">
            {selectedPlayers.length >= 2 && 'DEBUG: ComparisonSections will render below now'}
          </div>

          <CompareFilters
            metrics={metrics}
            onOpenCustomize={() => setIsModalOpen(true)}
            onSaveComparison={() => {}}
          />

          <CustomizeMetricsModal
            isOpen={isModalOpen}
            metrics={metrics}
            onChange={setMetrics}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </main>

      <ComparisonSections
        players={selectedPlayers}
        metrics={metrics}
      />

      <Footer />
    </>
  )
}
