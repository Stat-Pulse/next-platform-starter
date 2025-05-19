export default function PlayerTestPage() {
  console.error('PlayerTestPage: Rendering test player page at', new Date().toISOString());
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Player Test Page</h1>
      <p>This is a test player page without database access.</p>
    </main>
  );
}
