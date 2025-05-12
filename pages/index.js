'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import teams from '../data/teams'

export default function TeamsIndexPage() {
  const grouped = teams.reduce((acc, team) => {
    const { conference, division } = team
    if (!acc[conference]) acc[conference] = {}
    if (!acc[conference][division]) acc[conference][division] = []
    acc[conference][division].push(team)
    return acc
  }, {})

  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-12">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">NFL Teams</h1>

          {Object.entries(grouped).map(([conference, divisions]) => (
            <div key={conference} className="space-y-8">
              <h2 className="text-2xl font-semibold text-gray-700">{conference}</h2>

              {Object.entries(divisions).map(([division, teams]) => (
                <div key={division}>
                  <h3 className="text-xl font-semibold text-gray-600 mb-4">{division}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {teams.map((team) => (
                      <Link
                        href={`/teams/${team.slug}`}
                        key={team.slug}
                        className="bg-white rounded-lg shadow p-4 text-center hover:shadow-lg hover:border hover:border-red-500 transition"
                      >
                        <img
                          src={`/team-logos/${team.slug}.png`}
                          alt={`${team.name} Logo`}
                          className="mx-auto w-16 h-16 object-contain mb-2"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = '/team-logos/fallback.png'
                          }}
                        />
                        <p className="text-sm font-medium text-gray-800">{team.name}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
