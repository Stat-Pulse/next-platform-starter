import React from 'react';

export default function FantasyNews({ news }) {
  if (!news || news.length === 0) {
    return (
      <div className="bg-white p-4 rounded-md shadow text-sm text-gray-500">
        No fantasy news available.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md p-4 shadow mb-6">
      <h3 className="text-lg font-semibold mb-3">Fantasy News & Impact</h3>
      <ul className="space-y-3 text-sm text-gray-700">
        {news.map((item, index) => (
          <li key={index} className="border-b pb-2">
            <p className="font-medium">{item.headline}</p>
            <p className="text-gray-600">{item.analysis}</p>
            <p className="text-xs text-gray-400 mt-1">{item.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
