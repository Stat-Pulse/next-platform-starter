import React from "react";

export default function TradeCenterTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "newTrade", label: "New Trade" },
    { id: "pendingTrades", label: "Pending Trades" },
    { id: "tradeHistory", label: "Trade History" },
    { id: "tradeBlock", label: "Trade Block" },
    { id: "rules", label: "Rules" },
  ];

  return (
    <div className="flex space-x-4 border-b mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`pb-2 px-4 text-sm font-semibold ${
            activeTab === tab.id
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-600 hover:text-red-600"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
