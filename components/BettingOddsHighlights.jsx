'use client'

export default function BettingOddsHighlights() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        <a href="/betting-book" className="hover:underline text-red-600">
          Betting Odds Highlights
        </a>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Week 1 Key Games</h3>
          <p className="text-gray-700">
            Bengals vs. Patriots: Spread: CIN -3.5, ML: -180, O/U: 42.5
            <br />
            Chiefs vs. Ravens: Spread: KC -2, ML: -135, O/U: 48.5
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Line Movements</h3>
          <p className="text-gray-700">
            Bengals vs. Patriots: Spread moved -2.5 → -3.5
            <br />
            Chiefs vs. Ravens: O/U dropped 49.5 → 48.5
          </p>
        </div>
      </div>

      <div className="text-center mt-4">
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
