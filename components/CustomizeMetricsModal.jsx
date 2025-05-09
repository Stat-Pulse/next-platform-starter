// components/CustomizeMetricsModal.jsx
import React, { useState, useEffect } from 'react'
import Modal from './Modal'

/**
 * Modal allowing users to select which metrics to display in the comparison
 */
export default function CustomizeMetricsModal({ isOpen, metrics, onChange, onClose }) {
  const [selectedMetrics, setSelectedMetrics] = useState(metrics)
  const allMetrics = [
    { value: 'fantasyPoints', label: 'Fantasy Points' },
    { value: 'propSuccess', label: 'Prop Success Rates' },
    { value: 'efficiency', label: 'Efficiency Metrics' },
    { value: 'advancedMetrics', label: 'Advanced Metrics' },
    { value: 'matchup', label: 'Matchup Analysis' }
  ]

  useEffect(() => {
    setSelectedMetrics(metrics)
  }, [metrics, isOpen])

  const toggleMetric = (value) => {
    setSelectedMetrics(prev =>
      prev.includes(value) ? prev.filter(m => m !== value) : [...prev, value]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onChange(selectedMetrics)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-semibold">Customize Metrics</h3>
        <form onSubmit={handleSubmit} className="space-y-2">
          {allMetrics.map(metric => (
            <label key={metric.value} className="flex items-center">
              <input
                type="checkbox"
                value={metric.value}
                checked={selectedMetrics.includes(metric.value)}
                onChange={() => toggleMetric(metric.value)}
                className="mr-2"
              />
              <span>{metric.label}</span>
            </label>
          ))}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}// components/CompareFilters.jsx
import React from 'react'

/**
 * Renders position & team filters, metric profile select,
 * and buttons for customizing metrics & saving comparison.
 */
export default function CompareFilters({ metrics, onOpenCustomize, onSaveComparison }) {
  const positionOptions = ['all', 'QB', 'RB', 'WR', 'TE', 'K', 'DEF']
  const teamOptions = ['all', 'Bengals', 'Eagles', 'Chiefs', /* add more teams */]
  const metricProfiles = [
    { value: 'standardFantasy', label: 'Standard Fantasy' },
    { value: 'pprFantasy', label: 'PPR Fantasy' },
    { value: 'passingProps', label: 'Passing Props' },
    { value: 'rushingProps', label: 'Rushing Props' },
    { value: 'receivingProps', label: 'Receiving Props' },
    { value: 'custom', label: 'Custom' }
  ]

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex space-x-2">
        <select id="positionFilter" className="p-2 border rounded-md">
          {positionOptions.map(pos => (
            <option key={pos} value={pos}>{pos === 'all' ? 'All Positions' : pos}</option>
          ))}
        </select>
        <select id="teamFilter" className="p-2 border rounded-md">
          {teamOptions.map(team => (
            <option key={team} value={team}>{team === 'all' ? 'All Teams' : team}</option>
          ))}
        </select>
      </div>
      <div className="flex space-x-2 items-center">
        <select
          id="metricProfile"
          className="p-2 border rounded-md"
          value={metrics[0]}
          onChange={(e) => console.log('Profile changed:', e.target.value)} // We'll wire this up later
        >
          {metricProfiles.map(profile => (
            <option key={profile.value} value={profile.value}>{profile.label}</option>
          ))}
        </select>
        <button
          onClick={onOpenCustomize}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
        >
          Customize Metrics
        </button>
      </div>
      <button
        onClick={onSaveComparison}
        className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700"
      >
        Save Comparison
      </button>
    </div>
  )
}
