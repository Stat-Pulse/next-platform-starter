import React from "react";

export default function ReviewTradeModal({ show, onEdit, onSend, tradeSummary }) {
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
          <button
            onClick={onEdit}
            className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700"
          >
            Edit
          </button>
          <button
            onClick={onSend}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
