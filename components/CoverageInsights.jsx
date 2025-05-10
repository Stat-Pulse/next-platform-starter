export default function CoverageInsights({ coverage }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-xl font-semibold mb-4">Coverage Insights</h3>
      <ul className="text-gray-700 space-y-2">
        {coverage.map((item) => (
          <li key={item.type}>
            <strong>{item.type}</strong> – seen on {item.frequency}% of plays, {item.successRate}% success
          </li>
        ))}
      </ul>
    </div>
  )
}
