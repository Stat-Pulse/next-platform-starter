'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import SidebarNavigation from '../components/SidebarNavigation'
import SectionWrapper from '../components/SectionWrapper'
import TrendingTopics from '../components/TrendingTopics'
import SeasonSnapshot from '../components/SeasonSnapshot'
import KeyStatisticsLeaders from '../components/KeyStatisticsLeaders'
import BettingOddsHighlights from '../components/BettingOddsHighlights'
import FantasyFootballInsights from '../components/FantasyFootballInsights'
import PowerRankings from '../components/PowerRankings'
import VideoContent from '../components/VideoContent'
import EngageNFL from '../components/EngageNFL'

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
             <SeasonSnapshot />
           </SectionWrapper>

           <SectionWrapper title="Key Statistics Leaders">
             <KeyStatisticsLeaders />
           </SectionWrapper>

            <SectionWrapper title="Betting Odds Highlights">
              <BettingOddsHighlights />
            </SectionWrapper>

            <SectionWrapper title="Fantasy Football Insights">
              <FantasyFootballInsights />
            </SectionWrapper>

            <SectionWrapper title="Power Rankings">
              <PowerRankings />
            </SectionWrapper>

            <SectionWrapper title="Video Content & Podcasts">
              <VideoContent />
            </SectionWrapper>

            <SectionWrapper title="Engage with the NFL">
              <p className="text-gray-600">Polls, simulations, depth chart, and comment form go here...</p>
            </SectionWrapper>

            <SectionWrapper title="Explore More">
             <EngageNFL />
            </SectionWrapper>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
