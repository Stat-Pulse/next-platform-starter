'use client'

import { useEffect, useState } from 'react'
import { FaCog } from 'react-icons/fa'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

useEffect(() => {
  const stored = localStorage.getItem('userProfile')
  if (stored) {
    setUser(JSON.parse(stored))
  } else {
    // Temporary fallback user for testing at work
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

  if (!user) return null

  const { username, avatar, email, favoriteTeams, favoritePlayers, points, badges, leaderboardRank, subscription = 'Free' } = user

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Welcome + Avatar */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6">
            <div className="flex items-center gap-4">
              <img
                src={avatar || '/images/default-avatar.png'}
                alt="User Avatar"
                className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {username}!</h1>
                <p className="text-gray-600">Subscription: <strong>{subscription}</strong></p>
                <p className="text-sm text-gray-500">
                  {subscription === 'Free' ? '🚫 Limited access' : '✅ Full access'}
                </p>
              </div>
            </div>
            <button onClick={() => setShowSettings(true)} className="text-gray-700 hover:text-red-600">
              <FaCog size={24} />
            </button>
          </div>

          {/* Personalized Content Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">Fantasy Hub</h2>
              {favoritePlayers.map(p => (
                <p key={p} className="text-gray-600">{p}: 12.4 PPR · Waiver value high</p>
              ))}
              <p className="text-sm text-blue-600 mt-2">More fantasy insights →</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">Betting Center</h2>
              {favoriteTeams.map(team => (
                <p key={team} className="text-gray-600">{team} -2.5 vs Opponent · Line shifted</p>
              ))}
              <p className="text-sm text-blue-600 mt-2">View betting trends →</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">News & Analysis</h2>
              {favoriteTeams.map(team => (
                <p key={team} className="text-gray-600">Breaking: {team} star player injured (Week 7)</p>
              ))}
              <p className="text-sm text-blue-600 mt-2">View full news feed →</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">Community Forum</h2>
              <p className="text-gray-600">New comment on &quot;Is Burrow top 3?&quot; thread.</p>
              <p className="text-sm text-blue-600 mt-2">View forums →</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">Personalized Insights</h2>
              <p className="text-gray-600">Your team {favoriteTeams[0]} has a +EPA advantage vs opponent.</p>
              <p className="text-gray-600">{favoritePlayers[0]} projected to exceed 17.3 PPR in Week 8.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">Activity Feed</h2>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>Viewed player profile: Ja&rsquo;Marr Chase</li>
                <li>Simulated: Week 6 matchup</li>
                <li>Saved: Chiefs vs Bills recap</li>
              </ul>
            </div>
          </div>

          {/* Saved Content / Followed Entities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">Saved Content</h2>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>Player Comparison: Allen vs Mahomes</li>
                <li>Article: Fantasy Sleepers Week 10</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">Followed Entities</h2>
              <p className="text-gray-600">Teams: {favoriteTeams.join(', ')}</p>
              <p className="text-gray-600">Players: {favoritePlayers.join(', ')}</p>
            </div>
          </div>

          {/* Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">Points</h2>
              <p className="text-gray-600">{points} Points</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">Badges</h2>
              <div className="flex flex-wrap gap-2">
                {badges.map(badge => (
                  <span key={badge} className="bg-red-600 text-white text-xs px-2 py-1 rounded">{badge}</span>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-xl font-semibold mb-2">Leaderboard</h2>
              <p className="text-gray-600">Rank #{leaderboardRank}</p>
            </div>
          </div>

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Username</label>
                    <input name="username" defaultValue={username} className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <input name="email" defaultValue={email} type="email" className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Upload New Avatar</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const updatedProfile = { ...user, avatar: reader.result };
                            localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                            setUser(updatedProfile);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full border p-2 rounded"
                    />
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
                    <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Save Changes</button>
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
