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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Fantasy Dashboard - Week 10</h1>

        <section className="bg-white rounded-lg shadow p-6 mb-6">
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

        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Recent Activity</h2>
          <ul className="space-y-1">
            {recentActivity.map((item, index) => (
              <li key={index} className="text-sm text-gray-600">
                {item.date}: {item.description}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-lg shadow p-6 mb-6">
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

        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">League Transactions</h2>
          <ul className="space-y-1">
            {transactions.map((t, index) => (
              <li key={index} className="text-sm text-gray-600">
                {t.date}: {t.type === 'Trade' ? `${t.teams[0]} traded ${t.exchanged[t.teams[0]]} to ${t.teams[1]} for ${t.exchanged[t.teams[1]]}` : `${t.team} ${t.type.toLowerCase()}ed ${t.player}`}
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
