//pges/user-profile

'use client'

import { useEffect, useState } from 'react'
import { FaCog, FaStar, FaTrophy, FaChartLine, FaTable } from 'react-icons/fa' // Added more icons for visual richness

// Helper to format activity timestamps
const formatRelativeTime = (isoString) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);

  if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
  if (diffSeconds < 3600) return `${Math.round(diffSeconds / 60)} minutes ago`;
  if (diffSeconds < 86400) return `${Math.round(diffSeconds / 3600)} hours ago`;
  if (diffSeconds < 604800) return `${Math.round(diffSeconds / 86400)} days ago`;
  return date.toLocaleDateString(); // Fallback for older entries
};

function logActivity(action) {
  const existing = JSON.parse(localStorage.getItem('activityLog') || '[]');
  const updated = [
    { action, timestamp: new Date().toISOString() },
    ...existing.slice(0, 9) // Keep last 10 activities
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
        favoriteTeams: ["Buffalo Bills", "Kansas City Chiefs"],
        favoritePlayers: ["Josh Allen", "Travis Kelce", "Patrick Mahomes"],
        points: 1320,
        badges: ["Veteran Analyst", "Insider Scout", "Prediction Master"],
        leaderboardRank: 42,
        subscription: "Premium",
        accuracyRate: 78,
        engagementScore: 85,
        gamesAnalyzed: 154,
      })
    }
  }, [])

  useEffect(() => {
    const storedLog = localStorage.getItem('activityLog');
    if (storedLog) {
      setActivityLog(JSON.parse(storedLog));
    }
    if (!showSettings) {
      const currentLog = JSON.parse(localStorage.getItem('activityLog') || '[]');
      setActivityLog(currentLog);
    }
  }, [showSettings])

  // Safely extract user properties to avoid destructuring from null
  const username = user?.username ?? null;
  const avatar = user?.avatar ?? '/images/default-avatar.png';
  const email = user?.email ?? null;
  const favoriteTeams = user?.favoriteTeams ?? [];
  const favoritePlayers = user?.favoritePlayers ?? [];
  const points = user?.points ?? 0;
  const badges = user?.badges ?? [];
  const leaderboardRank = user?.leaderboardRank ?? null;
  const subscription = user?.subscription ?? 'Free';
  const accuracyRate = user?.accuracyRate ?? 0;
  const engagementScore = user?.engagementScore ?? 0;
  const gamesAnalyzed = user?.gamesAnalyzed ?? 0;

  const isPremium = subscription === 'Premium'

  const colors = {
    primaryRed: '#FF4136',
    darkBackground: '#1A1A1D',
    mediumBackground: '#2C2C30',
    lightText: '#E0E0E0',
    grayText: '#A0A0A0',
    accentBlue: '#00BFFF',
    warningYellow: '#FFDC00',
  };

  const dummyChartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  return (
    <>
      <main className={`py-10 min-h-screen text-[${colors.lightText}] font-sans bg-gradient-to-br from-[${colors.primaryRed}/10] via-[${colors.darkBackground}] to-[${colors.darkBackground}]`}>
        <div className="container mx-auto px-4 space-y-12">
          <section className={`relative bg-[${colors.mediumBackground}] p-8 rounded-3xl shadow-xl overflow-hidden
                              flex flex-col sm:flex-row items-center sm:items-start gap-8 border border-[${colors.mediumBackground}]
                              hover:border-[${colors.primaryRed}] transition-all duration-300 ease-in-out`}>
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,65,54,0.05)] to-transparent opacity-75 z-0"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[${colors.primaryRed}] rounded-full opacity-10 blur-xl z-0"></div>

            <div className="relative z-10 flex flex-col items-center sm:items-start">
              <div className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden
                                border-4 border-[${colors.primaryRed}] shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out`}>
                <img
                  src={avatar || '/images/default-avatar.png'}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 rounded-full border-4 border-transparent animate-pulse-border`}
                     style={{
                       '--color-pulse': colors.primaryRed,
                       '--duration-pulse': '2s',
                       '--timing-pulse': 'ease-in-out'
                     }}></div>
              </div>
              <div className="mt-4 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[${colors.lightText}] tracking-tight">
                  Welcome, <span className="text-[${colors.primaryRed}]">{username}</span>!
                </h1>
                <p className={`text-lg text-[${colors.grayText}] mt-1`}>
                  Subscription: <strong className={isPremium ? `text-[${colors.accentBlue}]` : `text-[${colors.warningYellow}]`}>{subscription}</strong>
                </p>
                {!isPremium && (
                  <div className="mt-4">
                    <button className={`bg-[${colors.warningYellow}] text-[${colors.darkBackground}] px-6 py-3 rounded-full font-bold
                                        hover:bg-yellow-300 transition-colors duration-300 transform hover:scale-105 shadow-lg`}>
                      Upgrade to Premium <FaStar className="inline-block ml-2 -mt-0.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 sm:mt-0 sm:ml-auto w-full sm:w-auto">
              <div className={`bg-[${colors.darkBackground}] p-5 rounded-xl shadow-md text-center group
                                border border-[${colors.darkBackground}] hover:border-[${colors.accentBlue}] transition-all duration-300`}>
                <FaTrophy className={`text-4xl mx-auto mb-2 text-[${colors.primaryRed}] group-hover:text-[${colors.accentBlue}] transition-colors`} />
                <p className={`text-2xl font-bold text-[${colors.lightText}]`}>{points}</p>
                <p className={`text-sm text-[${colors.grayText}]`}>Total Points</p>
              </div>
              <div className={`bg-[${colors.darkBackground}] p-5 rounded-xl shadow-md text-center group
                                border border-[${colors.darkBackground}] hover:border-[${colors.accentBlue}] transition-all duration-300`}>
                <FaTrophy className={`text-4xl mx-auto mb-2 text-[${colors.primaryRed}] group-hover:text-[${colors.accentBlue}] transition-colors`} />
                <p className={`text-2xl font-bold text-[${colors.lightText}]`}>#{leaderboardRank}</p>
                <p className={`text-sm text-[${colors.grayText}]`}>Leaderboard Rank</p>
              </div>
              <div className={`bg-[${colors.darkBackground}] p-5 rounded-xl shadow-md text-center group
                                relative border border-[${colors.darkBackground}] hover:border-[${colors.accentBlue}] transition-all duration-300`}>
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      className={`text-[${colors.grayText}] opacity-30`}
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                      r="25"
                      cx="32"
                      cy="32"
                    />
                    <circle
                      className="text-[${colors.primaryRed}] transition-all duration-700 ease-out"
                      strokeWidth="6"
                      strokeDasharray={2 * Math.PI * 25}
                      strokeDashoffset={2 * Math.PI * 25 - (2 * Math.PI * 25 * (accuracyRate / 100))}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="25"
                      cx="32"
                      cy="32"
                    />
                  </svg>
                  <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-[${colors.lightText}]`}>
                    {accuracyRate}%
                  </span>
                </div>
                <p className={`text-sm text-[${colors.grayText}]`}>Accuracy Rate</p>
              </div>
            </div>

            {/* Moved settings button to top right of the stats section */}
            <button
              onClick={() => setShowSettings(true)}
              className={`absolute top-5 right-5 text-[${colors.grayText}] hover:text-[${colors.primaryRed}] transition-colors duration-300
                          p-3 rounded-full bg-[${colors.darkBackground}] hover:bg-opacity-80 shadow-lg z-10`}>
              <FaCog size={24} />
            </button>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <section className={`bg-[${colors.mediumBackground}] p-6 rounded-2xl shadow-lg border border-[${colors.mediumBackground}]
                                  hover:border-[${colors.primaryRed}] transition-all duration-300`}>
                <h2 className={`text-2xl font-bold mb-4 text-[${colors.lightText}]`}>My Favorites <FaStar className="inline-block ml-2 text-[${colors.warningYellow}]" /></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 text-[${colors.grayText}]`}>Teams:</h3>
                    {favoriteTeams.length > 0 ? (
                      <ul className="space-y-2">
                        {favoriteTeams.map((team, idx) => (
                          <li key={idx} className={`flex items-center text-[${colors.lightText}] text-base`}>
                            <span className="w-2 h-2 rounded-full bg-[${colors.primaryRed}] mr-3 animate-pulse-mini"></span> {team}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-sm text-[${colors.grayText}]`}>No favorite teams added.</p>
                    )}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 text-[${colors.grayText}]`}>Players:</h3>
                    {favoritePlayers.length > 0 ? (
                      <ul className="space-y-2">
                        {favoritePlayers.map((player, idx) => (
                          <li key={idx} className={`flex items-center text-[${colors.lightText}] text-base`}>
                            <span className="w-2 h-2 rounded-full bg-[${colors.primaryRed}] mr-3 animate-pulse-mini"></span> {player}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-sm text-[${colors.grayText}]`}>No favorite players added.</p>
                    )}
                  </div>
                </div>
              </section>

              <section className={`bg-[${colors.mediumBackground}] p-6 rounded-2xl shadow-lg border border-[${colors.mediumBackground}]
                                  hover:border-[${colors.primaryRed}] transition-all duration-300`}>
                <h2 className={`text-2xl font-bold mb-4 text-[${colors.lightText}]`}>Badges <FaTrophy className="inline-block ml-2 text-[${colors.primaryRed}]" /></h2>
                {badges.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {badges.map((badge, idx) => (
                      <span key={idx} className={`bg-[${colors.darkBackground}] text-[${colors.primaryRed}] px-4 py-2 rounded-full text-sm font-semibold
                                                  flex items-center border border-[${colors.primaryRed}]
                                                  transition-all duration-200 hover:scale-105 hover:bg-opacity-80 shadow-md`}>
                        <FaStar className="inline-block mr-2 text-[${colors.warningYellow}]" /> {badge}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className={`text-sm text-[${colors.grayText}]`}>No badges earned yet. Keep exploring!</p>
                )}
              </section>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <section className={`bg-[${colors.mediumBackground}] p-6 rounded-2xl shadow-lg border border-[${colors.mediumBackground}]
                                  hover:border-[${colors.primaryRed}] transition-all duration-300`}>
                <h2 className={`text-2xl font-bold mb-4 text-[${colors.lightText}]`}>Performance Overview <FaChartLine className="inline-block ml-2 text-[${colors.accentBlue}]" /></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`bg-[${colors.darkBackground}] p-4 rounded-xl border border-[${colors.darkBackground}] hover:border-[${colors.accentBlue}] transition-colors`}>
                    <h3 className={`text-lg font-semibold mb-2 text-[${colors.lightText}]`}>Accuracy Trend (Last 6 Months)</h3>
                    <div className="h-48 flex items-center justify-center border border-dashed border-[${colors.grayText}] rounded-lg text-[${colors.grayText}] text-sm">
                      <p>
                        <FaChartLine className="inline-block text-2xl mr-2 text-[${colors.accentBlue}]" />
                        Chart Placeholder (e.g., Recharts Line Chart)
                      </p>
                    </div>
                  </div>

                  <div className={`bg-[${colors.darkBackground}] p-4 rounded-xl border border-[${colors.darkBackground}] hover:border-[${colors.accentBlue}] transition-colors`}>
                    <h3 className={`text-lg font-semibold mb-2 text-[${colors.lightText}]`}>Engagement Score</h3>
                    <div className="h-48 flex items-center justify-center border border-dashed border-[${colors.grayText}] rounded-lg text-[${colors.grayText}] text-sm">
                      <p>
                        <FaChartLine className="inline-block text-2xl mr-2 text-[${colors.accentBlue}]" />
                        Chart Placeholder (e.g., Recharts Bar Chart or Radial Chart)
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`mt-6 text-center text-[${colors.grayText}]`}>
                  <p className="text-sm">More detailed analytics and comparisons available in the <a href="/analytics" className={`text-[${colors.primaryRed}] hover:underline`}>Analytics Dashboard</a>.</p>
                </div>
              </section>

              <section className={`bg-[${colors.mediumBackground}] p-6 rounded-2xl shadow-lg border border-[${colors.mediumBackground}]
                                  hover:border-[${colors.primaryRed}] transition-all duration-300`}>
                <h2 className={`text-2xl font-bold mb-4 text-[${colors.lightText}]`}>Recent Activity <FaTable className="inline-block ml-2 text-[${colors.primaryRed}]" /></h2>
                {activityLog.length === 0 ? (
                  <p className={`text-[${colors.grayText}] text-base`}>No activity recorded yet. Start exploring StatPulse!</p>
                ) : (
                  <ul className={`space-y-3 text-[${colors.lightText}]`}>
                    {activityLog.map((entry, idx) => (
                      <li key={idx} className={`flex items-start bg-[${colors.darkBackground}] p-3 rounded-lg shadow-sm
                                                border border-[${colors.darkBackground}] hover:border-[${colors.primaryRed}]
                                                transition-all duration-200`}>
                        <span className="w-2 h-2 rounded-full bg-[${colors.accentBlue}] mr-3 mt-1.5 animate-ping-once"></span>
                        <div>
                          <p className="text-base">{entry.action}</p>
                          <p className={`text-xs text-[${colors.grayText}] mt-0.5`}>
                            {formatRelativeTime(entry.timestamp)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>

          {showSettings && (
            <div className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in`}>
              <div className={`bg-[${colors.mediumBackground}] rounded-3xl shadow-2xl p-8 w-full max-w-2xl
                               border border-[${colors.primaryRed}] transform scale-95 animate-scale-in`}>
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                  <h2 className={`text-3xl font-bold text-[${colors.lightText}]`}>Manage Profile <FaCog className="inline-block ml-3 text-[${colors.accentBlue}]" /></h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className={`text-[${colors.grayText}] hover:text-[${colors.primaryRed}] transition-colors duration-300
                                text-3xl font-light leading-none`}>
                    ×
                  </button>
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = new FormData(e.target);
                    const updated = Object.fromEntries(form);
                    const updatedProfile = { ...user, ...updated };

                    updatedProfile.favoriteTeams = user.favoriteTeams;
                    updatedProfile.favoritePlayers = user.favoritePlayers;
                    updatedProfile.points = user.points;
                    updatedProfile.badges = user.badges;
                    updatedProfile.leaderboardRank = user.leaderboardRank;
                    updatedProfile.subscription = user.subscription;
                    updatedProfile.avatar = user.avatar;

                    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                    setUser(updatedProfile);
                    setShowSettings(false);

                    logActivity(`Updated profile settings`);

                    try {
                      const res = await fetch('/.netlify/functions/saveProfile', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedProfile),
                      });

                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || 'Failed to save profile remotely');
                      console.log('✅ Synced to DB:', data);
                    } catch (err) {
                      console.error('❌ Remote sync failed:', err.message);
                      alert('Profile saved locally, but remote sync failed.');
                    }
                  }}
                  className="space-y-6"
                >
                  <div>
                    <label className={`block text-sm font-medium text-[${colors.grayText}] mb-2`}>Upload New Avatar</label>
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
                      className={`w-full p-3 rounded-lg bg-[${colors.darkBackground}] border border-[${colors.grayText}]
                                  text-[${colors.lightText}] file:mr-4 file:py-2 file:px-4 file:rounded-full
                                  file:border-0 file:text-sm file:font-semibold file:bg-[${colors.primaryRed}] file:text-white
                                  hover:file:bg-red-700 transition-colors cursor-pointer`}
                    />
                    <p className={`text-xs text-[${colors.grayText}] mt-2`}>Max 2MB. JPG, PNG, or WEBP only.</p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium text-[${colors.grayText}] mb-2`}>New Password</label>
                    <input name="password" type="password"
                           className={`w-full p-3 rounded-lg bg-[${colors.darkBackground}] border border-[${colors.grayText}]
                                       focus:border-[${colors.primaryRed}] focus:ring-1 focus:ring-[${colors.primaryRed}]
                                       text-[${colors.lightText}] outline-none transition-all duration-200`}
                           placeholder="Enter new password (optional)" />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium text-[${colors.grayText}] mb-2`}>Data Options</label>
                    <select name="data_action"
                            className={`w-full p-3 rounded-lg bg-[${colors.darkBackground}] border border-[${colors.grayText}]
                                        focus:border-[${colors.primaryRed}] focus:ring-1 focus:ring-[${colors.primaryRed}]
                                        text-[${colors.lightText}] outline-none transition-all duration-200`}>
                      <option value="none">Select an action...</option>
                      <option value="export">Export My Data</option>
                      <option value="delete">Request Account Deletion</option>
                    </select>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-gray-700">
                    <button type="submit"
                            className={`bg-[${colors.primaryRed}] text-white px-6 py-3 rounded-full font-bold
                                        hover:bg-red-700 transition-colors duration-300 transform hover:scale-105 shadow-lg`}>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
