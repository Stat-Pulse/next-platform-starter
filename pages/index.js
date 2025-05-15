'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import SectionWrapper from '../components/SectionWrapper'
import Link from 'next/link'
import SearchBar from '../components/SearchBar'; 

export default function HomePage() {
  const games = [
    { id: 301, home_team: 'KC', away_team: 'BUF', status: 'upcoming', date_time: 'Sunday 8:20 PM ET' },
    { id: 302, home_team: 'PHI', away_team: 'DAL', status: 'live', date_time: 'Q2 10:15' },
    { id: 303, home_team: 'CIN', away_team: 'CLE', status: 'final', date_time: 'Final Score: 27-17' },
  ];

  const searchIndex = [
    { label: 'Patrick Mahomes', url: '/players/00-0031234' },
    { label: 'San Francisco 49ers', url: '/teams/SF' },
    { label: 'QB Leaders 2024', url: '/stats/qb-leaders' },
    { label: 'Settings', url: '/profile/settings' },
    { label: 'Subscribe to Premium', url: '/subscribe' },
    { label: 'Fantasy Compare Tool', url: '/compare' },
    { label: 'Referee Assignments', url: '/refs' }
  ];

  return (
    <>
      <Header />
    
      <header className="py-12 px-6 bg-gray-900 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to StatPulse</h1>
        <SearchBar data={searchIndex} />
      </header>

      {/* Hero Section */}
      <section className="relative bg-cover bg-center text-white py-20 px-6" style={{ backgroundImage: "url('/images/featured-game.jpg')" }}>
        <div className="bg-black bg-opacity-60 p-8 rounded-lg max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Chiefs vs Bills: Clash of the Titans</h1>
          <p className="mb-6">Sunday Night Football brings fireworks as Mahomes and Allen go head-to-head.</p>
          <Link href="/games/301" className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            View Game Details
          </Link>
        </div>
      </section>

      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-12">

          {/* Personalized Dashboard */}
          <SectionWrapper title="Your Dashboard">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Bengals Tracker</h3>
                <p className="text-sm text-gray-600">Next Game: vs CLE - Week 6</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Chase & Burrow Watch</h3>
                <p className="text-sm text-gray-600">Last Game: 2 TDs combined, 250 yds total</p>
              </div>
            </div>
          </SectionWrapper>

          {/* League News */}
          <SectionWrapper title="League Headlines">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { headline: "Burrow returns to practice", link: "/league-news" },
                { headline: "Cowboys dominate in MNF", link: "/league-news" },
                { headline: "NFL reveals int'l games", link: "/league-news" },
              ].map((news, idx) => (
                <div key={idx} className="bg-white p-4 rounded shadow">
                  <h4 className="text-md font-semibold text-gray-700 mb-1">{news.headline}</h4>
                  <Link href={news.link} className="text-red-600 text-sm hover:underline">Read More</Link>
                </div>
              ))}
            </div>
          </SectionWrapper>

          {/* Live & Upcoming Games */}
          <SectionWrapper title="Live & Upcoming Games">
            <div className="grid md:grid-cols-3 gap-6">
              {games.map((game, idx) => (
                <div key={idx} className="bg-white p-4 rounded shadow">
                  <h4 className="text-md font-semibold">{game.home_team} vs {game.away_team}</h4>
                  <p className="text-sm text-gray-600">
                    {game.status === 'live' ? 'LIVE' : game.status === 'final' ? 'Final' : game.date_time}
                  </p>
                  <Link href={`/game/${game.id}`} className="text-blue-600 text-sm hover:underline">Game Details</Link>
                </div>
              ))}
            </div>
          </SectionWrapper>

          {/* Top Performers */}
          <SectionWrapper title="Top Performers - Week 6">
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold mb-2">Passing Yards</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>Josh Allen - 356 yds</li>
                  <li>Patrick Mahomes - 342 yds</li>
                  <li>CJ Stroud - 330 yds</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold mb-2">Rushing Yards</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>Christian McCaffrey - 145 yds</li>
                  <li>Derrick Henry - 132 yds</li>
                  <li>Breece Hall - 128 yds</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold mb-2">Receiving Yards</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>Tyreek Hill - 175 yds</li>
                  <li>Stefon Diggs - 142 yds</li>
                  <li>Ja&apos;Marr Chase - 139 yds</li>
                </ul>
              </div>
            </div>
          </SectionWrapper>

          {/* Quick Access Links */}
          <SectionWrapper title="Quick Access">
            <div className="flex flex-wrap justify-around gap-4">
              {[
                { name: "Stat Tracker", link: "/player-stats" },
                { name: "Injuries Hub", link: "/injuries" },
                { name: "Draft HQ", link: "/draft" },
                { name: "Betting Book", link: "/betting-book" },
                { name: "Simulations", link: "/simulations" }
              ].map((item, i) => (
                <Link key={i} href={item.link} className="bg-blue-700 text-white py-3 px-6 rounded-lg shadow hover:bg-blue-800">
                  {item.name}
                </Link>
              ))}
            </div>
          </SectionWrapper>
        </div>
      </main>

      <Footer />
    </>
  )
}
