export default function TeamStatsTable({ detailedStats }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Team Stats</h2>
      {detailedStats?.total_passing_yards !== undefined ? (
        <div>
          <p>Total Passing Yards: {detailedStats.total_passing_yards || 0}</p>
          <p>Total Rushing Yards: {detailedStats.total_rushing_yards || 0}</p>
          <p>Total Receiving Yards: {detailedStats.total_receiving_yards || 0}</p>
        </div>
      ) : (
        <p>No stats available.</p>
      )}
    </div>
  );
}