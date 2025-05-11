'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'

export default function TeamPage() {
  return (
    <>
      <Header />

      <main className="bg-gray-100 py-10">
        <div className="container mx-auto px-6 space-y-10">

          {/* I. Team Header */}
          <section className="flex flex-col items-center text-center space-y-4">
            <img src="/team-logos/bengals.png" alt="Team Logo" className="w-32 h-32" />
            <h1 className="text-3xl font-bold text-gray-800">Cincinnati Bengals</h1>
            <p className="text-lg text-gray-600">2025 Record: 10-4-1</p>
            <p className="text-sm text-gray-500">Next Game: vs Chiefs — May 15, 2025 @ 4:25 PM EST (<a href="/schedule-results" className="text-red-600 underline">Full Schedule</a>)</p>
          </section>

          {/* II. News & Media */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Latest News & Highlights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* News Feed */}
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold text-lg text-gray-700 mb-2">Recent Articles</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/league-news" className="text-red-600 hover:underline">Burrow returns to full practice ahead of Chiefs matchup</a></li>
                  <li><a href="/league-news" className="text-red-600 hover:underline">Bengals sign veteran CB to bolster secondary</a></li>
                </ul>
              </div>

              {/* Video Highlights */}
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold text-lg text-gray-700 mb-2">Video Highlights</h3>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe src="https://www.youtube.com/embed/sample-video" allowFullScreen className="w-full h-full rounded" />
                </div>
              </div>
            </div>
          </section>

          {/* III. Full Schedule */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Schedule & Results</h2>
            <div className="bg-white p-4 rounded shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2">Opponent</th>
                    <th className="p-2">Result</th>
                    <th className="p-2">TV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2">May 5</td>
                    <td className="p-2">@ Steelers</td>
                    <td className="p-2 text-green-600 font-bold">W 27-17</td>
                    <td className="p-2">CBS</td>
                  </tr>
                  <tr>
                    <td className="p-2">May 15</td>
                    <td className="p-2">vs Chiefs</td>
                    <td className="p-2 text-gray-500">Scheduled</td>
                    <td className="p-2">FOX</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* IV. Roster */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Roster & Depth Chart</h2>
            <div className="bg-white p-4 rounded shadow">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Position</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2">9</td>
                    <td className="p-2"><a href="/players/joe-burrow" className="text-red-600 hover:underline">Joe Burrow</a></td>
                    <td className="p-2">QB</td>
                  </tr>
                  <tr>
                    <td className="p-2">28</td>
                    <td className="p-2"><a href="/players/joe-mixon" className="text-red-600 hover:underline">Joe Mixon</a></td>
                    <td className="p-2">RB</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-gray-500 mt-2">Depth chart coming soon.</p>
            </div>
          </section>

          {/* V. Stats */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Team Stats & Leaders</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Team Averages</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Points per Game: 26.7</li>
                  <li>Yards per Game: 391.2</li>
                  <li>Pass Yards/Game: 278.5</li>
                  <li>Rush Yards/Game: 112.7</li>
                  <li>Opponent PPG: 22.1</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Team Leaders</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Passing: <a href="/players/joe-burrow" className="text-red-600 hover:underline">Joe Burrow</a> – 3,900 yds</li>
                  <li>Rushing: <a href="/players/bijan-robinson" className="text-red-600 hover:underline">Bijan Robinson</a> – 1,140 yds</li>
                  <li>Receiving: <a href="/players/ja-marr-chase" className="text-red-600 hover:underline">Ja&#39;Marr Chase</a> – 1,208 yds</li>
                  <li>Sacks: <a href="/players/trey-hendrickson" className="text-red-600 hover:underline">Trey Hendrickson</a> – 14</li>
                </ul>
              </div>
            </div>
          </section>

          {/* VI. Team Info */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Team Overview</h2>
            <div className="bg-white p-4 rounded shadow text-sm text-gray-600">
              <p><strong>Founded:</strong> 1968</p>
              <p><strong>Super Bowl Titles:</strong> 0</p>
              <p><strong>Stadium:</strong> Paycor Stadium (Cincinnati, OH, 65,000 capacity)</p>
              <p><strong>Head Coach:</strong> Zac Taylor</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
