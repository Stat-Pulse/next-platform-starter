//components/SupportAccordion.js

import SupportAccordion from './SupportAccordion';
import { motion } from 'framer-motion';

const SupportCenter = () => {
  const faqItems = [
    { question: 'How do I manage my account?', answer: 'You can manage your account settings under the Profile section by clicking on your avatar.' },
    { question: 'What is the subscription cost?', answer: 'Visit our pricing page for details on subscription plans.' },
    { question: 'How do I contact support?', answer: 'Use the contact form available in the footer or email us at support@statpulse.com.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF4136]/10 via-[#1A1A1D] to-[#1A1A1D] p-4">
      <div className="bg-[url('/futuristic-pattern.jpg')] bg-cover bg-center opacity-10 absolute inset-0 z-0"></div>
      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-white text-center mb-6"
        >
          Support Center
        </motion.h1>
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Search Bar</h2>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search FAQs, guides, or support topics..."
              className="w-full p-2 bg-gray-800 text-gray-300 rounded-lg border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <SupportAccordion items={faqItems} />
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;