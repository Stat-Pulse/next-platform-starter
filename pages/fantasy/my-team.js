// pages/my-team.js
'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeamSidebar from '@/components/TeamSidebar';

export default function MyTeamPage() {
  const [roster, setRoster] = useState([]);
  const [showStarters, setShowStarters] = useState(true);
  const [trashTalk, setTrashTalk] = useState([]);
  const [trashInput, setTrashInput] = useState('');
  const [weeklyScores, setWeeklyScores] = useState([]);
  const [playerNews, setPlayerNews] = useState([]);

  useEffect(() => {
    import('../public/data/myTeamData.json').then((data) => {
      setRoster(data.roster);
      setWeeklyScores(data.weeklyScores);
      setPlayerNews(data.playerNews);
      setTrashTalk(data.trashTalk);
    });
  }, []);

  const handlePostTrashTalk = () => {
    if (trashInput.trim()) {
      setTrashTalk([...trashTalk, { user: 'You', comment: trashInput }]);
      setTrashInput('');
    }
  };

  const starters = roster.filter(p => p.starter);
  const bench = roster.filter(p => !p.starter);
  const topPlayers = [...roster].sort((a, b) => b.seasonPoints - a.seasonPoints).slice(0, 3);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="bg-white rounded-lg shadow p-6">
            <TeamSidebar active="my-team" />
          </aside>

          <div className="md:col-span-3 space-y-6">
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">My Team - Thunder Cats</h2>

              {/* Team Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <p>Record: <span className="font-semibold">6-3</span></p>
                <p>Rank: <span className="font-semibold">3rd</span></p>
                <p>Points For: <span className="font-semibold">1125.8</span></p>
                <p>Points Against: <span className="font-semibold">990.2</span></p>
              </div>
            </section>

            {/* Roster */}
            <section className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Roster</h3>
                <div className="space-x-2">
                  <button onClick={() => setShowStarters(true)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Starters</button>
                  <button onClick={() => setShowStarters(false)} className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm">Bench</button>
                </div>
              </div>
              <ul className="space-y-2">
                {(showStarters ? starters : bench).map((p, i) => (
                  <li key={i} className="border p-3 rounded-md text-sm">
                    <p className="font-semibold">{p.name} ({p.position})</p>
                    <p className="text-gray-600">{p.team} | {p.opponent}</p>
                    <p className="text-gray-600">Points: {p.points} (Proj: {p.projected})</p>
                    {p.injury && <p className="text-xs text-red-600">Injury: {p.injury}</p>}
                  </li>
                ))}
              </ul>
            </section>

            {/* Top Performers */}
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-2">Top Performers</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {topPlayers.map((p, i) => (
                  <li key={i}>{p.name} ({p.position}): {p.seasonPoints.toFixed(1)} pts</li>
                ))}
              </ul>
            </section>

            {/* Player News */}
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-2">Player News</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {playerNews.map((n, i) => (
                  <li key={i}>{n.player}: {n.news}</li>
                ))}
              </ul>
            </section>

            {/* Trash Talk */}
            <section className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-2">Trash Talk</h3>
              <textarea value={trashInput} onChange={e => setTrashInput(e.target.value)} placeholder="Leave a comment..." className="w-full border p-2 rounded mb-2" />
              <button onClick={handlePostTrashTalk} className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700">Post</button>
              <ul className="mt-4 space-y-1 text-sm text-gray-600">
                {trashTalk.map((t, i) => (
                  <li key={i}><span className="font-semibold">{t.user}:</span> {t.comment}</li>
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
