'use client'

import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function TeamsIndex() {
  const teams = [
    { name: 'Cowboys', slug: 'cowboys' },
    { name: 'Bengals', slug: 'bengals' },
    { name: 'Chiefs', slug: 'chiefs' },
    // Add more as needed
  ]

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">NFL Teams</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {teams.map(team => (
              <Link
                key={team.slug}
                href={`/teams/${team.slug}`}
                className="bg-white p-4 rounded shadow text-center hover:bg-red-50 transition"
              >
                <p className="text-lg font-semibold text-gray-800">{team.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
