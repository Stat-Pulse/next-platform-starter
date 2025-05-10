export default function PlayerSelect({ selectedPlayer, setSelectedPlayer, view, setView }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
      <select
        className="p-2 border rounded-md"
        value={selectedPlayer}
        onChange={(e) => setSelectedPlayer(e.target.value)}
      >
        <option value="Joe Burrow">Joe Burrow</option>
        <option value="Saquon Barkley">Saquon Barkley</option>
        <option value="Ja&#39;Marr Chase">Ja&#39;Marr Chase</option>
      </select>
      <div className="flex gap-2">
        <button
          className={`${view === 'betting' ? 'bg-red-600' : 'bg-gray-600'} text-white px-4 py-2 rounded-md text-sm`}
          onClick={() => setView('betting')}
        >
          Betting View
        </button>
        <button
          className={`${view === 'fantasy' ? 'bg-red-600' : 'bg-gray-600'} text-white px-4 py-2 rounded-md text-sm`}
          onClick={() => setView('fantasy')}
        >
          Fantasy View
        </button>
      </div>
    </div>
  )
}
