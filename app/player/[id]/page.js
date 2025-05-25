import Image from 'next/image';
import { notFound } from 'next/navigation';
import SeasonSelector from './SeasonSelector';
import ReceivingMetricsTable from '@/components/player/ReceivingMetricsTable';
import PlayerHeader from '@/components/player/PlayerHeader';

async function getPlayerData(playerId) {
  try {
    const url = `https://statpulseanalytics.netlify.app/api/player/${playerId}`; // ← hardcoded for now
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.error('Bad response:', res.status);
      return null;
    }
    const json = await res.json();
    console.log('Fetched player data:', json);
    return json;
  } catch (err) {
    console.error('Fetch failed:', err);
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