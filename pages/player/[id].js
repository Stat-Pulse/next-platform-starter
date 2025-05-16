<section>
  <h2>Profile Details</h2>
  <ul>
    <li><strong>ID:</strong> {player.player_id}</li>
    <li><strong>Name:</strong> {player.player_name}</li>
    <li><strong>Position:</strong> {player.position || '—'}</li>
    <li><strong>College:</strong> {player.college || '—'}</li>
    <li><strong>Draft Year:</strong> {player.draft_year ?? '—'}</li>
    <li><strong>DOB:</strong> {player.date_of_birth || '—'}</li>
    <li><strong>Height:</strong> {player.height_inches ? `${player.height_inches}″` : '—'}</li>
    <li><strong>Weight:</strong> {player.weight ? `${player.weight} lb` : '—'}</li>
    <li><strong>Active:</strong> {player.is_active ? 'Yes' : 'No'}</li>
    <li><strong>Team:</strong> {player.team_id || '—'}</li>
  </ul>
</section>
