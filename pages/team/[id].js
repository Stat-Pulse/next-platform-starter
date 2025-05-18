// File: pages/team/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

const TEAM_MAP = {
  0: 'Unknown Team',
  KC: 'Kansas City Chiefs',
  BAL: 'Baltimore Ravens',
  SF: 'San Francisco 49ers',
  // Add more team mappings as needed
};

export default function TeamPage() {
  const router = useRouter();
  const { id } = router.query;
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady || !id) return;

    console.log("🔍 ID from router.query:", id);

    fetch(`/api/team/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setTeamData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading team data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [router.isReady, id]);

  if (loading) return <div className="p-6 text-center">Loading team data...</div>;
  if (error || !teamData) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  const {
    name,
    roster = [],
    depthChart = {},
    schedule = [],
    stats = {},
    branding = {},
    recentNews = [],
    division = 'Unknown',
    conference = 'Unknown',
  } = teamData;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const getOpponentName = (opponentId) => TEAM_MAP[opponentId] || `ID: ${opponentId}`;

  return (
    <>
      <Head><title>{name} - StatPulse</title></Head>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-6 mb-8 border-b pb-4" style={{ borderColor: branding?.colorPrimary }}>
          <Image src={branding?.logo || '/placeholder.png'} alt={name} width={100} height={100} className="rounded shadow" />
          <div>
            <h1 className="text-3xl font-bold" style={{ color: branding?.colorPrimary }}>{name}</h1>
            <p className="text-gray-600">{conference} | {division} Division</p>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Game Schedule</h2>
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
              {schedule.map((g, i) => (
                <tr key={i}>
                  <td className="border p-2 text-center">{g.week}</td>
                  <td className="border p-2 text-center">{getOpponentName(g.opponent)}</td>
                  <td className="border p-2 text-center">{formatDate(g.date)}</td>
                  <td className="border p-2 text-center">{g.homeAway}</td>
                  <td className="border p-2 text-center">{g.score}</td>
                  <td className="border p-2 text-center">{g.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Depth Chart</h2>
          {Object.entries(depthChart).map(([pos, players]) => (
            <div key={pos}>
              <h3 className="font-semibold text-gray-700">{pos}</h3>
              <ul className="ml-4 list-disc text-sm">
                {players.map((p, i) => (
                  <li key={i}>{p.name} <span className="text-gray-400">(Depth: {p.depth})</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Roster</h2>
          {roster.map((p) => (
            <div key={p.id} className="flex justify-between border-b py-1">
              <span>{p.name}</span>
              <span>{p.position}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
