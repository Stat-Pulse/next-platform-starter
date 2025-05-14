// File: components/CompareSearch.js

import { useEffect, useState } from 'react'

export default function CompareSearch({ selectedPlayers, onUpdate }) {
  const [searchTerms, setSearchTerms] = useState(Array(selectedPlayers.length || 2).fill(''))
  const [playerOptions, setPlayerOptions] = useState([])

  useEffect(() => {
    fetch('/.netlify/functions/getPlayers')
      .then(res => res.json())
      .then(data => setPlayerOptions(data))
      .catch(err => console.error('Failed to load player list', err))
  }, [])

  const handleSearchChange = (index, value) => {
    const updatedTerms = [...searchTerms]
    updatedTerms[index] = value
    setSearchTerms(updatedTerms)
  }

  const handlePlayerSelect = (index, playerId) => {
    const updatedPlayers = [...selectedPlayers]
    updatedPlayers[index] = playerId
    onUpdate(updatedPlayers)
  }

  const addPlayerSlot = () => {
    if (selectedPlayers.length >= 6) return
    onUpdate([...selectedPlayers, null])
    setSearchTerms([...searchTerms, ''])
  }

  const filteredOptions = (term) => {
    return playerOptions.filter(p =>
      p.player_name.toLowerCase().includes(term.toLowerCase())
    ).slice(0, 5)
  }

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">Select Players to Compare</h3>
      {selectedPlayers.map((playerId, index) => (
        <div key={index} className="space-y-1">
          <input
            type="text"
            placeholder={`Search player #${index + 1}`}
            value={searchTerms[index] || ''}
            onChange={(e) => handleSearchChange(index, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {searchTerms[index] && (
            <ul className="bg-white border rounded shadow-sm max-h-40 overflow-y-auto text-sm">
              {filteredOptions(searchTerms[index]).map((p) => (
                <li
                  key={p.player_id}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                  onClick={() => handlePlayerSelect(index, p.player_id)}
                >
                  {p.player_name} <span className="text-gray-400">({p.position} - {p.team})</span>
                </li>
              ))}
            </ul>
          )}
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
