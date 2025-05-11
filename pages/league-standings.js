'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import SidebarNavigation from '../components/SidebarNavigation'
import SectionWrapper from '../components/SectionWrapper'
import NFLStandings from '../components/NFLStandings'
import FantasyStandings from '../components/FantasyStandings'

export default function LeagueStandingsPage() {
  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <SidebarNavigation active="league-standings" />
          </aside>

          <div className="md:col-span-3 space-y-12">
            <SectionWrapper title="NFL League Standings">
              <NFLStandings />
            </SectionWrapper>

            <SectionWrapper title="Fantasy Football Standings">
              <FantasyStandings />
            </SectionWrapper>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
