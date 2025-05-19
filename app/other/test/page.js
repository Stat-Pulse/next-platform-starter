export default function OtherTestPage() {
  console.error('OtherTestPage: Rendering other test page at', new Date().toISOString());
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Other Test Page</h1>
      <p>This is a test page under /other/ to verify routing.</p>
    </main>
  );
}
