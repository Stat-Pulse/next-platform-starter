import React from 'react';

export default function PlayerPage(props) {
  const { player, receivingMetrics, advancedMetrics, advancedRushing } = props;

  if (!player) {
    return <div>Player not found.</div>;
  }

  return (
    <div>
      <h1>{player.name}</h1>
      {/* Render player info */}
      <section>
        <h2>Receiving Metrics</h2>
        {/* Render receivingMetrics */}
      </section>
      <section>
        <h2>Advanced Metrics</h2>
        {/* Render advancedMetrics */}
      </section>
      <section>
        <h2>Advanced Rushing</h2>
        {/* Render advancedRushing */}
      </section>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/player/${params.id}`);
  if (!res.ok) {
    return { notFound: true };
  }
  const data = await res.json();
  return { props: data };
}