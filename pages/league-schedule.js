// pages/league-schedule.js

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeamSidebar from '@/components/TeamSidebar';
import html2pdf from 'html2pdf.js';

export default function LeagueSchedulePage() {
  const [currentSeason, setCurrentSeason] = useState('2025');
  const [filterTeam, setFilterTeam] = useState('');
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [customLabels, setCustomLabels] = useState({});
  const [editorVisible, setEditorVisible] = useState(false);

  const [schedule, setSchedule] = useState({});
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch('/api/leagueSchedule')
      .then(res => res.json())
      .then(data => {
        setSchedule(data.schedule);
        setTeams(data.teams);
        setCustomLabels(data.labels);
      });
  }, []);

  const weeks = schedule[currentSeason] || [];
  const currentWeek = 10;

  const renderMatchups = (weekData) => {
    return weekData.matchups
      .filter(m => !filterTeam || m.team1 === filterTeam || m.team2 === filterTeam)
      .map((m, idx) => {
        const t1 = teams.find(t => t.name === m.team1);
        const t2 = teams.find(t => t.name === m.team2);
        const byeIcon = (team, week) => team?.byeWeek === week ? <span className="text-gray-400 ml-1">(BYE)</span> : null;

        return (
          <div key={idx} className="text-sm">
            {m.team1} <span className="text-gray-600">vs</span> {m.team2} {byeIcon(t1, weekData.week)} {byeIcon(t2, weekData.week)}
            {m.score && <div className="text-gray-500 text-xs">Result: {m.score}</div>}
          </div>
        );
      });
  };

  const exportToPDF = () => {
    const element = document.querySelector('main');
    const opt = {
      margin: 0.5,
      filename: `StatPulse_Schedule_${currentSeason}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Header />
      <main className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <TeamSidebar active="League Schedule" />

        <div className="md:col-span-3 space-y-6">
          <section className="bg-white rounded-lg shadow p-6">
            <h2
              className="text-xl font-semibold text-gray-800 mb-4 cursor-pointer"
              onDoubleClick={() => setEditorVisible(!editorVisible)}
            >
              League Schedule
            </h2>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div className="flex gap-4">
                <select onChange={e => setFilterTeam(e.target.value)} value={filterTeam} className="p-2 border rounded-md">
                  <option value="">All Teams</option>
                  {teams.map((t, idx) => <option key={idx} value={t.name}>{t.name}</option>)}
                </select>
                <select onChange={e => setCurrentSeason(e.target.value)} value={currentSeason} className="p-2 border rounded-md">
                  {Object.keys(schedule).map(year => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowFullSchedule(!showFullSchedule)} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm">
                  {showFullSchedule ? 'Show Recent' : 'Show Full Schedule'}
                </button>
                <button onClick={exportToPDF} className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm">Export PDF</button>
              </div>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(showFullSchedule ? weeks : weeks.filter(w => w.week >= currentWeek - 2 && w.week <= currentWeek + 2))
                .map((w, i) => (
                  <div key={i} className={`bg-white rounded-lg shadow p-4 ${w.isPlayoff ? 'border-l-4 border-yellow-400' : ''}`}>
                    <h4 className="text-lg font-semibold">Week {w.week} <span className="text-sm text-gray-600">({w.date})</span></h4>
                    <p className="text-sm text-gray-600 mb-2">{customLabels[currentSeason]?.[w.week] || w.label || ''}</p>
                    {renderMatchups(w)}
                  </div>
                ))}
            </div>

            {/* Week Label Editor */}
            {editorVisible && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Edit Week Labels</h3>
                {weeks.map((w, i) => (
                  <div key={i} className="mb-2">
                    <label className="text-sm">Week {w.week}</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={customLabels[currentSeason]?.[w.week] || ''}
                      onChange={(e) => setCustomLabels(prev => ({
                        ...prev,
                        [currentSeason]: {
                          ...(prev[currentSeason] || {}),
                          [w.week]: e.target.value
                        }
                      }))}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
