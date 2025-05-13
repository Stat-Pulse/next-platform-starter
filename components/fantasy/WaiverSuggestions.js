// components/fantasy/WaiverSuggestions.js
export default function WaiverSuggestions({ suggestions }) {
  if (!suggestions || !suggestions.length) return null;

  return (
    <div className="space-y-4">
      {suggestions.map((player, index) => (
        <div key={index} className="p-4 bg-gray-50 rounded-md">
          <p className="font-semibold">{player.name} ({player.position})</p>
          <p className="text-sm text-gray-600">Team: {player.team} | Projected: {player.projected.toFixed(1)} pts</p>
          <p className="text-sm text-gray-600">Reason: {player.reason}</p>
          <button
            className="add-player bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 mt-2"
            data-player={player.name}
            onClick={() => alert(`Added ${player.name} to your team!`)}
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
}
