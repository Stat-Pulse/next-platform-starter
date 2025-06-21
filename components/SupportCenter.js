//components/SupportCenter.js

import React from 'react';

const SupportCenter = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF4136]/10 via-[#1A1A1D] to-[#1A1A1D] p-6">
      <div className="bg-[url('/path-to-futuristic-pattern.jpg')] bg-cover bg-center opacity-10 absolute inset-0 z-0"></div>
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-white text-center mb-6">Support Center</h1>
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Search Bar</h2>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search FAQs, guides, or support topics..."
              className="w-full p-3 bg-gray-800 text-gray-300 rounded-lg border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="p-2">
              <h3 className="text-lg font-medium text-red-500 mb-1">Account Management</h3>
              <div className="space-y-2">
                {['Question 1', 'Question 2', 'Question 3'].map((q, index) => (
                  <div key={index} className="flex items-center justify-between border border-gray-300 p-2 rounded">
                    <input type="text" placeholder={q} className="w-full bg-transparent border-none focus:outline-none" />
                    <button className="text-red-500 hover:text-red-700">+</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;
