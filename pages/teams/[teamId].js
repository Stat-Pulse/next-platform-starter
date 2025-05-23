import { notFound } from 'next/navigation';

async function getTeamData(teamId) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/teams/${teamId}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching team data:', error);
    return null;
  }
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { teamId: 'kc' } }],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const teamData = await getTeamData(params.teamId);
  if (!teamData || !teamData.team) return { notFound: true };
  return { props: { teamData } };
}

export default function TeamPage({ teamData }) {
  return (
    <div>
      <h1>{teamData.team.team_name || 'Team Not Found'}</h1>
    </div>
  );
}
