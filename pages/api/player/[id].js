import fetch from 'node-fetch';

export default function PlayerPage({ player, receivingMetrics }) {
  if (!player) {
    return <div>Player not found</div>;
  }

  return (
    <div>
      <h1>{player.player_name}</h1>
      <p>Position: {player.position}</p>
      <p>Team: {player.team_abbr}</p>
      {/* Render additional player info and receiving metrics as needed */}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SITE_URL}/api/player/${params.id}`);
  if (!res.ok) {
    return { notFound: true };
  }
  const data = await res.json();
  return { props: data };
}
