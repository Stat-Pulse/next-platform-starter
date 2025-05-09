// components/CompareSearch.jsx
import { useState, useEffect } from 'react'

/** 
 * Allows typing to search players, shows autocomplete suggestions,
 * and displays selected player chips with remove buttons.
 */
export default function CompareSearch({ selectedPlayers, onUpdate }) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [allPlayers, setAllPlayers] = useState([])

  // Load full player list once
  useEffect(() => {
    async function loadPlayers() {
      try {
        const res = await fetch('/api/players')
        if (!res.ok) throw new Error('Failed to load players')
        const data = await res.json()
        setAllPlayers(data)
      } catch (err) {
        console.error('CompareSearch load error:', err)
      }
    }
    loadPlayers()
  }, [])

  // Update suggestions whenever input changes
  useEffect(() => {
    if (input.length < 2) {
      setSuggestions([])
      return
    }
    const filtered = allPlayers.filter(p =>
      p.name.toLowerCase().includes(input.toLowerCase()) &&
      !selectedPlayers.includes(p.name)
    )
    setSuggestions(filtered.slice(0, 5))
  }, [input, allPlayers, selectedPlayers])

  const handleSelect = name => {
    if (selectedPlayers.length < 4) {
      onUpdate([...selectedPlayers, name])
    }
    setInput('')
    setSuggestions([])
  }

  const handleRemove = name => {
    onUpdate(selectedPlayers.filter(p => p !== name))
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Search players..."
          className="w-full p-2 border rounded-md"
        />
        {suggestions.length > 0 && (
          <div className="absolute w-full bg-white border rounded-md shadow z-10">
            {suggestions.map(player => (
              <div
                key={player.name}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(player.name)}
              >
                {player.name} ({player.position}, {player.team})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected player chips */}
      <div className="flex flex-wrap gap-2">
        {selectedPlayers.map(name => (
          <div key={name} className="bg-gray-200 p-2 rounded flex items-center">
            <span>{name}</span>
            <button
              onClick={() => handleRemove(name)}
              className="ml-2 text-red-600 hover:text-red-800"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
