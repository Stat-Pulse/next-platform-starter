import Image from 'next/image';
import { notFound } from 'next/navigation';
import SeasonSelector from './SeasonSelector';
import ReceivingMetricsTable from '@/components/player/ReceivingMetricsTable';
import PlayerHeader from '@/components/player/PlayerHeader';

async function getPlayerData(playerId) {
  try {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/player/${playerId}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function PlayerProfilePage({ params }) {
  const playerId = params.id;
  const data = await getPlayerData(playerId);
  if (!data || !data.player) return notFound();

  // 🐛 DEBUGGING RENDER: Replace the full page temporarily
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">Loaded Player Page</h1>
      <p>ID: {playerId}</p>
      <pre className="text-left whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}