// pages/player/[id].js
export default function PlayerProfilePage({ id }) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'green' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
        ✅ Player page rendering with ID
      </h1>
      <p style={{ marginTop: '1rem' }}>{id}</p>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  console.log('Rendering player page for:', id);

  return {
    props: {
      id,
    },
  };
}
