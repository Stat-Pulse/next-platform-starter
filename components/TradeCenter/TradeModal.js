// File: components/TradeCenter/TradeModals.js
import React from "react";

// TradeModal component
export function TradeModal({ show, onClose, onReview, partner, setPartner, offer, setOffer, request, setRequest, message, setMessage, partners, yourAssets, partnerAssets }) {
  return (
    <div className={`modal ${show ? "block" : "hidden"}`}>
      <div className="modal-content">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">New Trade Proposal</h3>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Trading Partner</label>
          <select className="w-full border rounded-md p-2 text-sm" value={partner} onChange={(e) => setPartner(e.target.value)}>
            <option value="">Select Team</option>
            {partners.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Your Offer</h4>
            <select multiple className="w-full border rounded-md p-2 text-sm h-32" value={offer} onChange={(e) => setOffer(Array.from(e.target.selectedOptions, o => o.value))}>
              {yourAssets.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Request</h4>
            <select multiple className="w-full border rounded-md p-2 text-sm h-32" value={request} onChange={(e) => setRequest(Array.from(e.target.selectedOptions, o => o.value))}>
              {partnerAssets.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Message</label>
          <textarea className="w-full border rounded-md p-2 text-sm" placeholder="Explain your trade..." value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700">Cancel</button>
          <button onClick={onReview} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">Review</button>
        </div>
      </div>
    </div>
  );
}

// ReviewTradeModal component
export function ReviewTradeModal({ show, onEdit, onSend, tradeSummary }) {
  const { partner, offer, request, message } = tradeSummary;
  return (
    <div className={`modal ${show ? "block" : "hidden"}`}>
      <div className="modal-content">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Trade Proposal</h3>
        <p className="text-sm text-gray-600 mb-2">To: {partner}</p>
        <p className="text-sm text-gray-600 mb-2">You Offer: {offer.join(", ")}</p>
        <p className="text-sm text-gray-600 mb-2">You Request: {request.join(", ")}</p>
        <p className="text-sm text-gray-600 mb-2">Message: {message || "None"}</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onEdit} className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700">Edit</button>
          <button onClick={onSend} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">Send</button>
        </div>
      </div>
    </div>
  );
}
