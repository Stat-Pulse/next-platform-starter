// pages/fantasy.js
'use client'

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function FantasyPage() {
  const [teams, setTeams] = useState([]);
  const [recentActivity, setActivity] = useState([]);
  const [waiverWire, setWaiverWire] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch('/data/sampleFantasyData.json')
      .then(res => res.json())
      .then(data => {
        setTeams(data.teams);
        setActivity(data.recentActivity);
        setWaiverWire(data.waiverWire);
        setTransactions(data.transactions);
      })
      .catch(err => console.error('Failed to load fantasy data:', err));
  }, []);

  const userTeam = teams.find(t => t.name === 'Thunder Cats') || {};

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="bg-white rounded-lg shadow p-6 space-y-2">
            <ul className="space-y-2">
              <li><a href="/fantasy" className="block p-2 rounded text-red-600 bg-gray-100 font-semibold">Dashboard</a></li>
              <li><a href="/my-team" className="block p-2 rounded hover:text-red-600 hover:bg-gray-100">My Team</a></li>
              <li><a href="/current-matchup" className="block p-2 rounded hover:text-red-600 hover:bg-gray-100">Current Matchup</a></li>
              <li><a href="/live-scoring" className="block p-2 rounded hover:text-red-600 hover:bg-gray-100">Live Scoring</a></li>
              <li><a href="/league-schedule" className="block p-2 rounded hover:text-red-600 hover:bg-gray-100">League Schedule</a></li>
              <li><a href="/player-stats" className="block p-2 rounded hover:text-red-600 hover:bg-gray-100">Player Stats</a></li>
              <li><a href="/free-agent-listings" className="block p-2 rounded hover:text-red-600 hover:bg-gray-100">Free Agents</a></li>
              <li><a href="/trade-center" className="block p-2 rounded hover:text-red-600 hover:bg-gray-100">Trade Center</a></li>
              <li><a href="/draft-review" className="block p-2 rounded hover:text-red-600 hover:bg-gray-100">Draft Review</a></li>
            </ul>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Fantasy Dashboard - Week 10</h1>

            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Team Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-semibold">Record</p>
                  <p className="text-sm text-gray-600">{userTeam.record || '--'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Rank</p>
                  <p className="text-sm text-gray-600">{userTeam.rank || '--'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Points Scored</p>
                  <p className="text-sm text-gray-600">{userTeam.pointsScored || '--'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Points Against</p>
                  <p className="text-sm text-gray-600">{userTeam.pointsAgainst || '--'}</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Recent Activity</h2>
              <ul className="space-y-1">
                {recentActivity.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {item.date}: {item.description}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Waiver Wire Suggestions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {waiverWire.map((player, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-md">
                    <p className="font-semibold">{player.name} ({player.position})</p>
                    <p className="text-sm text-gray-600">{player.team} - {player.projected} pts</p>
                    <p className="text-sm text-gray-500">{player.reason}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">League Transactions</h2>
              <ul className="space-y-1">
                {transactions.map((t, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {t.date}: {t.type === 'Trade' ? `${t.teams[0]} traded ${t.exchanged[t.teams[0]]} to ${t.teams[1]} for ${t.exchanged[t.teams[1]]}` : `${t.team} ${t.type.toLowerCase()}ed ${t.player}`}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
