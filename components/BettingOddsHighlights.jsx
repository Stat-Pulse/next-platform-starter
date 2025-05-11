'use client'

export default function BettingOddsHighlights() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        <a href="/betting-book" className="hover:underline text-red-600">
          Betting Odds Highlights
        </a>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            <a href="/betting-book" className="hover:underline text-red-600">
              Week 1 Key Games
            </a>
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>Bengals vs. Patriots: Spread: CIN -3.5, Moneyline: -180, O/U: 42.5</li>
            <li>Chiefs vs. Ravens: Spread: KC -2, Moneyline: -135, O/U: 48.5</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            <a href="/betting-book" className="hover:underline text-red-600">
              Line Movements
            </a>
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>Bengals vs. Patriots: Spread moved from -2.5 to -3.5</li>
            <li>Chiefs vs. Ravens: O/U dropped from 49.5 to 48.5</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center">
        <a
          href="/betting-book"
          className="bg-red-600 text-white px-6 py-3 rounded-md text-sm hover:bg-red-700"
        >
          View All Betting Odds
        </a>
      </div>
    </div>
  )
}
