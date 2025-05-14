'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CompareSearch from '../components/CompareSearch'
import CompareFilters from '../components/CompareFilters'
import CustomizeMetricsModal from '../components/CustomizeMetricsModal'
import ComparisonSections from '../components/ComparisonSections'

export default function Compare() {
  const [selectedPlayers, setSelectedPlayers] = useState([
    '00-0023459', // Example: Aaron Rodgers
    '00-0033873'  // Example: Josh Allen
  ])
  const [metrics, setMetrics] = useState(['tds', 'passYards', 'rushYards', 'receivingYards'])
  const [viewMode, setViewMode] = useState('career')
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Header />

      <main className="bg-gray-100 py-6">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Compare Players
          </h2>

          <CompareSearch
            selectedPlayers={selectedPlayers}
            onUpdate={setSelectedPlayers}
          />

          <CompareFilters
            metrics={metrics}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
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
        viewMode={viewMode}
      />

      <Footer />
    </>
  )
}