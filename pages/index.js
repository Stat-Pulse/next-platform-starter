'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import SectionWrapper from '../components/SectionWrapper'

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-12">

          <SectionWrapper title="Welcome to Gridiron Central">
            <p className="text-gray-600">
              Your one-stop destination for everything NFL: standings, news, teams, stats, fantasy, and more.
            </p>
          </SectionWrapper>

          <SectionWrapper title="Navigate the League">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Explore Teams</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Dive into individual team profiles, rosters, schedules, and more.
                </p>
                <a href="/teams" className="text-red-600 hover:underline text-sm">View All Teams</a>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Track the Standings</h3>
                <p className="text-sm text-gray-600 mb-2">
                  See how your favorite team stacks up across the league.
                </p>
                <a href="/league-standings" className="text-red-600 hover:underline text-sm">Go to Standings</a>
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper title="Latest League News">
            <div className="bg-white p-4 rounded shadow">
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="/league-news" className="text-red-600 hover:underline">Burrow returns to practice, cleared for Week 6</a></li>
                <li><a href="/league-news" className="text-red-600 hover:underline">Cowboys defense dominates in MNF victory</a></li>
                <li><a href="/league-news" className="text-red-600 hover:underline">NFL announces international games lineup</a></li>
              </ul>
            </div>
          </SectionWrapper>

          <SectionWrapper title="Featured Content">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold text-gray-700 mb-2">Fantasy Football Insights</h4>
                <p className="text-sm text-gray-600 mb-2">Tips, trade value, sleepers and weekly projections.</p>
                <a href="/fantasy" className="text-red-600 hover:underline text-sm">Access Fantasy Tools</a>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold text-gray-700 mb-2">Betting Book</h4>
                <p className="text-sm text-gray-600 mb-2">Odds, line movements, and game predictions.</p>
                <a href="/betting-book" className="text-red-600 hover:underline text-sm">View Odds</a>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold text-gray-700 mb-2">Simulations</h4>
                <p className="text-sm text-gray-600 mb-2">Explore playoff projections and game outcomes.</p>
                <a href="/simulations" className="text-red-600 hover:underline text-sm">Simulate Now</a>
              </div>
            </div>
          </SectionWrapper>

        </div>
      </main>

      <Footer />
    </>
  )
}
