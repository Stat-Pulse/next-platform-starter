export default function PlayerSelect({ selectedPlayer, setSelectedPlayer, view, setView }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
      <select
        className="p-2 border rounded-md"
        value={selectedPlayer}
        onChange={(e) => setSelectedPlayer(e.target.value)}
      >
        <option value="Joe Burrow">Joe Burrow (QB, Bengals)</option>
        <option value="Bijan Robinson">Bijan Robinson (RB, Falcons)</option>
        <option value="Saquon Barkley">Saquon Barkley (RB, Eagles)</option>
        <option value="Ja'Marr Chase">Ja'Marr Chase (WR, Bengals)</option>
        <option value="CeeDee Lamb">CeeDee Lamb (WR, Cowboys)</option>
        <option value="Jordan Love">Jordan Love (QB, Packers)</option>
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
