// pages/trade-center.js
import React from 'react';
import TradeTabs from '../components/TradeCenter/TradeTabs';
import TradeModals from '../components/TradeCenter/TradeModals';
import TradeContent from '../components/TradeCenter/TradeContent';

export default function TradeCenterPage() {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Page content wrapped for layout consistency */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="bg-white rounded-lg shadow p-6">
            {/* You can move this sidebar into a layout if it’s used elsewhere */}
            <ul className="space-y-2 text-sm font-medium">
              <li><a href="/fantasy" className="text-gray-800 hover:text-red-600">Dashboard</a></li>
              <li><a href="/my-team" className="text-gray-800 hover:text-red-600">My Team</a></li>
              <li><a href="/current-matchup" className="text-gray-800 hover:text-red-600">Current Matchup</a></li>
              <li><a href="/live-scoring" className="text-gray-800 hover:text-red-600">Live Scoring</a></li>
              <li><a href="/league-schedule" className="text-gray-800 hover:text-red-600">League Schedule</a></li>
              <li><a href="/player-stats" className="text-gray-800 hover:text-red-600">Player Stats</a></li>
              <li><a href="/free-agent-listings" className="text-gray-800 hover:text-red-600">Free Agent Listings</a></li>
              <li><a href="/trade-center" className="text-red-600 font-semibold bg-gray-100 rounded p-2">Trade Center</a></li>
              <li><a href="/draft-review" className="text-gray-800 hover:text-red-600">Draft Review</a></li>
            </ul>
          </aside>

          {/* Trade Center Content */}
          <div className="md:col-span-3 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Trade Center</h2>
            <TradeTabs />
            <TradeContent />
          </div>
        </div>
      </main>

      {/* Modals for Trade Proposals */}
      <TradeModals />
    </div>
  );
}
