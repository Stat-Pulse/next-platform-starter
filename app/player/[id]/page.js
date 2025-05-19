export default function PlayerPage({ params }) {
  console.error('PlayerPage: Starting execution at', new Date().toISOString(), { playerId: params?.id });
  const playerId = params?.id;
  if (!playerId) {
    console.error('PlayerPage: Missing playerId');
    return <div>Missing player ID</div>;
  }
  console.error('PlayerPage: Rendering', { playerId });
  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ fontWeight: 'bold', color: 'darkred' }}>Player Page</h1>
      <p>Player ID: {playerId}</p>
      <p>This is a simplified page without database access.</p>
    </main>
  );
}
