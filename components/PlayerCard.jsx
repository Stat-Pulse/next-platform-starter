export default function PlayerCard({ player }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-2xl font-semibold mb-2">{player.name}</h3>
      <p className="text-gray-600 mb-2">
        {player.position} | {player.team} | #{player.jersey}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Injury Status:</strong>{' '}
        <span className={player.injuryStatus === 'Healthy' ? 'text-green-600' : 'text-red-600'}>
          {player.injuryStatus}
        </span>
      </p>
    </div>
  )
}
