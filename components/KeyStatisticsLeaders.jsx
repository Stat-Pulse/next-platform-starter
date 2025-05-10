'use client'

import { useEffect, useState } from 'react'

export default function KeyStatisticsLeaders() {
  const [leaders, setLeaders] = useState({
    passing: [],
    rushing: [],
    receiving: [],
    defense: [],
  })

  useEffect(() => {
    // Placeholder for future API integration
    const dummyData = {
      passing: [
        { name: 'Joe Burrow', team: 'Bengals', value: '4,918 yds' },
        { name: 'Patrick Mahomes', team: 'Chiefs', value: '4,800 yds' },
        { name: 'Josh Allen', team: 'Bills', value: '4,600 yds' },
      ],
      rushing: [
        { name: 'Saquon Barkley', team: 'Giants', value: '2,000 yds' },
        { name: 'Bijan Robinson', team: 'Falcons', value: '1,456 yds' },
        { name: 'Derrick Henry', team: 'Titans', value: '1,421 yds' },
      ],
      receiving: [
        { name: "Ja'Marr Chase", team: 'Bengals', value: '1,708 yds' },
        { name: 'Justin Jefferson', team: 'Vikings', value: '1,533 yds' },
        { name: 'CeeDee Lamb', team: 'Cowboys', value: '1,498 yds' },
      ],
      defense: [
        { name: 'Trey Hendrickson', team: 'Bengals', value: '17.5 sacks' },
        { name: 'Myles Garrett', team: 'Browns', value: '14 sacks' },
        { name: 'Micah Parsons', team: 'Cowboys', value: '12 sacks' },
      ],
    }

    setLeaders(dummyData)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(leaders).map(([category, players]) => (
        <div key={category} className="bg-gray-100 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 capitalize">
            {category} Leaders
          </h3>
          <ul className="space-y-2 text-gray-700">
            {players.map((player, index) => (
              <li key={index}>
                {player.name} ({player.team}) – {player.value}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
