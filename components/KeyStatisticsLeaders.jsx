'use client'

export default function KeyStatisticsLeaders() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gray-100 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Passing Yards</h3>
        <ul className="space-y-2 text-gray-700">
          <li><a href="#" className="text-red-600 hover:underline">Joe Burrow</a> – 4,918 yds</li>
          <li><a href="#" className="text-red-600 hover:underline">Patrick Mahomes</a> – 4,800 yds</li>
          <li><a href="#" className="text-red-600 hover:underline">Josh Allen</a> – 4,600 yds</li>
        </ul>
      </div>
      <div className="bg-gray-100 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Rushing Yards</h3>
        <ul className="space-y-2 text-gray-700">
          <li><a href="#" className="text-red-600 hover:underline">Saquon Barkley</a> – 2,000 yds</li>
          <li><a href="#" className="text-red-600 hover:underline">Bijan Robinson</a> – 1,456 yds</li>
          <li><a href="#" className="text-red-600 hover:underline">Derrick Henry</a> – 1,921 yds</li>
        </ul>
      </div>
      <div className="bg-gray-100 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Receiving Yards</h3>
        <ul className="space-y-2 text-gray-700">
          <li><a href="#" className="text-red-600 hover:underline">Ja'Marr Chase</a> – 1,708 yds</li>
          <li><a href="#" className="text-red-600 hover:underline">Justin Jefferson</a> – 1,533 yds</li>
          <li><a href="#" className="text-red-600 hover:underline">Brian Thomas Jr.</a> – 1,282 yds</li>
        </ul>
      </div>
      <div className="bg-gray-100 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Sacks</h3>
        <ul className="space-y-2 text-gray-700">
          <li><a href="#" className="text-red-600 hover:underline">Trey Hendrickson</a> – 17.5 sacks</li>
          <li><a href="#" className="text-red-600 hover:underline">Myles Garrett</a> – 14 sacks</li>
          <li><a href="#" className="text-red-600 hover:underline">Micah Parsons</a> – 12 sacks</li>
        </ul>
      </div>
    </div>
  )
}
