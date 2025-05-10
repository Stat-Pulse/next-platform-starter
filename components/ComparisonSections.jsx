// components/ComparisonSections.jsx
export default function ComparisonSections({ players = [], metrics = [] }) {
  // only render once we have at least 2 players
  if (players.length < 2) {
    return (
      <div className="container mx-auto px-6 py-8">
        <p className="text-gray-600 italic">Select at least two players to compare.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">🚀 Comparison Results 🚀</h2>
      <p className="mb-2">
        <strong>Players:</strong> {players.join(' vs. ')}
      </p>
      <p>
        <strong>Metrics enabled:</strong> {metrics.join(', ')}
      </p>
    </div>
  )
}
