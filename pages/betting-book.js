//pages/betting-book.js
'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import SidebarNavigation from '../components/SidebarNavigation.tsx';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────────────────────────────────────
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeInOut' },
  },
};

export default function BettingBook() {
  // ────────── Mock data (replace later) ──────────
  const keyGames = [
    {
      matchup: 'Chiefs @ Bengals',
      spread: 'KC -3.5',
      total: 'O/U 48.5',
      kickoff: 'May 15, 2025 – 4:25 PM EST',
    },
    {
      matchup: 'Cowboys @ Eagles',
      spread: 'PHI -2.0',
      total: 'O/U 46.0',
      kickoff: 'May 15, 2025 – 8:20 PM EST',
    },
  ];

  const lineMovements = [
    { game: 'Bills @ Jets', opened: 'BUF -1.0', current: 'BUF +1.5', change: '+2.5' },
    { game: '49ers @ Rams', opened: 'SF -3.0', current: 'SF -1.0', change: '+2.0' },
  ];

  const bettingTrends = [
    { team: 'Packers', ats: '10-5-1', overUnder: '8-8', bestBet: 'At Home (6-1 ATS)' },
    { team: 'Dolphins', ats: '11-6', overUnder: '12-5', bestBet: 'Overs (12-5)' },
  ];

  return (
    <>
      <Header />

      <main
        className="relative min-h-screen py-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200,32,32,.88), rgba(255,213,102,.88))",
          backgroundBlendMode: 'overlay',
        }}
      >
        {/* Beige overlay behind content for warmth */}
        <div className="absolute inset-0 bg-beige-100 z-0" />

        <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ────────── Sidebar ────────── */}
          <aside className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-beige-200 rounded-xl shadow-md border border-burnt-orange-300 sticky top-24 p-6"
            >
              {/* Ensure this route exists in your nav array */}
              <SidebarNavigation active="betting-book" />
            </motion.div>
          </aside>

          {/* ────────── Main Column ────────── */}
          <div className="space-y-12 md:col-span-3">
            {/* Page header */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              variants={sectionVariants}
              viewport={{ once: true }}
            >
              <h1 className="text-4xl font-serif italic font-bold text-burnt-orange-600 mb-2">
                Betting Book
              </h1>
              <p className="text-lg text-beige-50">
                Track NFL betting movements and trends.
              </p>
            </motion.section>

            {/* Key Games */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              variants={sectionVariants}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-semibold text-burnt-orange-500 mb-4">
                📌 Week&nbsp;1 Key Games &amp; Odds
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {keyGames.map((game) => (
                  <motion.div
                    key={game.matchup}
                    className="bg-beige-200 p-6 rounded-lg shadow-lg border border-burnt-orange-300 hover:bg-beige-300 transition-colors duration-300"
                    initial={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-xl font-bold italic text-gray-800 mb-1">
                      {game.matchup}
                    </h3>
                    <p className="text-sm text-gray-700">
                      Spread:&nbsp;
                      <span className="text-red-600 font-semibold">{game.spread}</span>
                    </p>
                    <p className="text-sm text-gray-700">Total: {game.total}</p>
                    <p className="text-sm text-gray-600">Kickoff: {game.kickoff}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Line movements */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              variants={sectionVariants}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-semibold text-burnt-orange-500 mb-4">
                📈 Line Movements
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full rounded-lg shadow overflow-hidden text-sm bg-beige-100">
                  <thead className="bg-burnt-orange-600 text-white">
                    <tr>
                      {['Game', 'Opening Line', 'Current Line', 'Movement'].map((h) => (
                        <th key={h} className="p-3 text-left font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lineMovements.map((line) => (
                      <tr
                        key={line.game}
                        className="border-t border-beige-300 hover:bg-beige-200"
                      >
                        <td className="p-3 text-gray-800 whitespace-nowrap">{line.game}</td>
                        <td className="p-3 text-gray-800 whitespace-nowrap">{line.opened}</td>
                        <td className="p-3 text-gray-800 whitespace-nowrap">{line.current}</td>
                        <td className="p-3 font-semibold text-red-600 whitespace-nowrap">
                          {line.change}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>

            {/* Betting trends */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              variants={sectionVariants}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-semibold text-burnt-orange-500 mb-4">
                📊 Team Betting Trends
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {bettingTrends.map((team) => (
                  <motion.div
                    key={team.team}
                    className="bg-burnt-orange-100 p-6 rounded-lg shadow-lg border border-beige-300 hover:bg-burnt-orange-200 transition-colors duration-300"
                    initial={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="text-xl font-bold italic text-gray-800 mb-1">
                      {team.team}
                    </h3>
                    <p className="text-sm text-gray-700">
                      ATS:&nbsp;<strong>{team.ats}</strong>
                    </p>
                    <p className="text-sm text-gray-700">Over/Under: {team.overUnder}</p>
                    <p className="text-sm text-gray-600">Best Bet Angle: {team.bestBet}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Learn more */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              variants={sectionVariants}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-semibold text-burnt-orange-500 mt-8">
                📚 Learn More
              </h2>
              <p className="inline-block bg-beige-100 px-4 py-3 rounded-md shadow text-sm text-gray-700 mt-2">
                Check back soon for guides on interpreting betting lines, odds calculators, and links to recommended sportsbooks.
              </p>
            </motion.section>
          </div>{/* end main col */}
        </div>{/* end container grid */}
      </main>

      <Footer />
    </>
  );
}

