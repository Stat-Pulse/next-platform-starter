import React from 'react';

export default function ScoringToggle({ format, setFormat }) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <span className="text-sm font-medium text-gray-700">Scoring Format:</span>
      <button
        onClick={() => setFormat('std')}
        className={`px-3 py-1 rounded-md text-sm font-semibold ${
          format === 'std' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        Standard
      </button>
      <button
        onClick={() => setFormat('half')}
        className={`px-3 py-1 rounded-md text-sm font-semibold ${
          format === 'half' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        Half-PPR
      </button>
      <button
        onClick={() => setFormat('ppr')}
        className={`px-3 py-1 rounded-md text-sm font-semibold ${
          format === 'ppr' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        PPR
      </button>
    </div>
  );
}
