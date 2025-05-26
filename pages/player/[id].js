// pages/player/[id].js

export default function PlayerProfilePage({ id }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'green' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>✅ Pages Router Working!</h1>
      <p>Player ID: {id}</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  return {
    props: {
      id,
    },
  };
}
