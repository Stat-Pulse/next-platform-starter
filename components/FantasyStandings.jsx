
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants for cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const FantasyStandings = ({ standingsData }) => {
  const [expandedTeam, setExpandedTeam] = useState(null);

  // Sort by total points by default
  const sortedData = [...standingsData].sort((a, b) => b.totalPoints - a.totalPoints);

  const toggleExpand = (teamName) => {
    setExpandedTeam(expandedTeam === teamName ? null : teamName);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-teal-800 p-6 rounded-xl border border-teal-500">
      <h2 className="text-2xl font-bold text-teal-300 mb-4">Fantasy Standings</h2>
      <div className="space-y-4">
        {sortedData.map((team, index) => (
          <motion.div
            key={team.teamName}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-teal-900/50 p-4 rounded-lg shadow-lg border border-teal-400"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(team.teamName)}
            >
              <div className="flex items-center gap-2">
                <span className="text-gold-300 font-semibold">{index + 1}.</span>
                <span className="text-white font-bold">{team.teamName}</span>
              </div>
              <div className="text-teal-200">
                Points: {team.totalPoints.toFixed(2)} | Streak: {team.streak}
              </div>
            </div>
            <AnimatePresence>
              {expandedTeam === team.teamName && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 text-sm text-gray-300 space-y-1"
                >
                  <p>Wins: {team.wins}</p>
                  <p>Losses: {team.losses}</p>
                  <p>Ties: {team.ties}</p>
                  <p>Win %: {team.winPct.toFixed(3)}</p>
                  <p>Streak: {team.streak}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 text-sm text-teal-200">
        <p>Last updated: June 21, 2025</p>
      </div>
    </div>
  );
};

export default FantasyStandings;

