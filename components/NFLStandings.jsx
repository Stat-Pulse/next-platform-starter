import { motion } from 'framer-motion';

// Animation variants for table rows
const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const NFLStandings = ({ standingsData }) => {
  // Sort by win percentage by default
  const sortedData = [...standingsData].sort((a, b) => b.winPct - a.winPct);

  return (
    <div className="bg-gray-900/80 p-6 rounded-xl border border-gold-500">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-white">
          <thead className="bg-blue-900 text-gold-300">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3">Team</th>
              <th className="p-3">W</th>
              <th className="p-3">L</th>
              <th className="p-3">T</th>
              <th className="p-3">Win %</th>
              <th className="p-3">Home</th>
              <th className="p-3">Away</th>
              <th className="p-3">Div</th>
              <th className="p-3">Conf</th>
              <th className="p-3">PF</th>
              <th className="p-3">PA</th>
              <th className="p-3">Diff</th>
              <th className="p-3">Streak</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((team, index) => (
              <motion.tr
                key={team.team}
                custom={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className={`border-b border-gold-300 ${index < 2 ? 'bg-blue-800/50' : ''} hover:bg-blue-700/50 transition-colors duration-200`}
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3 flex items-center gap-2">
                  <img src={team.logo} alt={`${team.team} logo`} className="w-6 h-6" />
                  {team.team}
                </td>
                <td className="p-3">{team.record.split('-')[0]}</td>
                <td className="p-3">{team.record.split('-')[1]}</td>
                <td className="p-3">{team.record.split('-')[2] || '0'}</td>
                <td className="p-3">{team.winPct.toFixed(3)}</td>
                <td className="p-3">{team.home}</td>
                <td className="p-3">{team.away}</td>
                <td className="p-3">{team.division}</td>
                <td className="p-3">{team.conference}</td>
                <td className="p-3">{team.pf}</td>
                <td className="p-3">{team.pa}</td>
                <td className="p-3">{team.diff}</td>
                <td className="p-3">{team.streak}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-400">
        <p>
          <span className="inline-block w-3 h-3 bg-gold-500 mr-2 rounded-full"></span> = In Playoff Position
        </p>
        <p>Last updated: June 21, 2025</p>
      </div>
    </div>
  );
};

export default NFLStandings;