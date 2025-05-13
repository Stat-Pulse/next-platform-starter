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
import ExploreMore from '../components/ExploreMore'

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
              <p className="text-gray-600">
                Follow your favorite teams and players for a tailored experience.
              </p>
            </SectionWrapper>

           <SectionWrapper title={
              <Link href="/league-news" className="text-red-600 hover:underline">
                Schedule Results
              </Link>
            }>
              <TrendingTopics />
            </SectionWrapper>

           <SectionWrapper title={
              <Link href="/schedule-results" className="text-red-600 hover:underline">
                Trending Topics
              </Link>
            }>
              <ScheduleResults />
            </SectionWrapper>

            <SectionWrapper title={
              <Link href="/season-snapshot" className="text-red-600 hover:underline">
                Season Snapshot
              </Link>
            }>
              <SeasonSnapshot />
            </SectionWrapper>

            <SectionWrapper title={
              <Link href="/key-statistics-leaders" className="text-red-600 hover:underline">
                Key Statistics Leaders
            </Link>
            }>
              <KeyStatisticsLeaders />
            </SectionWrapper>

            <SectionWrapper title={
              <Link href="/betting-book" className="text-red-600 hover:underline">
                Betting Book
            </Link>
            }>
              <BettingBook />
            </SectionWrapper>

            <SectionWrapper title={
              <Link href="/fantasy" className="text-red-600 hover:underline">
                Fantasy
            </Link>
            }>
              <Fantasy />
            </SectionWrapper>

            <SectionWrapper title={
              <Link href="/Video-Content-&-Podcasts" className="text-red-600 hover:underline">
                Media Vault
            </Link>
            }>
              <MediaVault />
            </SectionWrapper>

            <SectionWrapper title={<a href="/media-vault" className="text-red-600 hover:underline">Power Rankings</a>}>
              <PowerRankings />
            </SectionWrapper>

            <SectionWrapper title={
              <Link href="/power-rankings" className="text-red-600 hover:underline">
                Power Rankings
            </Link>
            }>
              <PowerRankings />
            </SectionWrapper>

            <SectionWrapper title={
              <Link href="/engage-with-the-nfl" className="text-red-600 hover:underline">
                EngageNFL
            </Link>
            }>
              <Engage NFL />
            </SectionWrapper>

            <SectionWrapper title={
              <Link href="/explore-more" className="text-red-600 hover:underline">
                Explore More
            </Link>
            }>
              <ExploreMore />
            </SectionWrapper>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
