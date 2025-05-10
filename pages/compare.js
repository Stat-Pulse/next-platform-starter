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

  return (
    <>
      <Header />

      <main className="bg-gray-100 py-6">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Compare Players</h2>

          {/* DEBUG: show the current players state */}
          <pre className="bg-yellow-100 p-2 mb-4 text-sm text-red-600">
            🔍 DEBUG players = {JSON.stringify(players)}
          </pre>

          <CompareSearch
            selectedPlayers={players}
            onUpdate={setPlayers}
          />

          <CompareFilters
            metrics={metrics}
            onOpenCustomize={() => setIsModalOpen(true)}
            onSaveComparison={() => {
              const saved = JSON.parse(localStorage.getItem('savedComparisons') || '[]')
              saved.push({ players, metrics })
              localStorage.setItem('savedComparisons', JSON.stringify(saved))
              alert('Comparison saved!')
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

      <ComparisonSections
        players={players}
        metrics={metrics}
      />

      <Footer />
    </>
  )
}
