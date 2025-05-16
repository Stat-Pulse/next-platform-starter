import React, { useState } from 'react';
import TradeTabs from '@/components/TradeCenter/TradeTabs';
import { TradeModal, ReviewTradeModal } from '@/components/TradeCenter/TradeModals';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeamSidebar from '@/components/TeamSidebar';

export default function TradeCenterPage() {
  const [activeTab, setActiveTab] = useState('newTrade');
  const [showModal, setShowModal] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const [partner, setPartner] = useState('');
  const [offer, setOffer] = useState([]);
  const [request, setRequest] = useState([]);
  const [message, setMessage] = useState('');

  const yourAssets = ['Patrick Mahomes', '2026 1st'];
  const allPartners = ['Gridiron Gurus', 'Touchdown Titans', 'Pigskin Pros'];
  const partnerAssets = ['Josh Allen', '2026 2nd'];

  const handleReview = () => setShowReview(true);
  const handleSend = () => {
    console.log('Trade sent:', { partner, offer, request, message });
    setShowReview(false);
    setShowModal(false);
    resetForm();
  };
  const handleEdit = () => {
    setShowReview(false);
    setShowModal(true);
  };
  const resetForm = () => {
    setPartner('');
    setOffer([]);
    setRequest([]);
    setMessage('');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'newTrade':
        return (
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
            >
              Start Trade
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Initiate a trade with another team by selecting players and picks.
            </p>
          </div>
        );
      case 'pendingTrades':
        return <p className="text-gray-600">Pending trades list will be here.</p>;
      case 'tradeHistory':
        return <p className="text-gray-600">Accepted & rejected trades history will be here.</p>;
      case 'tradeBlock':
        return <p className="text-gray-600">Manage your trade block players here.</p>;
      case 'rules':
        return (
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>Trade Deadline:</strong> November 20, 2025</li>
            <li><strong>Review Period:</strong> 24 hours for league vote</li>
            <li><strong>Commissioner Override:</strong> Possible in case of collusion</li>
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <main className="container mx-auto px-6 py-8">
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Trade Center</h2>
        <TradeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderTabContent()}
      </section>

      {/* Trade Creation Modal */}
      <TradeModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onReview={handleReview}
        partner={partner}
        setPartner={setPartner}
        offer={offer}
        setOffer={setOffer}
        request={request}
        setRequest={setRequest}
        message={message}
        setMessage={setMessage}
        partners={allPartners}
        yourAssets={yourAssets}
        partnerAssets={partnerAssets}
      />

      {/* Review Modal */}
      <ReviewTradeModal
        show={showReview}
        onEdit={handleEdit}
        onSend={handleSend}
        tradeSummary={{ partner, offer, request, message }}
      />
    </main>
  );
}
