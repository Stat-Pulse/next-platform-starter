// pages/fantasy.js
'use client'

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TeamSummary from '../components/fantasy/TeamSummary';
import RecentActivity from '../components/fantasy/RecentActivity';
import Notifications from '../components/fantasy/Notifications';
import Matchup from '../components/fantasy/Matchup';
import StandingsTable from '../components/fantasy/StandingsTable';
import WaiverSuggestions from '../components/fantasy/WaiverSuggestions';
import Transactions from '../components/fantasy/Transactions';

export default function FantasyPage() {
  const [teams, setTeams] = useState([]);
  const [activity, setActivity] = useState([]);
  const [waiverWire, setWaiverWire] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Simulate fetching data (will eventually be fetched from backend or API)
    import('../public/data/sampleFantasyData.json').then(data => {
      setTeams(data.teams);
      setActivity(data.recentActivity);
      setWaiverWire(data.waiverWire);
      setTransactions(data.transactions);
    });
  }, []);

  const userTeam = teams.find(t => t.name === 'Thunder Cats');
  const opponentTeam = teams.find(t => t.name === 'Gridiron Gurus');

  return (
    <>
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Placeholder */}
          <aside className="bg-white rounded-lg shadow p-6 hidden md:block">
            <p className="text-gray-600">Sidebar goes here...</p>
          </aside>

          {/* Main Fantasy Dashboard */}
          <div className="md:col-span-3 space-y-6">
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Fantasy Dashboard - Week 10</h2>
              <p className="text-sm text-gray-600 mb-4">November 7 - 11, 2025</p>
              {userTeam && <TeamSummary team={userTeam} />}
              <RecentActivity data={activity} />
              {userTeam && <Notifications roster={userTeam.roster} />}
              {userTeam && opponentTeam && <Matchup userTeam={userTeam} opponentTeam={opponentTeam} />}
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">League Standings</h3>
              <StandingsTable teams={teams} userTeamName={userTeam?.name} />
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Waiver Wire Suggestions</h3>
              <WaiverSuggestions suggestions={waiverWire} />
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Recent League Transactions</h3>
              <Transactions transactions={transactions} />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
