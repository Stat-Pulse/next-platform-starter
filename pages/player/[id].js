import Head from 'next/head';

export default function PlayerProfilePage({ player }) {
  if (!player) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'red' }}>
        <h1>❌ Player not found</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <Head>
        <title>{player.player_name} | StatPulse</title>
      </Head>
      <h1 style={{ fontSize: '2rem', color: 'green' }}>
        ✅ Loaded: {player.player_name}
      </h1>
      <p>Team: {player.team_abbr}</p>
      <p>Position: {player.position}</p>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const playerId = params.id;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://statpulseanalytics.netlify.app';
    const res = await fetch(`${baseUrl}/api/player/${playerId}`);
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();

    return {
      props: {
        player: data.player || null,
      },
    };
  } catch (error) {
    console.error('Error loading player data:', error);
    return {
      props: {
        player: null,
      },
    };
  }
}
