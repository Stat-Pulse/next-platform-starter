import { useState } from 'react';
import { motion } from 'framer-motion';
import Chart from 'chart.js/auto'; // Ensure Chart.js is installed

const TeamProfiles = ({ teamsData }) => {
  const [expandedTeam, setExpandedTeam] = useState(null);
  const [season, setSeason] = useState(2024);

  const toggleExpand = (teamId) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  const createChart = (canvasId, data) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Wins', 'Losses', 'Ties'],
        datasets: [{
          label: 'Record',
          data: [data.wins, data.losses, data.ties],
          backgroundColor: ['#4caf50', '#f44336', '#ffeb3b'],
        }],
      },
      options: { responsive: true, plugins: { legend: { position: 'top' } } },
    });
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-teal-800 p-6 rounded-xl border border-gold-300">
      <h2 className="text-2xl font-bold text-teal-300 mb-4">Team Profiles</h2>
      <select
        value={season}
        onChange={(e) => setSeason(e.target.value)}
        className="mb-4 p-2 rounded-lg bg-gray-800 text-teal-200 border border-teal-500"
      >
        <option value={2024}>2024</option>
        <option value={2023}>2023</option>
      </select>
      <div className="space-y-4">
        {teamsData.map((team) => (
          <motion.div
            key={team.team_id}
            className="bg-teal-900/50 p-4 rounded-lg shadow-lg border border-teal-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(team.team_id)}
            >
              <div className="flex items-center gap-2">
                <span className="text-gold-300 font-semibold">{team.team_abbr}</span>
                <span className="text-white font-bold">{team.team_name}</span>
              </div>
              <span className="text-teal-200">{`${team.wins}-${team.losses}-${team.ties}`}</span>
            </div>
            <AnimatePresence>
              {expandedTeam === team.team_id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 text-sm text-gray-300 space-y-2"
                >
                  <canvas id={`chart-${team.team_id}`} className="w-full h-40" />
                  <p>Points For: {team.points_for}</p>
                  <p>Points Against: {team.points_against}</p>
                  <p>Differential: {team.points_for - team.points_against}</p>
                  {useEffect(() => createChart(`chart-${team.team_id}`, team), [team])}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 text-sm text-teal-200">
        <p>Last updated: June 22, 2025</p>
      </div>
    </div>
  );
};

export default TeamProfiles;