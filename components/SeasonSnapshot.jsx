'use client'

import Link from 'next/link'

export default function SeasonSnapshot() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Upcoming Schedule */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          <Link href="/schedule-results" className="hover:underline text-red-600">
            Upcoming Schedule
          </Link>
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li>Bengals vs. Patriots - Sep 7, 2025, 1:00 PM ET</li>
          <li>Chiefs vs. Ravens - Sep 8, 2025, 8:20 PM ET</li>
        </ul>
        <Link href="/schedule-results" className="text-red-600 hover:underline mt-4 inline-block text-sm">
          Full Schedule
        </Link>
      </div>

      {/* Live Scores */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          <Link href="/schedule-results" className="hover:underline text-red-600">
            Live Scores / Results
          </Link>
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li>No live games currently.</li>
        </ul>
        <Link href="/schedule-results" className="text-red-600 hover:underline mt-4 inline-block text-sm">
          View All Results
        </Link>
      </div>

      {/* Current Standings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          <Link href="/league-standings" className="hover:underline text-red-600">
            Current Standings
          </Link>
        </h3>
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
        <Link href="/league-standings" className="text-red-600 hover:underline mt-4 inline-block text-sm">
          Full Standings
        </Link>
      </div>
    </div>
  )
}
