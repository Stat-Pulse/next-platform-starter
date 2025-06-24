// components/CustomizeMetricsModal.jsx
/** @jsxImportSource react */
import React, { useState, useEffect } from 'react'
import Modal from './Modal'

interface CustomizeMetricsModalProps {
  isOpen: boolean;
  metrics: any;
  onChange: (updatedMetrics: any) => void;
  onClose: () => void;
}

export default function CustomizeMetricsModal({
  isOpen,
  metrics,
  onChange,
  onClose,
}: CustomizeMetricsModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Customize Metrics</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(metrics, null, 2)}
        </pre>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => onChange({ ...metrics })}
          >
            Save
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
