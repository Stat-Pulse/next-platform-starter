// pages/fantasy/index.js
'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionWrapper from '@/components/SectionWrapper'
import Link from 'next/link'

export default function FantasyDashboard() {
  const games = [
    { id: 301, home_team: 'KC', away_team: 'BUF', status: 'upcoming', date_time: 'Sunday 8:20 PM ET' },
    { id: 302, home_team: 'PHI', away_team: 'DAL', status: 'live',     date_time: 'Q2 10:15' },
    { id: 303, home_team: 'CIN', away_team: 'CLE', status: 'final',    date_time: 'Final Score: 27-17' },
  ]

  return (
    <>
      <Header />

      {/* Fantasy Hero / Dashboard Intro */}
      <section className="bg-gray-100 py-12 px-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome to StatPulse Fantasy</h1>
        <p className="text-gray-700">Manage your team, view matchups, and track league standings all in one place.</p>
      </section>

      <SectionWrapper title="Current Matchup">
        <Link href="/fantasy/current-matchup">
          <a className="text-blue-600 hover:underline">View Today’s Matchup →</a>
        </Link>
      </SectionWrapper>

      <SectionWrapper title="My Team">
        <Link href="/fantasy/my-team">
          <a className="text-blue-600 hover:underline">Open Your Roster →</a>
        </Link>
      </SectionWrapper>

      <SectionWrapper title="Player Stats">
        <Link href="/fantasy/player-stats">
          <a className="text-blue-600 hover:underline">Explore Player Stats →</a>
        </Link>
      </SectionWrapper>

      <SectionWrapper title="Trade Center">
        <Link href="/fantasy/trade-center">
          <a className="text-blue-600 hover:underline">Go to Trade Center →</a>
        </Link>
      </SectionWrapper>

      <SectionWrapper title="League Schedule">
        <Link href="/fantasy/league-schedule">
          <a className="text-blue-600 hover:underline">See Full Schedule →</a>
        </Link>
      </SectionWrapper>

      <SectionWrapper title="Free Agent Listings">
        <Link href="/fantasy/free-agent-listings">
          <a className="text-blue-600 hover:underline">Browse Free Agents →</a>
        </Link>
      </SectionWrapper>

      <SectionWrapper title="Draft Review">
        <Link href="/fantasy/draft-review">
          <a className="text-blue-600 hover:underline">Review Draft Results →</a>
        </Link>
      </SectionWrapper>

      <Footer />
    </>
  )
}
