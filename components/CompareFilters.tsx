/** @jsxImportSource react */
import React from 'react';

interface CompareFiltersProps {
  metrics: any;
  viewMode: string;
  onChangeViewMode: (view: string) => void;
  onOpenCustomize: () => void;
  onSaveComparison: () => void;
}

export default function CompareFilters({
  metrics,
  viewMode,
  onChangeViewMode,
  onOpenCustomize,
  onSaveComparison,
}: CompareFiltersProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-gray-700">
        Current view mode: <strong>{viewMode}</strong>
      </div>
      <div className="flex gap-3">
        <button onClick={onOpenCustomize} className="px-3 py-1 bg-blue-600 text-white rounded">Customize</button>
        <button onClick={onSaveComparison} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
      </div>
    </div>
  );
}