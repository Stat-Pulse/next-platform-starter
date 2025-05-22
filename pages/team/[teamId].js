// pages/team/[teamId].js

import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TeamDepthChart from '@/components/team/TeamDepthChart';
import TeamStatsTable from '@/components/team/TeamStatsTable';
import TeamInjuries from '@/components/team/TeamInjuries';
import TeamSchedule from '@/components/team/TeamSchedule';

export default function TeamPage() {
  const router = useRouter();
  const { teamId } = router.query;

  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!teamId) return;

    async function fetchTeamData() {
      try {
        const res = await fetch(`/api/team/${teamId}`);
        if (!res.ok) throw new Error('Failed to fetch team data');
        const data = await res.json();
        setTeamData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamData();
  }, [teamId]);

  if (loading) return <p className="p-4 text-gray-500">Loading team data...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  if (!teamData) return <p className="p-4 text-gray-500">Team not found.</p>;

  const { team, depthChart, stats, injuries, schedule } = teamData;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Head>
        <title>{team.full_name} | Team Profile</title>
      </Head>

      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{team.full_name}</h1>
          <p className="text-gray-600">{team.conference} | {team.division}</p>
        </div>
        {team.logo && (
          <Image src={team.logo} alt={`${team.abbreviation} logo`} width={60} height={60} />
        )}
      </header>

      <section className="mb-10">
        <TeamDepthChart depthChart={depthChart} />
      </section>

      <section className="mb-10">
        <TeamStatsTable stats={stats} />
      </section>

      <section className="mb-10">
        <TeamInjuries injuries={injuries} />
      </section>

      <section>
        <TeamSchedule schedule={schedule} />
      </section>
    </div>
  );
}