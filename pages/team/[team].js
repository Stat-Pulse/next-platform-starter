// File: pages/team/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

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
    abbreviation,
    division,
    conference,
    branding,
    roster,
    depthChart,
    schedule,
    stats,
    recentNews,
  } = teamData;

  return (
    <>
      <Head><title>{name} - StatPulse</title></Head>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          {branding.logo && (
            <Image
              src={branding.logo}
              alt={name}
              width={100}
              height={100}
              className="rounded shadow"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{name}</h1>
            <p className="text-gray-600">{conference} - {division}</p>
          </div>
        </div>

        {/* News */}
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

        {/* Upcoming/Recent Games */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Recent & Upcoming Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedule.slice(0, 2).map((game, i) => (
              <Link href={`/game/${game.gameId}`} key={i}>
                <div className="p-4 border rounded bg-gray-50 hover:bg-white cursor-pointer">
                  <p className="font-semibold">Week {game.week}: vs {game.opponent}</p>
                  <p className="text-sm">{game.date} | {game.homeAway === 'H' ? 'Home' : 'Away'}</p>
                  <p className="text-sm">{game.score} {game.result && `(${game.result})`}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Full Schedule */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Full Schedule</h2>
          <table className="w-full text-sm border-collapse">
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
              {schedule.map((game, i) => (
                <tr key={i} className="hover:bg-gray-50">
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

        {/* Roster */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Roster</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Position</th>
                <th className="border p-2">Experience</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border p-2">
                    <Link href={`/player/${p.id}`} className="flex items-center space-x-2 text-blue-600 hover:underline">
                      {p.headshot_url && (
                        <img src={p.headshot_url} alt="headshot" className="w-6 h-6 rounded-full" />
                      )}
                      <span>{p.name}</span>
                    </Link>
                  </td>
                  <td className="border p-2 text-center">{p.position}</td>
                  <td className="border p-2 text-center">{p.years_exp} yr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Team Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>Points Allowed: <strong>{stats.pointsAllowed}</strong></div>
            <div>Yards Allowed: <strong>{stats.totalYardsAllowed}</strong></div>
            <div>Passing Yards Allowed: <strong>{stats.passYardsAllowed}</strong></div>
            <div>Rushing Yards Allowed: <strong>{stats.rushYardsAllowed}</strong></div>
            <div>Sacks: <strong>{stats.sacks}</strong></div>
            <div>Turnovers: <strong>{stats.turnovers}</strong></div>
            <div>Red Zone % Allowed: <strong>{stats.redZonePct}%</strong></div>
            <div>3rd Down % Allowed: <strong>{stats.thirdDownPct}%</strong></div>
            <div>EPA/Play Allowed: <strong>{stats.epaPerPlayAllowed}</strong></div>
            <div>DVOA Rank: <strong>{stats.dvoaRank}</strong></div>
          </div>
        </div>
      </div>
    </>
  );
}
