// pages/current-matchup.js
'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TeamSidebar from '../components/TeamSidebar';

export default function CurrentMatchup() {
  const [teams, setTeams] = useState([]);
  const [yourTeam, setYourTeam] = useState(null);
  const [opponentTeam, setOpponentTeam] = useState(null);

  useEffect(() => {
    fetch('/data/currentMatchup.json')
      .then(res => res.json())
      .then(data => {
        setTeams(data);
        const team1 = data.find(t => t.name === 'Thunder Cats');
        const team2 = data.find(t => t.name === 'Gridiron Gurus');
        setYourTeam(team1);
        setOpponentTeam(team2);
      });
  }, []);

  if (!yourTeam || !opponentTeam) return <div className="p-8">Loading matchup...</div>;

  const calculateScoreDiff = () => {
    const diff = yourTeam.score - opponentTeam.score;
    return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}`;
  };

  const renderPlayers = (players, isBench = false, isUser = false) => (
    players.map(player => {
      const statusClass = player.injury ? 'bg-red-100 text-red-700' : player.bye ? 'bg-yellow-100 text-yellow-700' : player.projected >= 20 ? 'bg-green-100 border-l-4 border-green-400' : '';
      const breakdown = Object.entries(player.breakdown || {}).map(([k, v]) => `${k}: ${v}`).join(', ');
      return (
        <tr key={player.name} className={statusClass}>
          <td className="p-2">{player.position}</td>
          <td className="p-2">{player.name} ({player.team}){player.injury && <span className="ml-2 text-xs">Injury: {player.injury}</span>}</td>
          <td className="p-2">{player.opponent}</td>
          <td className="p-2">{player.status}</td>
          <td className="p-2">{player.points.toFixed(1)}</td>
          {!isBench && isUser && <td className="p-2">{player.status === 'Pre-Game' && !player.bye && <button className="text-sm px-2 py-1 rounded bg-red-600 text-white">Change</button>}</td>}
        </tr>
      );
    })
  );

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside>
            <TeamSidebar activePage="Current Matchup" />
          </aside>

          <div className="md:col-span-3 space-y-6">
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-2">Current Matchup - Week 10</h2>
              <p className="text-sm text-gray-600 mb-4">November 7 - 11, 2025</p>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <img src={yourTeam.logo} alt="Your team" className="h-12 w-12 rounded-full mx-auto" />
                  <p className="font-bold">{yourTeam.name}</p>
                  <p className="text-sm">{yourTeam.record} | Proj: {yourTeam.projected}</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold">{yourTeam.score.toFixed(1)}</span>
                  <p className="text-sm">vs</p>
                  <span className="text-2xl font-bold">{opponentTeam.score.toFixed(1)}</span>
                </div>
                <div className="text-center">
                  <img src={opponentTeam.logo} alt="Opponent team" className="h-12 w-12 rounded-full mx-auto" />
                  <p className="font-bold">{opponentTeam.name}</p>
                  <p className="text-sm">{opponentTeam.record} | Proj: {opponentTeam.projected}</p>
                </div>
              </div>
              <p className={`text-sm text-center mt-4 font-semibold ${yourTeam.score - opponentTeam.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>Score Differential: {calculateScoreDiff()}</p>
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Your Team: {yourTeam.name}</h3>
              <table className="w-full text-sm mb-4">
                <thead><tr className="bg-gray-100"><th className="p-2">Position</th><th className="p-2">Player</th><th className="p-2">Game</th><th className="p-2">Status</th><th className="p-2">Points</th><th className="p-2">Actions</th></tr></thead>
                <tbody>{renderPlayers(yourTeam.roster, false, true)}</tbody>
              </table>
              <h4 className="font-semibold mb-2">Bench</h4>
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-100"><th className="p-2">Position</th><th className="p-2">Player</th><th className="p-2">Game</th><th className="p-2">Status</th><th className="p-2">Points</th></tr></thead>
                <tbody>{renderPlayers(yourTeam.bench, true)}</tbody>
              </table>
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Opponent: {opponentTeam.name}</h3>
              <table className="w-full text-sm mb-4">
                <thead><tr className="bg-gray-100"><th className="p-2">Position</th><th className="p-2">Player</th><th className="p-2">Game</th><th className="p-2">Status</th><th className="p-2">Points</th></tr></thead>
                <tbody>{renderPlayers(opponentTeam.roster)}</tbody>
              </table>
              <h4 className="font-semibold mb-2">Bench</h4>
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-100"><th className="p-2">Position</th><th className="p-2">Player</th><th className="p-2">Game</th><th className="p-2">Status</th><th className="p-2">Points</th></tr></thead>
                <tbody>{renderPlayers(opponentTeam.bench, true)}</tbody>
              </table>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
