'use client'

import { useRouter } from 'next/router'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function TeamPage() {
  const router = useRouter()
  const { team } = router.query

  // Placeholder team data (you can fetch real API data later)
  const teamInfo = {
    bengals: {
      name: 'Cincinnati Bengals',
      logo: '/team-logos/bengals.png',
      colors: ['#FB4F14', '#000000'],
      record: '10-4-1',
      nextGame: {
        opponent: 'Chiefs',
        date: 'May 15, 2025',
        time: '4:25 PM EST',
        home: true
      }
    },
    // Add more teams here
  }

  const data = teamInfo[team]

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading team data...</p>
      </div>
    )
  }

  return (
    <>
      <Header />

      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-10">

          {/* Team Info Header */}
          <section className="flex flex-col items-center text-center space-y-4">
            <img src={data.logo} alt={`${data.name} Logo`} className="w-32 h-32" />
            <h1 className="text-3xl font-bold text-gray-800">{data.name}</h1>
            <p className="text-lg text-gray-600">2025 Record: {data.record}</p>
            <p className="text-sm text-gray-500">
              Next Game: {data.home ? 'vs' : '@'} {data.nextGame.opponent} — {data.nextGame.date} @ {data.nextGame.time}
            </p>
          </section>

          {/* Additional sections (News, Roster, Schedule, etc.) will go here */}

        </div>
      </main>

      <Footer />
    </>
  )
}