import { useEffect, useState } from 'react';

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
      <h1 className="text-2xl font-bold mb-4">All Players</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {players.map((player) => (
          <div key={player.player_id} className="border p-4 rounded shadow">
            <h2 className="font-semibold">{player.player_name}</h2>
            <p>Position: {player.position}</p>
            <p>Team: {player.team}</p>
            <p>Age: {player.age}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
