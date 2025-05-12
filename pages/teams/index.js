'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import teams from '../../data/teams'

const divisions = {
  AFC: ['East', 'North', 'South', 'West'],
  NFC: ['East', 'North', 'South', 'West']
}

export default function TeamsIndex() {
  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">NFL Teams</h1>

          {Object.entries(divisions).map(([conference, divs]) => (
            <section key={conference} className="space-y-8">
              <h2 className="text-2xl font-semibold text-red-600">{conference} Conference</h2>
              {divs.map((division) => {
                const filteredTeams = teams.filter(
                  (team) => team.conference === conference && team.division === division
                )

                return (
                  <div key={division}>
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">{division} Division</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {filteredTeams.map((team) => (
                        <Link
                          key={team.slug}
                          href={`/teams/${team.slug}`}
                          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-200 border hover:border-red-600 text-center"
                        >
                          <img
                            src={`/team-logos/${team.slug}.png`}
                            alt={`${team.name} Logo`}
                            className="w-20 h-20 mx-auto mb-2"
                          />
                          <p className="text-sm font-medium text-gray-800">{team.name}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
