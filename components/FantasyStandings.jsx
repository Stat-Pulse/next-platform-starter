'use client'

import { useState } from 'react'

export default function FantasyStandings() {
  const [selectedLeague, setSelectedLeague] = useState('League 1')

  const leagues = ['League 1', 'League 2']

  const fantasyData = {
    'League 1': [
      {
        team: 'Burrow Bros',
        manager: 'Alex',
        record: '9-3',
        winPct: 0.750,
        pf: 1423,
        pa: 1301,
        streak: 'W2'
      },
      {
        team: 'Mahomes Magic',
        manager: 'Jordan',
        record: '8-4',
        winPct: 0.667,
        pf: 1378,
        pa: 1295,
        streak: 'L1'
      },
      {
        team: 'Allen Army',
        manager: 'Casey',
        record: '7-5',
        winPct: 0.583,
        pf: 1320,
        pa: 1330,
        streak: 'W1'
      }
    ],
    'League 2': [
      {
        team: 'CMC Crushers',
        manager: 'Taylor',
        record: '10-2',
        winPct: 0.833,
        pf: 1489,
        pa: 1264,
        streak: 'W4'
      },
      {
        team: 'Chase Catchers',
        manager: 'Morgan',
        record: '6-6',
        winPct: 0.500,
        pf: 1302,
        pa: 1315,
        streak: 'L2'
      }
    ]
  }

  const selectedData = fantasyData[selectedLeague]

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-4">
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          className="border p-2 rounded"
        >
          {leagues.map((league) => (
            <option key={league} value={league}>{league}</option>
          ))}
        </select>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Rank</th>
              <th className="p-2">Team</th>
              <th className="p-2">Manager</th>
              <th className="p-2">Record</th>
              <th className="p-2">Win %</th>
              <th className="p-2" title="Points For">PF ℹ️</th>
              <th className="p-2" title="Points Against">PA ℹ️</th>
              <th className="p-2" title="Point Differential = PF - PA">Diff ℹ️</th>
              <th className="p-2">Streak</th>
            </tr>
          </thead>
          <tbody>
            {selectedData
              .sort((a, b) => b.winPct - a.winPct)
              .map((team, index) => (
                <tr
                  key={team.team}
                  className={`border-b ${index < 4 ? 'bg-blue-50' : ''}`}
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{team.team}</td>
                  <td className="p-2">{team.manager}</td>
                  <td className="p-2">{team.record}</td>
                  <td className="p-2">{team.winPct.toFixed(3)}</td>
                  <td className="p-2">{team.pf}</td>
                  <td className="p-2">{team.pa}</td>
                  <td className="p-2">{team.pf - team.pa}</td>
                  <td className="p-2">{team.streak}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p><span className="inline-block w-3 h-3 bg-blue-400 mr-2 rounded-full"></span> = In Fantasy Playoff Position</p>
        <p className="mt-2">Last updated: May 10, 2025</p>
      </div>
    </div>
  )
}
