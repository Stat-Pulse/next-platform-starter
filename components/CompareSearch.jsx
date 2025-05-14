// File: components/CompareSearch.js

import { useState } from 'react'

export default function CompareSearch({ selectedPlayers, onUpdate }) {
  const [searchTerms, setSearchTerms] = useState(Array(selectedPlayers.length || 2).fill(''))

  const handleSearchChange = (index, value) => {
    const updatedTerms = [...searchTerms]
    updatedTerms[index] = value
    setSearchTerms(updatedTerms)
  }

  const handlePlayerSelect = (index, value) => {
    const updatedPlayers = [...selectedPlayers]
    updatedPlayers[index] = value
    onUpdate(updatedPlayers)
  }

  const addPlayerSlot = () => {
    if (selectedPlayers.length >= 6) return
    onUpdate([...selectedPlayers, null])
    setSearchTerms([...searchTerms, ''])
  }

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">Select Players to Compare</h3>
      {selectedPlayers.map((player, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder={`Search player #${index + 1}`}
            value={searchTerms[index] || ''}
            onChange={(e) => handleSearchChange(index, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          <button
            onClick={() => handlePlayerSelect(index, searchTerms[index])}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Select
          </button>
        </div>
      ))}

      {selectedPlayers.length < 6 && (
        <div className="text-right">
          <button
            onClick={addPlayerSlot}
            className="text-blue-600 text-sm hover:underline mt-2"
          >
            + Add Player
          </button>
        </div>
      )}
    </div>
  )
}