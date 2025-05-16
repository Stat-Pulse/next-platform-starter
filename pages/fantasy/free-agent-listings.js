// pages/fantasy/åfree-agent-listings.js
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeamSidebar from '@/components/TeamSidebar';

export default function FreeAgentListings() {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('');
  const [team, setTeam] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetch('/data/freeAgents.json')
      .then(res => res.json())
      .then(data => setPlayers(data));
  }, []);

  useEffect(() => {
    let filtered = [...players];
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (position) filtered = filtered.filter(p => p.position === position);
    if (team) filtered = filtered.filter(p => p.team === team);
    if (status) filtered = filtered.filter(p => p.status === status);
    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b[sortBy] - a[sortBy];
    });
    setFilteredPlayers(filtered);
  }, [search, position, team, status, sortBy, players]);

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-4">Free Agent Listings</h1>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search players..."
          className="p-2 border rounded"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={position} onChange={e => setPosition(e.target.value)} className="p-2 border rounded">
          <option value="">All Positions</option>
          <option value="QB">QB</option>
          <option value="RB">RB</option>
          <option value="WR">WR</option>
          <option value="TE">TE</option>
          <option value="K">K</option>
          <option value="DEF">DEF</option>
        </select>
        <select value={team} onChange={e => setTeam(e.target.value)} className="p-2 border rounded">
          <option value="">All Teams</option>
          {['ARI','ATL','BAL','BUF','CAR','CHI','CIN','CLE','DAL','DEN','DET','GB','HOU','IND','JAX','KC','LAC','LAR','LV','MIA','MIN','NE','NO','NYG','NYJ','PHI','PIT','SEA','SF','TB','TEN','WAS'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="p-2 border rounded">
          <option value="">All Statuses</option>
          <option value="free">Free Agent</option>
          <option value="waiver">Waiver</option>
        </select>
      </div>
      <table className="w-full text-sm text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Pos</th>
            <th className="p-2">Team</th>
            <th className="p-2">Bye</th>
            <th className="p-2">Recent</th>
            <th className="p-2">Season Avg</th>
            <th className="p-2">Projected</th>
            <th className="p-2">Owned %</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.map(p => (
            <tr key={p.name} className={p.injury ? 'bg-red-100' : ''}>
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.position}</td>
              <td className="p-2">{p.team}</td>
              <td className="p-2">{p.bye}</td>
              <td className="p-2">{p.recentPoints}</td>
              <td className="p-2">{p.seasonAvg}</td>
              <td className="p-2">{p.projectedPoints}</td>
              <td className="p-2">{p.ownership}%</td>
              <td className="p-2">
                <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">
                  {p.status === 'free' ? 'Add' : 'Claim'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
