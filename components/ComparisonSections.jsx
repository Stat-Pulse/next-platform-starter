// File: components/ComparisonSections.js

export default function ComparisonSections({ players = [], metrics = [], viewMode = 'weekly' }) {
  return (
    <div className="container mx-auto px-6 mt-4">
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {viewMode === 'weekly' && 'Weekly Stats'}
          {viewMode === 'season' && 'Season Overview'}
          {viewMode === 'career' && 'Career Breakdown'}
        </h3>

        {players.length === 0 ? (
          <p className="text-gray-500">No players selected.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Metric</th>
                  {players.map((p, i) => (
                    <th key={i} className="p-2">{p || `Player ${i + 1}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric} className="border-t">
                    <td className="p-2 font-medium text-gray-700">{metric}</td>
                    {players.map((_, i) => (
                      <td key={i} className="p-2 text-gray-600">—</td> {/* Placeholder for future stat values */}
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}