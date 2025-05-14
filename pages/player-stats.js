// File: pages/player-stats.js
import dynamic from 'next/dynamic';

// Dynamically load client-only component to avoid SSR errors with fetch
const PlayerStatsClient = dynamic(
  () => import('../components/fantasy/PlayerStatsClient'),
  { ssr: false }
);

export default function PlayerStatsPage() {
  return <PlayerStatsClient />;
}
