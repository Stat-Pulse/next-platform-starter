// pages/player/[id].js
throw new Error('Force crash to prove route is loading');
export default function PlayerTestPage({ id }) {
  return (
    <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#fff' }}>
      <h1 style={{ fontSize: '2rem', color: 'green' }}>✅ Pages Router: Player Page Works</h1>
      <p>Player ID: {id}</p>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      id: params.id || 'UNKNOWN',
    },
  };
}
