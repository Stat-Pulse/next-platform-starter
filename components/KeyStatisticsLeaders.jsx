'use client'

export default function KeyStatisticsLeaders() {
  const categories = [
    { title: 'Passing Yards', id: 'passingLeaders' },
    { title: 'Rushing Yards', id: 'rushingLeaders' },
    { title: 'Receiving Yards', id: 'receivingLeaders' },
    { title: 'Sacks', id: 'defensiveLeaders' }
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        <a href="/stat-tracker" className="hover:underline text-red-600">
          Key Statistics Leaders
        </a>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-gray-100 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">{cat.title}</h3>
            <ul id={cat.id} className="space-y-2 text-gray-700">
              <li>Loading...</li>
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <a
          href="/stat-tracker"
          className="bg-red-600 text-white px-6 py-3 rounded-md text-sm hover:bg-red-700"
        >
          View Full Stats
        </a>
      </div>
    </div>
  )
}
