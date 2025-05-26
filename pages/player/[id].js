// pages/player/[id].js
import { useRouter } from 'next/router';

export default function PlayerProfilePage({ id }) {
  return (
    <div className="p-10 text-center text-green-600">
      <h1 className="text-3xl font-bold">✅ Pages Router Works!</h1>
      <p>Player ID: {id}</p>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      id: params.id,
    },
  };
}
