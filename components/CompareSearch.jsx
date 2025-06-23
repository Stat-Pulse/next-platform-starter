// File: components/CompareSearch.js

import { useEffect, useState } from 'react'

export default function CompareSearch({ selectedPlayers, onUpdate }) {
  const [searchTerms, setSearchTerms] = useState(Array(selectedPlayers.length || 2).fill(''))
  const [playerOptions, setPlayerOptions] = useState([])
  const [teamOptions, setTeamOptions] = useState([])
  const [mode, setMode] = useState('players') // Toggle between 'players' and 'teams'
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const endpoint = mode === 'players' ? '/api/getPlayers' : '/api/getTeams'
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        if (mode === 'players') setPlayerOptions(data)
        else setTeamOptions(data)
      })
      .catch(err => console.error(`Failed to load ${mode} list`, err))
      .finally(() => setLoading(false))
  }, [mode])

  const handleSearchChange = (index, value) => {
    const updatedTerms = [...searchTerms]
    updatedTerms[index] = value
    setSearchTerms(updatedTerms)
  }

  const handleSelect = (index, id) => {
    const updatedPlayers = [...selectedPlayers]
    updatedPlayers[index] = id
    onUpdate(updatedPlayers, mode) // Pass mode to parent
  }

  const addSlot = () => {
    if (selectedPlayers.length >= 6) return
    onUpdate([...selectedPlayers, null], mode)
    setSearchTerms([...searchTerms, ''])
  }

  const filteredOptions = (term) => {
    const options = Array.isArray(mode === 'players' ? playerOptions : teamOptions)
      ? (mode === 'players' ? playerOptions : teamOptions)
      : []
    return options
      .filter(item =>
        (mode === 'players' ? item.player_name : item.team_name)
          ?.toLowerCase()
          .includes(term.toLowerCase())
      )
      .slice(0, 5)
  }

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-700">
          Select {mode === 'players' ? 'Players' : 'Teams'} to Compare
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('players')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              mode === 'players' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Players
          </button>
          <button
            onClick={() => setMode('teams')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              mode === 'teams' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Teams
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading options...</p>
      ) : (
        <>
          {selectedPlayers.map((id, index) => (
            <div key={index} className="space-y-1">
              <input
                type="text"
                placeholder={`Search ${mode === 'players' ? 'player' : 'team'} #${index + 1}`}
                value={searchTerms[index] || ''}
                onChange={(e) => handleSearchChange(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
              {searchTerms[index] && (
                <ul className="bg-white border rounded shadow-sm max-h-40 overflow-y-auto text-sm">
                  {filteredOptions(searchTerms[index]).map((item) => (
                    <li
                      key={item.player_id || item.team_id}
                      className="px-3 py-2 hover:bg-red-50 cursor-pointer"
                      onClick={() => handleSelect(index, item.player_id || item.team_id)}
                    >
                      {mode === 'players' ? (
                        <>
                          {item.player_name}{' '}
                          <span className="text-gray-400">
                            ({item.position} - {item.team})
                          </span>
                        </>
                      ) : (
                        item.team_name
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {selectedPlayers.length < 6 && (
            <div className="text-right">
              <button
                onClick={addSlot}
                className="text-red-600 text-sm hover:underline mt-2"
              >
                + Add {mode === 'players' ? 'Player' : 'Team'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
