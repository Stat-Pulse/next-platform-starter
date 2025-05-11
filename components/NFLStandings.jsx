'use client'

import { useState } from 'react'

export default function NFLStandings() {
  const [selectedConference, setSelectedConference] = useState('AFC')
  const [selectedDivision, setSelectedDivision] = useState('East')
  const [selectedYear, setSelectedYear] = useState('2025')

  // Sample static data — replace with real API or JSON in future
  const standingsData = [
    {
      team: 'Buffalo Bills',
      logo: 'https://upload.wikimedia.org/wikipedia/en/7/77/Buffalo_Bills_logo.svg',
      record: '10-3-1',
      winPct: 0.75,
      gb: 0,
      home: '5-1-0',
      away: '5-2-1',
      division: '3-1-0',
      conference: '6-2-1',
      pf: 340,
      pa: 300,
      diff: 40,
      last10: '7-3',
      streak: 'W3',
      divisionKey: 'AFC-East'
    },
    {
      team: 'Miami Dolphins',
      logo: 'https://upload.wikimedia.org/wikipedia/en/3/37/Miami_Dolphins_logo.svg',
      record: '9-4-1',
      winPct: 0.68,
      gb: 1,
      home: '4-2-1',
      away: '5-2-0',
      division: '2-2-0',
      conference: '5-3-1',
      pf: 320,
      pa: 310,
      diff: 10,
      last10: '6-4',
      streak: 'L1',
      divisionKey: 'AFC-East'
    }
  ]

  const filteredTeams = standingsData.filter(
    t => t.divisionKey === `${selectedConference}-${selectedDivision}`
  )

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-4 flex flex-wrap gap-4">
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>
        <select
          value={selectedConference}
          onChange={e => setSelectedConference(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="AFC">AFC</option>
          <option value="NFC">NFC</option>
        </select>
        <select
          value={selectedDivision}
          onChange={e => setSelectedDivision(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="East">East</option>
          <option value="West">West</option>
          <option value="North">North</option>
          <option value="South">South</option>
        </select>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Rank</th>
              <th className="p-2">Team</th>
              <th className="p-2">Record</th>
              <th className="p-2">Win %</th>
              <th className="p-2">GB</th>
              <th className="p-2">Home</th>
              <th className="p-2">Away</th>
              <th className="p-2">Div</th>
              <th className="p-2">Conf</th>
              <th className="p-2">PF</th>
              <th className="p-2">PA</th>
              <th className="p-2">Diff</th>
              <th className="p-2">Last 10</th>
              <th className="p-2">Streak</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.map((team, index) => (
              <tr key={team.team} className="border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2 flex items-center gap-2">
                  <img src={team.logo} alt={team.team} className="w-6 h-6" />
                  {team.team}
                </td>
                <td className="p-2">{team.record}</td>
                <td className="p-2">{team.winPct.toFixed(3)}</td>
                <td className="p-2">{team.gb}</td>
                <td className="p-2">{team.home}</td>
                <td className="p-2">{team.away}</td>
                <td className="p-2">{team.division}</td>
                <td className="p-2">{team.conference}</td>
                <td className="p-2">{team.pf}</td>
                <td className="p-2">{team.pa}</td>
                <td className="p-2">{team.diff}</td>
                <td className="p-2">{team.last10}</td>
                <td className="p-2">{team.streak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-500 mt-4">Last updated: May 10, 2025</p>
    </div>
  )
}
