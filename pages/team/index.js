import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import mysql from 'mysql2/promise';

async function getTeams() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'stat_pulse_analytics_db',
    });
    const [rows] = await connection.execute(
      'SELECT team_abbr, team_name, team_division AS division, team_conference AS conference, team_logo_espn AS logo_url FROM Teams'
    );
    await connection.end();
    return rows.map((row) => ({
      slug: row.team_abbr.toLowerCase(),
      name: row.team_name,
      conference: row.conference,
      division: row.division,
      logo_url: row.logo_url,
    }));
  } catch (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
}

export async function getStaticProps() {
  const teams = await getTeams();
  return { props: { teams } };
}

const divisions = {
  AFC: ['East', 'North', 'South', 'West'],
  NFC: ['East', 'North', 'South', 'West'],
};

export default function TeamsIndex({ teams }) {
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
                );

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
                          <Image
                            src={team.logo_url || `/team-logos/${team.slug}.png`}
                            alt={`${team.name} Logo`}
                            width={80}
                            height={80}
                            className="mx-auto mb-2"
                          />
                          <p className="text-sm font-medium text-gray-800">{team.name}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}