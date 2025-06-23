// pages/insights.js
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamically import to avoid SSR issues with Chart.js
const PlayerInsights = dynamic(() => import('../components/PlayerInsights'), { ssr: false });

export default function InsightsPage() {
  return (
    <>
      <Head>
        <title>Player Insights | StatPulse</title>
      </Head>
      <PlayerInsights playerId="1" />
    </>
  );
}