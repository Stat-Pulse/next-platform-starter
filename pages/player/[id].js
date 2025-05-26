import Head from 'next/head';
import PlayerHeader from '@/components/player/PlayerHeader';

export default function PlayerProfilePage({ player }) {
  if (!player) {
    return (
      <div className="p-10 text-center text-red-600">
        <h1>❌ Player not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <Head>
        <title>{player.player_name} | StatPulse</title>
      </Head>

      {/* ✅ Reusing your existing PlayerHeader */}
      <PlayerHeader player={player} />
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
