'use client'

import { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function LeaguePage() {
  useEffect(() => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn')
    const mobileMenu = document.getElementById('mobileMenu')

    mobileMenuBtn?.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden')
    })

    document.getElementById('footerYear').textContent = new Date().getFullYear()
  }, [])

  return (
    <>
      <Header current="League" />
      <main className="bg-gray-50 text-gray-800 py-8">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="bg-white rounded-lg shadow p-6 space-y-2">
            {[
              { href: 'league', label: 'League Overview', active: true },
              { href: 'league-standings', label: 'League Standings' },
              { href: 'teams', label: 'Teams' },
              { href: 'betting-book', label: 'Betting Book' },
              { href: 'stat-tracker', label: 'Stat Tracker' },
              { href: 'analytics-lab', label: 'Analytics Lab' },
              { href: 'injury-report-hub', label: 'Injury Report Hub' },
              { href: 'power-rankings', label: 'Power Rankings' },
              { href: 'schedule-results', label: 'Schedule & Results' },
              { href: 'league-news', label: 'League News' },
              { href: 'draft-hq', label: 'Draft HQ' },
              { href: 'media-vault', label: 'Media Vault' },
              { href: 'simulations', label: 'Simulations' },
            ].map(({ href, label, active }) => (
              <a
                key={href}
                href={`/${href}`}
                className={`flex items-center p-3 rounded-md ${
                  active
                    ? 'text-red-600 bg-gray-100'
                    : 'text-gray-800 hover:text-red-600 hover:bg-gray-100'
                }`}
              >
                <span>{label}</span>
              </a>
            ))}
          </aside>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-12">
            {/* Personalize */}
            <section className="bg-gray-100 p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Personalize Your Feed</h2>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">
                  Customize
                </button>
              </div>
              <p className="text-gray-600">
                Follow your favorite teams and players for a tailored experience.
              </p>
            </section>

            {/* Trending Topics */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-3xl font-bold mb-8">Trending Topics</h2>
              <p className="text-gray-600">News and league updates will appear here...</p>
            </section>

            {/* Season Snapshot */}
            <section className="bg-gray-100 p-6 rounded-lg shadow">
              <h2 className="text-3xl font-bold mb-8">Season Snapshot</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {['Upcoming Schedule', 'Live Scores/Final Results', 'Current Standings'].map(
                  (label, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-xl font-semibold mb-4">{label}</h3>
                      <p className="text-gray-600">Loading data...</p>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Stats Leaders */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-3xl font-bold mb-8">Key Statistics Leaders</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {['Passing Yards', 'Rushing Yards', 'Receiving Yards', 'Sacks'].map((stat, i) => (
                  <div key={i} className="bg-gray-100 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4">{stat}</h3>
                    <ul className="text-gray-700 space-y-1">
                      <li>Loading...</li>
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Betting Highlights */}
            <section className="bg-gray-100 p-6 rounded-lg shadow">
              <h2 className="text-3xl font-bold mb-8">Betting Odds Highlights</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4">Week 1 Key Games</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>Loading...</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4">Line Movements</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>Loading...</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Power Rankings */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-3xl font-bold mb-8">Power Rankings</h2>
              <ul className="text-gray-700 space-y-2">
                <li>1. Chiefs</li>
                <li>2. Eagles</li>
                <li>3. Bengals</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
