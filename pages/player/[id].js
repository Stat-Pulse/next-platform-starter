export default function PlayerTestPage({ id }) {
  return (
    <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#fff' }}>
      <h1 style={{ fontSize: '2rem', color: 'green' }}>✅ Player Page Rendering</h1>
      <p style={{ marginTop: '1rem' }}>Player ID: {id}</p>
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
