// components/Personalization.jsx
import { useState, useEffect } from 'react'
import Modal from './Modal'

export default function Personalization({ onPreferencesChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [teams, setTeams] = useState([])
  const [players, setPlayers] = useState([])
  const [contentTypes, setContentTypes] = useState({
    news: true,
    analysis: true,
    videos: true,
    podcasts: false,
  })

  // Load saved preferences
  useEffect(() => {
    const prefs = JSON.parse(localStorage.getItem('feedPreferences') || '{}')
    setTeams(prefs.teams || [])
    setPlayers(prefs.players || [])
    setContentTypes({
      news: prefs.contentTypes?.includes('news'),
      analysis: prefs.contentTypes?.includes('analysis'),
      videos: prefs.contentTypes?.includes('videos'),
      podcasts: prefs.contentTypes?.includes('podcasts'),
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const selectedContent = Object.keys(contentTypes).filter((type) => contentTypes[type])
    const preferences = { teams, players, contentTypes: selectedContent }
    localStorage.setItem('feedPreferences', JSON.stringify(preferences))
    if (onPreferencesChange) onPreferencesChange(preferences)
    setIsModalOpen(false)
  }

  return (
    <section className="py-6 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Personalize Your Feed</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
          >
            Customize
          </button>
        </div>
        <p className="text-gray-600">Follow your favorite teams and players for a tailored experience.</p>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-semibold mb-4">Customize Feed</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Favorite Teams</span>
              <select
                multiple
                value={teams}
                onChange={(e) =>
                  setTeams(Array.from(e.target.selectedOptions).map((o) => o.value))
                }
                className="w-full p-2 border rounded"
              >
                <option value="Bengals">Cincinnati Bengals</option>
                <option value="Chiefs">Kansas City Chiefs</option>
                <option value="Eagles">Philadelphia Eagles</option>
              </select>
            </label>

            <label className="block">
              <span className="text-gray-700">Favorite Players</span>
              <select
                multiple
                value={players}
                onChange={(e) =>
                  setPlayers(Array.from(e.target.selectedOptions).map((o) => o.value))
                }
                className="w-full p-2 border rounded"
              >
                <option value="Joe Burrow">Joe Burrow</option>
                <option value="Patrick Mahomes">Patrick Mahomes</option>
                <option value="Josh Allen">Josh Allen</option>
              </select>
            </label>

            <div>
              <span className="text-gray-700 block mb-2">Content Types</span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(contentTypes).map((type) => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={contentTypes[type]}
                      onChange={() =>
                        setContentTypes({
                          ...contentTypes,
                          [type]: !contentTypes[type],
                        })
                      }
                      className="mr-2"
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
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
    </section>
  )
}
