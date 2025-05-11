'use client'

import Link from 'next/link'

export default function FantasyFootballInsights() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        <Link href="/fantasy" className="text-red-600 hover:underline">
          Fantasy Football Insights
        </Link>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Waiver Wire Pickups</h3>
          <p className="text-gray-600 mb-4">
            Top adds: RB Chase Brown (CIN), WR Brian Thomas Jr. (JAX).{' '}
            <Link href="/fantasy" className="text-red-600 hover:underline">Read more</Link>
          </p>
          <p className="text-sm text-gray-500">May 8, 2025</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Trending Players</h3>
          <p className="text-gray-600 mb-4">
            Up: J.J. McCarthy (QB, MIN). Down: Tua Tagovailoa (QB, MIA).{' '}
            <Link href="/fantasy" className="text-red-600 hover:underline">See trends</Link>
          </p>
          <p className="text-sm text-gray-500">May 8, 2025</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Matchup Preview</h3>
          <p className="text-gray-600 mb-4">
            Bengals vs. Patriots: Key fantasy matchups.{' '}
            <Link href="/analytics-lab" className="text-red-600 hover:underline">Read more</Link>
          </p>
          <p className="text-sm text-gray-500">May 5, 2025</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/fantasy" className="bg-red-600 text-white px-6 py-3 rounded-md text-sm hover:bg-red-700">
          Explore Fantasy Insights
        </Link>
      </div>
    </div>
  )
}
