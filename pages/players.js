import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    async function fetchPlayers() {
      const res = await fetch('/.netlify/functions/getPlayers');
      const data = await res.json();
      setPlayers(data);
    }
    fetchPlayers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All NFL Players</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {players.map((player) => (
          <div
            key={player.player_id}
            className="border p-4 rounded shadow hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-semibold">{player.player_name}</h2>
            <p className="text-gray-600">{player.position} | {player.college}</p>
            <Link
              href={`/players/${player.player_id}`}
              className="text-blue-600 underline text-sm mt-2 inline-block"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
