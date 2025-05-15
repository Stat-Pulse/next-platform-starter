import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    async function fetchPlayers() {
      const res = await fetch('/.netlify/functions/getPlayers');
      const data = await res.json();
      setPlayers(data);
    }
    fetchPlayers();
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    const results = players.filter((p) =>
      p.player_name.toLowerCase().includes(q)
    );
    setFiltered(results);
  }, [query, players]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Find a Player</h1>
      <input
        type="text"
        placeholder="Search by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-md mb-6 p-2 border rounded"
      />

      {filtered.length === 0 && query ? (
        <p>No players found matching &quot;{query}&quot;</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.map((player) => (
            <div
              key={player.player_id}
              className="border p-4 rounded shadow hover:bg-gray-100 transition"
            >
              <h2 className="text-xl font-semibold">{player.player_name}</h2>
              <p className="text-sm text-gray-600">{player.position} | {player.college}</p>
              <Link href={`/players/${player.player_id}`} className="text-blue-600 underline text-sm">
                View Profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
