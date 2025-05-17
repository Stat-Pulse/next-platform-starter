// File: pages/team/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function TeamPage() {
  const router = useRouter();
  const { id } = router.query;
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/team/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setTeamData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading team data...</div>;
  if (error || !teamData) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  const {
    name,
    logo,
    city,
    stadium,
    about,
    coach,
    roster,
    depthChart,
    seasonGames,
    stats,
    recentNews,
    socialMedia,
  } = teamData;

  return (
    <>
      <Head><title>{name} - StatPulse</title></Head>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex items-center gap-6 mb-8">
          <Image src={logo} alt={name} width={100} height={100} className="rounded shadow" />
          <div>
            <h1 className="text-3xl font-bold">{name}</h1>
            <p className="text-gray-600">{city} | {stadium.name} ({stadium.capacity} seats)</p>
            <p className="text-sm text-gray-500">Head Coach: {coach}</p>
          </div>
        </div>

        {/* News Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Latest News</h2>
          <div className="space-y-2">
            {recentNews.map((news, i) => (
              <div key={i} className="border p-3 rounded shadow-sm bg-white">
                <p className="font-semibold">{news.title}</p>
                <p className="text-xs text-gray-500">{news.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming/Recent Game Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Recent & Upcoming Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seasonGames.slice(0, 2).map((game, i) => (
              <div key={i} className="p-4 border rounded bg-gray-50">
                <p className="font-semibold">Week {game.week}: vs {game.opponent}</p>
                <p className="text-sm">{game.date} | {game.homeAway === 'H' ? 'Home' : 'Away'}</p>
                <p className="text-sm">{game.score} ({game.result})</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full Schedule */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Full Schedule</h2>
          <table className="w-full text-sm table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Week</th>
                <th className="border p-2">Opponent</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Home/Away</th>
                <th className="border p-2">Score</th>
                <th className="border p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {seasonGames.map((game, i) => (
                <tr key={i}>
                  <td className="border p-2 text-center">{game.week}</td>
                  <td className="border p-2 text-center">{game.opponent}</td>
                  <td className="border p-2 text-center">{game.date}</td>
                  <td className="border p-2 text-center">{game.homeAway}</td>
                  <td className="border p-2 text-center">{game.score}</td>
                  <td className="border p-2 text-center">{game.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Roster Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Roster</h2>
          <table className="w-full text-sm table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Position</th>
                <th className="border p-2">Active</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((p, i) => (
                <tr key={i}>
                  <td className="border p-2 text-blue-600 hover:underline cursor-pointer" onClick={() => router.push(`/player/${p.id}`)}>{p.name}</td>
                  <td className="border p-2 text-center">{p.position}</td>
                  <td className="border p-2 text-center">{p.isActive ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Team Stats</h2>
          <p>Total Points Scored: <span className="font-semibold">{stats.totalPoints}</span></p>
        </div>
      </div>
    </>
  );
}
