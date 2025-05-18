// pages/team/[team].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

const TEAM_MAP = {
  KC: 'Kansas City Chiefs',
  BAL: 'Baltimore Ravens',
  SF: 'San Francisco 49ers',
  // ...extend as needed
};

export default function TeamPage() {
  const router = useRouter();
  const { team } = router.query;
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady || !team) return;

    fetch(`/api/team/${team}`)
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
  }, [router.isReady, team]);

  if (loading) return <div className="p-6 text-center">Loading team data...</div>;
  if (error || !teamData) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  const {
    name,
    branding,
    conference,
    division,
    roster = [],
    depthChart = {},
    schedule = [],
    stats = {},
    recentNews = []
  } = teamData;

  const formatDate = date => new Date(date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });

  const calculateRecord = () => {
    const wins = schedule.filter(g => g.result === 'W').length;
    const losses = schedule.filter(g => g.result === 'L').length;
    const ties = schedule.filter(g => g.result === 'T').length;
    return ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`;
  };

  return (
    <>
      <Head>
        <title>{name} - StatPulse</title>
      </Head>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-6 mb-8 border-b pb-4" style={{ borderColor: branding?.colorPrimary || '#ccc' }}>
          <Image src={branding?.logo || '/placeholder.png'} alt={name} width={100} height={100} className="rounded shadow" />
          <div>
            <h1 className="text-3xl font-bold" style={{ color: branding?.colorPrimary }}>{name}</h1>
            <p className="text-gray-600">{conference} | {division} Division</p>
            <p className="text-lg font-semibold mt-1">Record: {calculateRecord()}</p>
          </div>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2" style={{ color: branding?.colorPrimary }}>Game Schedule</h2>
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
                  <td className="border p-2 text-center">{TEAM_MAP[g.opponent] || g.opponent}</td>
                  <td className="border p-2 text-center">{formatDate(g.date)}</td>
                  <td className="border p-2 text-center">{g.homeAway}</td>
                  <td className="border p-2 text-center">{g.score}</td>
                  <td className="border p-2 text-center">{g.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2" style={{ color: branding?.colorPrimary }}>Depth Chart</h2>
          {Object.entries(depthChart).map(([pos, players]) => (
            <div key={pos} className="mb-3">
              <h3 className="text-lg font-bold">{pos}</h3>
              <ul className="ml-4 list-disc text-sm">
                {players.map((p, i) => (
                  <li key={i}>{p.name} <span className="text-gray-400">(Depth: {p.depth})</span></li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Roster</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-right">Position</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((player, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 text-left">{player.name}</td>
                  <td className="p-2 text-right">{player.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Defensive Stats (2024)</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Points Allowed:</strong> {stats.pointsAllowed || '-'}</div>
            <div><strong>Total Yards Allowed:</strong> {stats.totalYardsAllowed || '-'}</div>
            <div><strong>Pass Yards Allowed:</strong> {stats.passYardsAllowed || '-'}</div>
            <div><strong>Rush Yards Allowed:</strong> {stats.rushYardsAllowed || '-'}</div>
            <div><strong>Sacks:</strong> {stats.sacks || '-'}</div>
            <div><strong>Turnovers:</strong> {stats.turnovers || '-'}</div>
            <div><strong>Red Zone %:</strong> {stats.redZonePct || '-'}</div>
            <div><strong>3rd Down %:</strong> {stats.thirdDownPct || '-'}</div>
          </div>
        </section>
      </div>
    </>
  );
}