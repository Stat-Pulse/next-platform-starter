// pages/player/[id].js

export default function PlayerProfilePage({ id }) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'green' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
        ✅ Pages Router Working with Dynamic ID
      </h1>
      <p>Player ID: {id}</p>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  console.log('Rendering /player/[id] for:', id);

  return {
    props: {
      id,
    },
  };
}
