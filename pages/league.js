'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import SidebarNavigation from '../components/SidebarNavigation'
import SectionWrapper from '../components/SectionWrapper'
import TrendingTopics from '../components/TrendingTopics'

export default function LeaguePage() {
  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <SidebarNavigation active="league" />
          </aside>

          <div className="md:col-span-3 space-y-12">
            <SectionWrapper title="Personalize Your Feed" buttonLabel="Customize">
              <p className="text-gray-600">Follow your favorite teams and players for a tailored experience.</p>
            </SectionWrapper>

            <SectionWrapper title="Trending Topics">
              <TrendingTopics />
            </SectionWrapper>

            <SectionWrapper title="Season Snapshot">
              <p className="text-gray-600">Snapshot content (e.g., upcoming schedule, standings) goes here...</p>
            </SectionWrapper>

            <SectionWrapper title="Key Statistics Leaders">
              <p className="text-gray-600">Top leaders in stats by category go here...</p>
            </SectionWrapper>

            <SectionWrapper title="Betting Odds Highlights">
              <p className="text-gray-600">Showcase current betting lines here...</p>
            </SectionWrapper>

            <SectionWrapper title="Fantasy Football Insights">
              <p className="text-gray-600">Show fantasy callouts and trends here...</p>
            </SectionWrapper>

            <SectionWrapper title="Power Rankings">
              <p className="text-gray-600">Current top 5 teams...</p>
            </SectionWrapper>

            <SectionWrapper title="Video Content & Podcasts">
              <p className="text-gray-600">Embedded video/podcast previews go here...</p>
            </SectionWrapper>

            <SectionWrapper title="Engage with the NFL">
              <p className="text-gray-600">Polls, simulations, depth chart, and comment form go here...</p>
            </SectionWrapper>

            <SectionWrapper title="Explore More">
              <p className="text-gray-600">Call-to-action buttons linking to full pages.</p>
            </SectionWrapper>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
