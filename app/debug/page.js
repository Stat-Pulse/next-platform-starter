export default function DebugPage() {
  console.error('DebugPage: Rendering debug page at', new Date().toISOString());
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Debug Page</h1>
      <p>This is a top-level debug page to test routing.</p>
    </main>
  );
}
