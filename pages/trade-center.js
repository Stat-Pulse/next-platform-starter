// pages/trade-center.js

import { useState, useEffect } from 'react';
import LeagueLayout from '@/components/LeagueLayout';
import TradeCenterTabs from '@/components/trade/TradeCenterTabs';
import TradeModal from '@/components/trade/TradeModal';
import ReviewTradeModal from '@/components/trade/ReviewTradeModal';

export default function TradeCenterPage() {
  const [activeTab, setActiveTab] = useState('new');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [teams, setTeams] = useState([]);
  const [pendingTrades, setPendingTrades] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [rejectedTrades, setRejectedTrades] = useState([]);
  const [tradeBlock, setTradeBlock] = useState([]);
  const [activeTrade, setActiveTrade] = useState(null);

  useEffect(() => {
    // Load mock data here or fetch from API
    import('@/data/mockTradeData.json').then((mod) => {
      setTeams(mod.teams);
      setPendingTrades(mod.pendingTrades);
      setTradeHistory(mod.tradeHistory);
      setRejectedTrades(mod.rejectedTrades);
      setTradeBlock(mod.tradeBlock);
    });
  }, []);

  const openTradeModal = (trade = null) => {
    setActiveTrade(trade);
    setShowTradeModal(true);
  };

  const openReviewModal = () => {
    setShowReviewModal(true);
  };

  const closeModals = () => {
    setShowTradeModal(false);
    setShowReviewModal(false);
    setActiveTrade(null);
  };

  return (
    <LeagueLayout title="Trade Center">
      <div className="space-y-6">
        <TradeCenterTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onStartTrade={openTradeModal}
          teams={teams}
          pendingTrades={pendingTrades}
          tradeHistory={tradeHistory}
          rejectedTrades={rejectedTrades}
          tradeBlock={tradeBlock}
          setPendingTrades={setPendingTrades}
          setTradeHistory={setTradeHistory}
          setRejectedTrades={setRejectedTrades}
          setTradeBlock={setTradeBlock}
          setActiveTrade={setActiveTrade}
          openTradeModal={openTradeModal}
        />

        {showTradeModal && (
          <TradeModal
            teams={teams}
            activeTrade={activeTrade}
            onClose={closeModals}
            onReview={openReviewModal}
          />
        )}

        {showReviewModal && (
          <ReviewTradeModal
            trade={activeTrade}
            onSend={() => {
              setPendingTrades((prev) => [...prev, activeTrade]);
              closeModals();
            }}
            onEdit={() => {
              setShowReviewModal(false);
              setShowTradeModal(true);
            }}
            onCancel={closeModals}
          />
        )}
      </div>
    </LeagueLayout>
  );
}
