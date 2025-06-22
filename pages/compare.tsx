// File: pages/compare.tsx
"use client";

import { useState } from "react";
import CompareSearch from "../components/CompareSearch";
import CompareFilters from "../components/CompareFilters";
import CustomizeMetricsModal from "../components/CustomizeMetricsModal"; // Default import
import ComparisonSections from "../components/ComparisonSections";

export default function Compare() {
  const [selectedPlayers, setSelectedPlayers] = useState([
    "00-0023459", // Example: Aaron Rodgers
    "00-0033873", // Example: Josh Allen
  ]);
  const [metrics, setMetrics] = useState([
    "tds",
    "passYards",
    "rushYards",
    "receivingYards",
  ]);
  const [viewMode, setViewMode] = useState("career");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comparisonMode, setComparisonMode] = useState("players");

  const handleUpdateSelection = (newSelection: string[], mode: string) => {
    setSelectedPlayers(newSelection);
    setComparisonMode(mode);
  };

  return (
    <>
      <main className="bg-gray-100 py-6">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Compare {comparisonMode === "players" ? "Players" : "Teams"}
          </h2>

          <CompareSearch
            selectedPlayers={selectedPlayers}
            onUpdate={handleUpdateSelection}
          />

          <CompareFilters
            metrics={metrics}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            onOpenCustomize={() => setIsModalOpen(true)}
            onSaveComparison={() => {}}
          />

          <CustomizeMetricsModal
            isOpen={isModalOpen}
            metrics={metrics}
            onChange={setMetrics}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </main>

      <ComparisonSections
        players={selectedPlayers}
        metrics={metrics}
        viewMode={viewMode}
        comparisonMode={comparisonMode}
      />
    </>
  );
}
