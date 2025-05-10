'use client'

export default function SeasonSnapshot() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Upcoming Schedule */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Schedule</h3>
        <ul className="space-y-2 text-gray-700 text-sm">
          <li>Bengals vs. Patriots – Sep 7, 2025, 1:00 PM ET</li>
          <li>Chiefs vs. Ravens – Sep 8, 2025, 8:20 PM ET</li>
        </ul>
        <a href="schedule-results.html" className="text-red-600 hover:underline mt-4 inline-block">Full Schedule</a>
      </div>

      {/* Live Scores */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Live Scores / Results</h3>
        <ul className="space-y-2 text-gray-700 text-sm">
          <li>No live games currently.</li>
        </ul>
        <a href="schedule-results.html" className="text-red-600 hover:underline mt-4 inline-block">View All Results</a>
      </div>

      {/* Standings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Current Standings</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Team</th>
              <th className="p-2">W-L-T</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Bengals</td>
              <td className="p-2">0-0-0</td>
            </tr>
            <tr>
              <td className="p-2">Chiefs</td>
              <td className="p-2">0-0-0</td>
            </tr>
          </tbody>
        </table>
        <a href="league-standings.html" className="text-red-600 hover:underline mt-4 inline-block">Full Standings</a>
      </div>
    </div>
  )
}
