export default function TeamDepthChart({ depthChart }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Depth Chart</h2>
      {depthChart?.length > 0 ? (
        <ul>
          {depthChart.map((player, idx) => (
            <li key={idx}>
              {player.position}: {player.full_name} (Jersey: {player.jersey_number || 'N/A'})
            </li>
          ))}
        </ul>
      ) : (
        <p>No depth chart available.</p>
      )}
    </div>
  );
}