'use client'

import Link from 'next/link'

export default function BettingOddsHighlights() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        <Link href="/betting-book" className="text-red-600 hover:underline">
          Betting Odds Highlights
        </Link>
    

        {/* Week 1 Key Games */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-red-600 mb-4">
            <Link href="/betting-book" className="hover:underline">
              Week 1 Key Games
            </Link>
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>Bengals vs. Patriots: Spread: CIN -3.5, ML: -180, O/U: 42.5</li>
            <li>Chiefs vs. Ravens: Spread: KC -2, ML: -135, O/U: 48.5</li>
          </ul>
        </div>

        {/* Line Movements */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-red-600 mb-4">
            <Link href="/betting-book" className="hover:underline">
              Line Movements
            </Link>
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>Bengals vs. Patriots: Spread moved -2.5 ➝ -3.5</li>
            <li>Chiefs vs. Ravens: O/U dropped 49.5 ➝ 48.5</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link href="/betting-book" className="bg-red-600 text-white px-6 py-3 rounded-md text-sm hover:bg-red-700">
          View All Betting Odds
        </Link>
      </div>
    </div>
  )
}
