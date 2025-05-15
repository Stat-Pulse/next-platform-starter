// pages/draft-review.js

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TeamSidebar from '../components/TeamSidebar';

export default function DraftReview() {
  const [teamName, setTeamName] = useState('Thunder Cats');
  const [draftGrade, setDraftGrade] = useState('A-');
  const [analysis, setAnalysis] = useState(
    'Strong QB and RB picks, but consider adding WR depth in future drafts.'
  );
  const [picks, setPicks] = useState([
    {
      round: 1,
      player: 'Patrick Mahomes',
      position: 'QB',
      nflTeam: 'KC',
      grade: 'A'
    },
    {
      round: 2,
      player: 'Derrick Henry',
      position: 'RB',
      nflTeam: 'BAL',
      grade: 'A-'
    }
    // Add more picks dynamically
  ]);

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Header />
      <main className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <TeamSidebar active="Draft Review" />

        <div className="md:col-span-3 space-y-6">
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Draft Review - {teamName}
            </h2>
            <div className="mb-4">
              <p className="text-lg font-medium">
                Overall Draft Grade: <span className="text-red-600">{draftGrade}</span>
              </p>
              <p className="text-gray-600">Analysis: {analysis}</p>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">Round</th>
                  <th className="px-4 py-2">Player</th>
                  <th className="px-4 py-2">Position</th>
                  <th className="px-4 py-2">Team</th>
                  <th className="px-4 py-2">Grade</th>
                </tr>
              </thead>
              <tbody>
                {picks.map((pick, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2">{pick.round}</td>
                    <td className="px-4 py-2">{pick.player}</td>
                    <td className="px-4 py-2">{pick.position}</td>
                    <td className="px-4 py-2">{pick.nflTeam}</td>
                    <td className="px-4 py-2 text-red-600">{pick.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-4 text-gray-600">
              Pick Commentary: Mahomes in Round 1: Elite QB secured, great value.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
