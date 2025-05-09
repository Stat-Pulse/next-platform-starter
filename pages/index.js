// pages/index.js
import Header from '../components/Header'
import Hero from '../components/Hero'
import Personalization from '../components/Personalization'
import NewsFeed from '../components/NewsFeed'
import AnalysisGrid from '../components/AnalysisGrid'
import InteractiveSection from '../components/InteractiveSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Personalization />
      <NewsFeed />
      <AnalysisGrid />
      <InteractiveSection />
      <Footer />
    </>
  )
}
