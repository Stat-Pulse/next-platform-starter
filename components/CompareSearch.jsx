// components/CompareSearch.jsx
import { useState, useEffect } from 'react'

export default function CompareSearch({ selectedPlayers, onUpdate }) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [allPlayers, setAllPlayers] = useState([])

  useEffect(() => {
    async function loadPlayers() {
      try {
        const res = await fetch('/api/players')
        if (!res.ok) throw new Error('Failed to load players')
        setAllPlayers(await res.json())
      } catch (err) {
        console.error(err)
      }
    }
    loadPlayers()
  }, [])

  useEffect(() => {
    if (input.length < 2) return setSuggestions([])
    const filtered = allPlayers
      .filter(p => p.name.toLowerCase().includes(input.toLowerCase()) && !selectedPlayers.includes(p.name))
      .slice(0,5)
    setSuggestions(filtered)
  }, [input, allPlayers, selectedPlayers])

  const handleSelect = name => {
    if (selectedPlayers.length < 4) onUpdate([...selectedPlayers, name])
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
            {suggestions.map(p => (
              <div
                key={p.name}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(p.name)}
              >
                {p.name} ({p.position}, {p.team})
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedPlayers.map(name => (
          <div key={name} className="bg-gray-200 p-2 rounded flex items-center">
            <span>{name}</span>
            <button
              onClick={() => handleRemove(name)}
              className="ml-2 text-red-600 hover:text-red-800"
            >X</button>
          </div>
        ))}
      </div>
    </div>
)
}
