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
import Link from 'next/link'

export default function LeaguePage() {
  return (
    <>
      <Header />
      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <SidebarNavigation current="league" />
          </aside>

          <div className="md:col-span-3 space-y-12">

            <SectionWrapper title="Personalize Your Feed" buttonLabel="Customize">
              <p className="text-gray-600">
                Follow your favorite teams and players for a tailored experience.
              </p>
            </SectionWrapper>

            <SectionWrapper
              title={
                <Link href="/league-news" className="text-red-600 hover:underline">
                  Trending Topics
                </Link>
              }
            >
              <TrendingTopics />
            </SectionWrapper>

            <SectionWrapper
              title={
                <Link href="/schedule-results" className="text-red-600 hover:underline">
                  Season Snapshot
                </Link>
              }
            >
              <SeasonSnapshot />
            </SectionWrapper>

            <SectionWrapper
              title={
                <Link href="/stat-tracker" className="text-red-600 hover:underline">
                  Key Statistics Leaders
                </Link>
              }
            >
              <KeyStatisticsLeaders />
            </SectionWrapper>

            <SectionWrapper
              title={
                <Link href="/betting-book" className="text-red-600 hover:underline">
                  Betting Odds Highlights
                </Link>
              }
            >
              <BettingOddsHighlights />
            </SectionWrapper>

            <SectionWrapper
              title={
                <Link href="/fantasy" className="text-red-600 hover:underline">
                  Fantasy Football Insights
                </Link>
              }
            >
              <FantasyFootballInsights />
            </SectionWrapper>

            <SectionWrapper
              title={
                <Link href="/media-vault" className="text-red-600 hover:underline">
                  Power Rankings
                </Link>
              }
            >
              <PowerRankings />
            </SectionWrapper>

            <SectionWrapper
              title={
                <Link href="/media-vault" className="text-red-600 hover:underline">
                  Video Content & Podcasts
                </Link>
              }
            >
              <VideoContent />
            </SectionWrapper>

            <SectionWrapper title="Engage with the NFL">
              <EngageNFL />
            </SectionWrapper>

            <SectionWrapper title="Explore More">
              <ExploreMore />
            </SectionWrapper>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
