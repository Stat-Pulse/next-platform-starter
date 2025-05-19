export default function TestPage() {
  console.log('TestPage: Rendering test page at', new Date().toISOString());
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Test Page</h1>
      <p>This is a test page to verify logging.</p>
    </main>
  );
}
