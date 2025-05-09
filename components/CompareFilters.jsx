// components/CompareFilters.jsx
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
