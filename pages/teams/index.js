'use client'

import Link from 'next/link'

const teams = [
  {
    conference: 'AFC',
    divisions: [
      {
        name: 'AFC East',
        teams: [
          { name: 'Buffalo Bills', slug: 'bills' },
          { name: 'Miami Dolphins', slug: 'dolphins' },
          { name: 'New England Patriots', slug: 'patriots' },
          { name: 'New York Jets', slug: 'jets' },
        ]
      },
      {
        name: 'AFC North',
        teams: [
          { name: 'Baltimore Ravens', slug: 'ravens' },
          { name: 'Cincinnati Bengals', slug: 'bengals' },
          { name: 'Cleveland Browns', slug: 'browns' },
          { name: 'Pittsburgh Steelers', slug: 'steelers' },
        ]
      },
      {
        name: 'AFC South',
        teams: [
          { name: 'Houston Texans', slug: 'texans' },
          { name: 'Indianapolis Colts', slug: 'colts' },
          { name: 'Jacksonville Jaguars', slug: 'jaguars' },
          { name: 'Tennessee Titans', slug: 'titans' },
        ]
      },
      {
        name: 'AFC West',
        teams: [
          { name: 'Denver Broncos', slug: 'broncos' },
          { name: 'Kansas City Chiefs', slug: 'chiefs' },
          { name: 'Las Vegas Raiders', slug: 'raiders' },
          { name: 'Los Angeles Chargers', slug: 'chargers' },
        ]
      }
    ]
  },
  {
    conference: 'NFC',
    divisions: [
      {
        name: 'NFC East',
        teams: [
          { name: 'Dallas Cowboys', slug: 'cowboys' },
          { name: 'New York Giants', slug: 'giants' },
          { name: 'Philadelphia Eagles', slug: 'eagles' },
          { name: 'Washington Commanders', slug: 'commanders' },
        ]
      },
      {
        name: 'NFC North',
        teams: [
          { name: 'Chicago Bears', slug: 'bears' },
          { name: 'Detroit Lions', slug: 'lions' },
          { name: 'Green Bay Packers', slug: 'packers' },
          { name: 'Minnesota Vikings', slug: 'vikings' },
        ]
      },
      {
        name: 'NFC South',
        teams: [
          { name: 'Atlanta Falcons', slug: 'falcons' },
          { name: 'Carolina Panthers', slug: 'panthers' },
          { name: 'New Orleans Saints', slug: 'saints' },
          { name: 'Tampa Bay Buccaneers', slug: 'buccaneers' },
        ]
      },
      {
        name: 'NFC West',
        teams: [
          { name: 'Arizona Cardinals', slug: 'cardinals' },
          { name: 'Los Angeles Rams', slug: 'rams' },
          { name: 'San Francisco 49ers', slug: '49ers' },
          { name: 'Seattle Seahawks', slug: 'seahawks' },
        ]
      }
    ]
  }
]

export default function TeamsIndex() {
  return (
    <main className="bg-gray-100 py-10">
      <div className="container mx-auto px-6 space-y-12">
        {teams.map((conf) => (
          <section key={conf.conference}>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{conf.conference}</h2>

            {conf.divisions.map((div) => (
              <div key={div.name} className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">{div.name}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {div.teams.map((team) => (
                    <Link key={team.slug} href={`/teams/${team.slug}`} className="block bg-white p-4 rounded-lg shadow hover:shadow-lg hover:scale-105 transition transform text-center">
                      <img
                        src={`/team-logos/${team.slug}.png`}
                        alt={`${team.name} logo`}
                        className="mx-auto w-16 h-16 mb-2"
                      />
                      <span className="text-gray-800 font-medium">{team.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </main>
  )
}
