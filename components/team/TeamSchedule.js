export default function TeamSchedule({ schedule }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Schedule</h2>
      {schedule?.length > 0 ? (
        <ul>
          {schedule.map((game, idx) => (
            <li key={idx}>
              {new Date(game.game_date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}, {game.game_time?.slice(0, 5) || 'N/A'}: {game.home_team_id} vs {game.away_team_id} at {game.stadium_name || 'N/A'}
              {game.is_final ? ` (Final: ${game.home_score} - ${game.away_score})` : ' (Upcoming)'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No games scheduled.</p>
      )}
    </div>
  );
}