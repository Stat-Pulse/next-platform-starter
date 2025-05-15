'use client'

import { useEffect, useState } from 'react'
import { FaCog } from 'react-icons/fa'
import Header from '../components/Header'
import Footer from '../components/Footer'

function logActivity(action) {
  const existing = JSON.parse(localStorage.getItem('activityLog') || '[]');
  const updated = [
    { action, timestamp: new Date().toISOString() },
    ...existing.slice(0, 9)
  ];
  localStorage.setItem('activityLog', JSON.stringify(updated));
}

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [activityLog, setActivityLog] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('userProfile')
    if (stored) {
      setUser(JSON.parse(stored))
    } else {
      setUser({
        username: "Jacob",
        avatar: "/images/default-avatar.png",
        email: "jacob@statpulse.com",
        favoriteTeams: ["BUF", "KC"],
        favoritePlayers: ["Josh Allen", "Travis Kelce"],
        points: 1320,
        badges: ["Veteran", "Insider"],
        leaderboardRank: 42,
        subscription: "Free"
      })
    }
  }, [])

  useEffect(() => {
    const storedLog = localStorage.getItem('activityLog');
    if (storedLog) {
      setActivityLog(JSON.parse(storedLog));
    }
  }, [showSettings])

  if (!user) {
    return (
      <>
        <Header />
        <main className="bg-gray-100 py-10 min-h-screen flex items-center justify-center text-gray-700">
          <p>Loading profile...</p>
        </main>
        <Footer />
      </>
    )
  }

  const {
    username,
    avatar,
    email,
    favoriteTeams,
    favoritePlayers,
    points,
    badges,
    leaderboardRank,
    subscription = 'Free'
  } = user

  const isPremium = subscription === 'Premium'

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-8 min-h-screen">
        <div className="container mx-auto px-4 space-y-10">

          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6">
            <div className="flex items-center gap-4">
              <img
                src={avatar || '/images/default-avatar.png'}
                alt="User Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-blue-500 shadow-md object-cover"
              />
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome, {username}!</h1>
                <p className="text-gray-600 text-sm sm:text-base">Subscription: <strong>{subscription}</strong></p>
                <p className="text-xs text-gray-500">
                  {subscription === 'Free' ? '🚫 Limited access' : '✅ Full access'}
                </p>
                {!isPremium && (
                  <div className="mt-2">
                    <button className="bg-yellow-400 text-gray-800 px-4 py-2 rounded hover:bg-yellow-300 text-sm font-semibold">
                      Upgrade to Premium
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => setShowSettings(true)} className="text-gray-700 hover:text-red-600">
              <FaCog size={24} />
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Activity Feed</h2>
            {activityLog.length === 0 ? (
              <p className="text-gray-500 text-sm">No activity recorded yet.</p>
            ) : (
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {activityLog.map((entry, idx) => (
                  <li key={idx}>
                    {entry.action} <span className="text-xs text-gray-400">({new Date(entry.timestamp).toLocaleString()})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {showSettings && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-lg shadow p-6 w-full max-w-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Manage Profile</h2>
                  <button onClick={() => setShowSettings(false)} className="text-red-600">✕</button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const updated = Object.fromEntries(new FormData(e.target))
                    const updatedProfile = { ...user, ...updated }
                    localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
                    setUser(updatedProfile)
                    setShowSettings(false)
                    logActivity('Updated profile information')
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Upload New Avatar</label>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (!file) return

                        const validTypes = ['image/jpeg', 'image/png', 'image/webp']
                        if (!validTypes.includes(file.type)) {
                          alert('❌ Only JPG, PNG, or WEBP images are allowed.')
                          return
                        }

                        if (file.size > 2 * 1024 * 1024) {
                          alert('❌ File size must be under 2MB.')
                          return
                        }

                        const reader = new FileReader()
                        reader.onloadend = () => {
                          const updatedProfile = { ...user, avatar: reader.result }
                          localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
                          setUser(updatedProfile)
                          logActivity('Updated avatar')
                        }
                        reader.readAsDataURL(file)
                      }}
                      className="w-full border p-2 rounded"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max 2MB. JPG, PNG, or WEBP only.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">New Password</label>
                    <input name="password" type="password" className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Data Options</label>
                    <select name="data_action" className="w-full border p-2 rounded">
                      <option value="none">Select...</option>
                      <option value="export">Export My Data</option>
                      <option value="delete">Request Account Deletion</option>
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
