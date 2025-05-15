// pages/league-schedule.js
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeamSidebar from '@/components/TeamSidebar';

export default function LeagueSchedule() {
  const [scheduleData, setScheduleData] = useState({});
  const [teams, setTeams] = useState([]);
  const [currentSeason, setCurrentSeason] = useState('2025');
  const [filterTeam, setFilterTeam] = useState('');
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [customWeekLabels, setCustomWeekLabels] = useState({});
  const [standings, setStandings] = useState([]);
  const [notables, setNotables] = useState({});

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/pages/api/leagueSchedule');
      const data = await res.json();
      setScheduleData(data.scheduleData);
      setTeams(data.teams);
      setCustomWeekLabels({
        2025: { 5: 'Rivalry Week', 10: 'Rivalry Week', 12: 'Turkey Bowl Week', 14: 'Quarterfinals', 15: 'Semifinals', 16: 'Championship' },
        2024: {},
        2023: {}
      });
    }
    fetchData();
  }, []);

  useEffect(() => {
    renderStandings();
    calculateNotables();
  }, [teams, currentSeason, scheduleData]);

  const renderStandings = () => {
    const sorted = [...teams].sort((a, b) => a.rank - b.rank);
    setStandings(sorted);
  };

  const calculateNotables = () => {
    const data = scheduleData[currentSeason] || [];
    let high = { team: '', score: 0, week: 0 };
    let highLoss = { team: '', score: 0, week: 0 };
    let lowWin = { team: '', score: Infinity, week: 0 };

    data.forEach(({ week, matchups }) => {
      matchups.forEach(({ team1, team2, score }) => {
        if (!score) return;
        const [s1, s2] = score.split(' - ').map(Number);
        if (s1 > high.score) high = { team: team1, score: s1, week };
        if (s2 > high.score) high = { team: team2, score: s2, week };
        if (s1 < s2 && s1 > highLoss.score) highLoss = { team: team1, score: s1, week };
        if (s2 < s1 && s2 > highLoss.score) highLoss = { team: team2, score: s2, week };
        if (s1 > s2 && s1 < lowWin.score) lowWin = { team: team1, score: s1, week };
        if (s2 > s1 && s2 < lowWin.score) lowWin = { team: team2, score: s2, week };
      });
    });

    setNotables({ high, highLoss, lowWin });
  };

  const getDifficultyColor = (rank) => {
    if (rank <= 3) return 'bg-red-100 text-red-800';
    if (rank <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const renderMatchups = () => {
    const seasonData = scheduleData[currentSeason] || [];
    const currentWeek = 10;
    const shownWeeks = showFullSchedule ? seasonData : seasonData.filter(({ week }) => week >= currentWeek - 2 && week <= currentWeek + 2);

    return shownWeeks.map(({ week, date, matchups, label, isPlayoff }) => {
      const relevantMatchups = filterTeam ? matchups.filter(m => m.team1 === filterTeam || m.team2 === filterTeam) : matchups;
      if (relevantMatchups.length === 0) return null;

      return (
        <div key={week} className={`bg-white rounded-lg shadow p-4 mb-4 ${isPlayoff ? 'border-l-4 border-yellow-400' : ''} ${week === currentWeek ? 'bg-red-100' : ''}`}>
          <h4 className="text-lg font-semibold text-gray-800">Week {week} <span className="text-sm text-gray-600">({date})</span></h4>
          <p className="text-sm text-gray-600">{customWeekLabels[currentSeason]?.[week] || label}</p>
          <div className="mt-2 space-y-1">
            {relevantMatchups.map(({ team1, team2, score }, idx) => {
              const t1 = teams.find(t => t.name === team1);
              const t2 = teams.find(t => t.name === team2);
              return (
                <div key={idx} className="text-sm">
                  {team1} <span className={`${getDifficultyColor(t1?.rank)} px-2 py-1 rounded`}>{t1?.rank}</span> vs {team2} <span className={`${getDifficultyColor(t2?.rank)} px-2 py-1 rounded`}>{t2?.rank}</span>
                  {score && <div className="text-sm text-gray-600">Result: {score}</div>}
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <TeamSidebar active="League Schedule" />

        <div className="md:col-span-3 space-y-6">
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">League Schedule</h2>

            <div className="flex flex-wrap md:items-center justify-between gap-4 mb-4">
              <div className="flex gap-4">
                <select onChange={e => setFilterTeam(e.target.value)} value={filterTeam} className="p-2 border rounded-md">
                  <option value="">All Teams</option>
                  {teams.map((t, i) => <option key={i} value={t.name}>{t.name}</option>)}
                </select>
                <select onChange={e => setCurrentSeason(e.target.value)} value={currentSeason} className="p-2 border rounded-md">
                  {Object.keys(scheduleData).map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
              </div>
              <button
                onClick={() => setShowFullSchedule(!showFullSchedule)}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                {showFullSchedule ? 'Show Recent Schedule' : 'Show Full Schedule'}
              </button>
            </div>

            {renderMatchups()}

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">League Standings</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2">Rank</th>
                    <th className="px-4 py-2">Team</th>
                    <th className="px-4 py-2">Record</th>
                    <th className="px-4 py-2">Points For</th>
                    <th className="px-4 py-2">Points Against</th>
                    <th className="px-4 py-2">Win %</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((t, i) => {
                    const [w, l] = t.record.split('-').map(Number);
                    const pct = ((w / (w + l)) * 100).toFixed(1);
                    return (
                      <tr key={i}>
                        <td className="px-4 py-2">{t.rank}</td>
                        <td className="px-4 py-2">{t.name}</td>
                        <td className="px-4 py-2">{t.record}</td>
                        <td className="px-4 py-2">{t.pointsFor.toFixed(1)}</td>
                        <td className="px-4 py-2">{t.pointsAgainst.toFixed(1)}</td>
                        <td className="px-4 py-2">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Notable Scores</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Highest Scorer: {notables.high?.team} ({notables.high?.score} pts, Week {notables.high?.week})</li>
                <li>Highest Losing Score: {notables.highLoss?.team} ({notables.highLoss?.score} pts, Week {notables.highLoss?.week})</li>
                <li>Lowest Winning Score: {notables.lowWin?.team} ({notables.lowWin?.score} pts, Week {notables.lowWin?.week})</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
