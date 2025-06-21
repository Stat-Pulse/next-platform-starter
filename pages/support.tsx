"use client"; // This component needs client-side interactivity

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import Header from '../components/Header';
import Footer from '../components/Footer';
import SectionWrapper from '../components/SectionWrapper';
import { SupportAccordion } from '../components/SupportAccordion';
import ContactForm from '../components/ContactForm';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  category: string;
  items: FaqItem[];
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function SupportPage() {
  const faqs: FaqCategory[] = [
    {
      category: 'Account Management',
      items: [
        {
          question: 'How do I create an account?',
          answer: 'Click &quot;Sign Up&quot; on the navigation bar, fill in your details, and confirm your email address to get started.',
        },
        {
          question: 'How do I reset my password?',
          answer: 'Click &quot;Forgot Password&quot; on the login page, enter your registered email, and follow the link sent to reset your password securely.',
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Go to your Dashboard, click &quot;Profile Settings,&quot; and you can update your personal information, preferences, and notification settings there.',
        },
      ],
    },
    {
      category: 'App Features',
      items: [
        {
          question: 'How do I use the Stat Tracker?',
          answer: 'Navigate to the &quot;Stats&quot; page from the main menu, select a player or team, and view real-time performance metrics. You can customize filters for specific stats and timeframes.',
        },
        {
          question: 'Can I compare multiple players or teams?',
          answer: 'Yes, on the &quot;Insights&quot; or &quot;Compare&quot; page, you can select up to three players or two teams to perform a head-to-head statistical comparison across various metrics.',
        },
        {
          question: 'How do I access game predictions?',
          answer: 'Visit the &quot;Insights&quot; section, where you&apos;ll find upcoming game matchups and our predictive analytics. You can also submit your own predictions.',
        },
      ],
    },
    {
      category: 'Data & Stats',
      items: [
        {
          question: 'Why are some stats not updating?',
          answer: 'Ensure your app is updated to the latest version and check your internet connection. Stats may also lag during periods of high server load. Please refer to our System Status page for live updates on data feeds.',
        },
        {
          question: 'What is the source of your data?',
          answer: 'Our data is compiled from official league sources and reputable sports analytics providers, ensuring accuracy and timeliness.',
        },
        {
          question: 'How often is the data updated?',
          answer: 'Live game data is updated in real-time or with minimal delay. Historical data and player profiles are updated regularly, typically within hours of game completion.',
        },
      ],
    },
    {
      category: 'Technical Issues',
      items: [
        {
          question: 'Why is the app not loading or crashing?',
          answer: 'Try clearing your browser&apos;s cache and cookies, updating your browser to the latest version, or switching to a different network. If the issue persists, please contact our support team with details about your device and browser.',
        },
        {
          question: 'I&apos;m experiencing slow performance, what can I do?',
          answer: 'Ensure you have a stable internet connection. Large datasets might take a moment to load; optimizing your filters or viewing a smaller scope of data can improve performance. Check our System Status for server performance.',
        },
        {
          question: 'How do I report a bug?',
          answer: 'Please use the &quot;Contact Us&quot; form below and select &quot;Bug Report&quot; as the subject. Provide as much detail as possible, including steps to reproduce the issue, your device, and browser information. Screenshots are very helpful!',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 via-gray-600 to-gray-300 text-gray-800 flex flex-col font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-10">
        <motion.h1
          className="text-4xl sm:text-5xl font-bold tracking-tight text-silver-500 text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Support Center
        </motion.h1>

        <SectionWrapper title="Search Bar">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search FAQs, guides, or support topics..."
              className="w-full p-4 rounded-lg bg-gray-200 text-gray-800 border border-silver-400 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-600 pl-12 shadow-md"
              aria-label="Search support topics"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </SectionWrapper>

        <SectionWrapper title="Frequently Asked Questions">
          <div className="space-y-6">
            {faqs.map((category, catIndex) => (
              <motion.div
                key={catIndex}
                className="bg-gray-100 p-6 rounded-lg shadow-lg border border-silver-300"
                initial="hidden"
                whileInView="visible"
                variants={sectionVariants}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-red-600 mb-4">{category.category}</h3>
                <SupportAccordion items={category.items} />
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper title="User Guides">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg border border-silver-300 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Getting Started with StatPulse</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-1">
                <li>Create an account via the <Link href="/signup" className="text-red-500 hover:underline">Sign Up</Link> page.</li>
                <li>Explore the <Link href="/stats" className="text-red-500 hover:underline">Stats</Link> page to view real-time QB analytics and player data.</li>
                <li>Customize your experience and manage preferences in the <Link href="/dashboard" className="text-red-500 hover:underline">Dashboard</Link> section.</li>
                <li>Dive into <Link href="/insights" className="text-red-500 hover:underline">Game Insights</Link> for predictions and head-to-head comparisons.</li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mastering the Stat Tracker</h3>
              <p className="text-gray-700">
                The Stat Tracker is your most powerful tool. Select any player from the &quot;Stats&quot; page, then apply detailed filters for metrics like passing yards, completion percentage, or touchdowns. You can save your preferred filters for quick access to your most frequently tracked stats. For advanced analysis, use the compare feature to pit players against each other.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Understanding Game Predictions</h3>
              <p className="text-gray-700">
                Our prediction models analyze historical data, team performance, and player form to generate probabilities for upcoming matchups. You can view these predictions on the &quot;Insights&quot; page and even contribute your own picks to see how they align with the community and our algorithms.
              </p>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper title="Troubleshooting Common Issues">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg border border-silver-300">
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>
                <strong>App not loading or displaying correctly:</strong> First, try a hard refresh (Ctrl+F5 or Cmd+Shift+R). If that doesn&apos;t work, clear your browser&apos;s cache and cookies. Ensure your browser is updated. You can also try a different web browser to rule out browser-specific issues.
              </li>
              <li>
                <strong>Login or account access issues:</strong> Double-check your email and password for typos. If you&apos;ve forgotten your password, use the &quot;Forgot Password&quot; link on the login screen. If you&apos;re still locked out, our support team can assist.
              </li>
              <li>
                <strong>Data not updating or inaccurate:</strong> Verify your internet connection is stable. During peak times, there might be a slight delay in real-time data feeds. Please check our dedicated{' '}
                <Link href="/status" className="text-red-500 hover:underline font-semibold">System Status</Link> page for any known service interruptions or maintenance.
              </li>
              <li>
                <strong>Slow performance or lag:</strong> While our platform is optimized for speed, heavy data queries or a large number of active users can sometimes cause minor delays. Try narrowing your search filters or refreshing the page. Consider checking your network speed as well.
              </li>
            </ul>
          </div>
        </SectionWrapper>

        <SectionWrapper title="Contact Our Support Team">
          <ContactForm />
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg border border-silver-300 mt-6 text-gray-700 space-y-2">
            <p>
              Email: <a href="mailto:support@statpulse.com" className="text-red-500 hover:underline font-semibold">support@statpulse.com</a>
            </p>
            <p>
              Follow us on{' '}
              <a href="https://twitter.com/StatPulseNFL" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline font-semibold">
                X (formerly Twitter)
              </a>
              : @StatPulseNFL
            </p>
            <p>
              Community Forum: <Link href="/forum" className="text-red-500 hover:underline font-semibold">Join our vibrant community</Link> for peer support and discussions.
            </p>
            <div className="mt-4 pt-4 border-t border-silver-300">
              <p className="font-semibold text-gray-900">Support Hours: 9 AM–5 PM EST, Monday–Friday</p>
              <p>Expected Response Time: 24–48 hours (during business days)</p>
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper title="Important Links">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              className="bg-gray-100 p-6 rounded-lg shadow-lg border border-silver-300"
              initial="hidden"
              whileInView="visible"
              variants={sectionVariants}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">System Status</h3>
              <p className="text-gray-700">
                Stay informed about the current operational status of our services, including data feeds and server performance.
                Check our dedicated{' '}
                <Link href="/status" className="text-red-500 hover:underline font-semibold">System Status Page</Link> for real-time updates.
              </p>
            </motion.div>
            <motion.div
              className="bg-gray-100 p-6 rounded-lg shadow-lg border border-silver-300"
              initial="hidden"
              whileInView="visible"
              variants={sectionVariants}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">Legal & Privacy</h3>
              <p className="text-gray-700">
                Understand your rights and our responsibilities.
              </p>
              <ul className="mt-2 space-y-1">
                <li>
                  <Link href="/terms" className="text-red-500 hover:underline font-semibold">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-red-500 hover:underline font-semibold">Privacy Policy</Link>
                </li>
              </ul>
            </motion.div>
          </div>
        </SectionWrapper>
      </main>

      <Footer />
    </div>
  );
}
