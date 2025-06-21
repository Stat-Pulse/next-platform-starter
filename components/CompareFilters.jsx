// components/CompareFilters.jsx
import React from 'react'

export default function CompareFilters({ metrics, onOpenCustomize, onSaveComparison }) {
  return (
    <div>
      <button onClick={onOpenCustomize}>Customize Metrics</button>
      <button onClick={onSaveComparison}>Save Comparison</button>
    </div>
  );
}

