export default function DemoPage({ params }) {
  console.error('DemoPage: Starting execution at', new Date().toISOString(), { demoId: params?.id });
  const demoId = params?.id;
  if (!demoId) {
    console.error('DemoPage: Missing demoId');
    return <div>Missing demo ID</div>;
  }
  console.error('DemoPage: Rendering', { demoId });
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Demo Page</h1>
      <p>Demo ID: {demoId}</p>
      <p>This is a test dynamic page outside /player/.</p>
    </main>
  );
}
