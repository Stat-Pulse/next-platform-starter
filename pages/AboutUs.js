import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-gray-800 text-white">
        <NavBar />
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center text-gray-800 mb-6">
          About StatPulse
        </h1>

        {/* Intro Section */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4">About Us: Stat Pulse</h2>
          <p className="text-gray-600 mb-4">
            Welcome to Stat Pulse, your central hub for in-depth sports statistics, analysis, and insights. At Stat Pulse, we go beyond the basic box scores to provide dedicated fans, fantasy players, and analytics enthusiasts with the data and commentary they need to truly understand the game.
          </p>
          <p className="text-gray-600 mb-4">
            From up-to-the-minute schedules and standings to detailed depth charts and player statistics, we deliver the core information you need to stay informed. Dive deeper with our collection of articles, videos, and podcasts featuring expert analysis and unique in-house perspectives.
          </p>
          <p className="text-gray-600 mb-4">
            Join a community that shares your passion for sports data. For those seeking an edge, Stat Pulse offers premium content including comprehensive salary cap breakdowns and advanced betting odds analysis.
          </p>
          <p className="text-gray-600">
            Whether you&rsquo;re tracking your favorite team, managing a fantasy roster, or simply craving a deeper understanding of sports performance, Stat Pulse provides the tools and insights to keep your finger on the pulse of the game.
          </p>
        </section>

        {/* Mission Section */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            StatPulse is your go-to platform for NFL quarterback analytics, designed to empower fantasy football players, sports bettors, and passionate fans. We provide real-time stats, insights, and tools to help you make informed decisions, whether you&rsquo;re drafting your fantasy team, placing a bet, or cheering for your favorite QB.
          </p>
          <p className="text-gray-600">
            Our goal is to expand beyond quarterbacks to cover all NFL positions, other sports, and integrate AI-driven predictive analytics to give you an edge. At StatPulse, we&rsquo;re all about delivering accurate, actionable data with a user-friendly experience.
          </p>
        </section>

        {/* Team Section */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4">Our Team</h2>
          <p className="text-gray-600 mb-4">
            We&rsquo;re a team of sports enthusiasts, data scientists, and developers united by a love for football and technology.
          </p>
          <p className="text-gray-600">
            Have feedback or ideas? Reach out to us at{' '}
            <a href="mailto:support@statpulse.com" className="text-primary hover:underline">
              support@statpulse.com
            </a>
            . Follow us on{' '}
            <a
              href="https://twitter.com/StatPulseNFL"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              X
            </a>{' '}
            for updates!
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <Footer />
      </footer>
    </div>
  );
}
