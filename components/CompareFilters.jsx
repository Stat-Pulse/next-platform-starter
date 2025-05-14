// File: components/CompareFilters.js

export default function CompareFilters({ metrics, onOpenCustomize, onSaveComparison, viewMode = 'weekly', onChangeViewMode }) {
  return (
    <div className="bg-white p-4 rounded shadow mt-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex gap-2 text-sm font-medium text-gray-700">
        <button
          onClick={() => onChangeViewMode('weekly')}
          className={`px-3 py-1 rounded ${viewMode === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Weekly
        </button>
        <button
          onClick={() => onChangeViewMode('season')}
          className={`px-3 py-1 rounded ${viewMode === 'season' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Season
        </button>
        <button
          onClick={() => onChangeViewMode('career')}
          className={`px-3 py-1 rounded ${viewMode === 'career' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Career
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={onOpenCustomize}
          className="text-blue-600 hover:underline"
        >
          Customize Metrics
        </button>

        <button
          onClick={onSaveComparison}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Comparison
        </button>
      </div>
    </div>
  )
}