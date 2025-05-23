export default function TeamInjuries({ injuries }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Injuries</h2>
      {injuries?.length > 0 ? (
        <ul>
          {injuries.map((injury, idx) => (
            <li key={idx}>
              {injury.full_name} ({injury.position}): {injury.report_primary_injury || 'N/A'}, Status: {injury.report_status || 'N/A'}, Last Updated: {new Date(injury.date_modified).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No injuries reported.</p>
      )}
    </div>
  );
}