'use client';

import { useEffect, useState } from 'react';

export default function ReceivingMetricsTable({ playerId }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/player/${playerId}/receiving`);
        const json = await res.json();
        setStats(json.data || []);
      } catch (err) {
        console.error('Error fetching receiving stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [playerId]);

  if (loading) return <p className="text-sm text-gray-500">Loading receiving metrics...</p>;
  if (!stats.length) return <p className="text-sm text-gray-500">No receiving data available.</p>;

  // Group by season (no season_type)
  const grouped = stats.reduce((acc, row) => {
    const season = row.season;
    if (!acc[season]) acc[season] = [];
    acc[season].push(row);
    return acc;
  }, {});

  const getTotalRow = (rows) => ({
    season: 'Career',
    TGTS: rows.reduce((s, r) => s + (r.TGTS || 0), 0),
    REC: rows.reduce((s, r) => s + (r.REC || 0), 0),
    YDS: rows.reduce((s, r) => s + (r.YDS || 0), 0),
    TD: rows.reduce((s, r) => s + (r.TD || 0), 0),
    FUM: rows.reduce((s, r) => s + (r.FUM || 0), 0),
    FD: rows.reduce((s, r) => s + (r.FD || 0), 0),
    avg_cushion: rows.reduce((s, r) => s + (r.avg_cushion || 0), 0) / rows.length || null,
    avg_separation: rows.reduce((s, r) => s + (r.avg_separation || 0), 0) / rows.length || null,
    avg_intended_air_yards: rows.reduce((s, r) => s + (r.avg_intended_air_yards || 0), 0) / rows.length || null,
    receiving_air_yards: rows.reduce((s, r) => s + (r.receiving_air_yards || 0), 0),
    percent_share_air_yards: rows.reduce((s, r) => s + (r.percent_share_air_yards || 0), 0) / rows.length || null,
    xYAC: rows.reduce((s, r) => s + (r.xYAC || 0), 0),
    YAC: rows.reduce((s, r) => s + (r.YAC || 0), 0),
    plus_yac: rows.reduce((s, r) => s + (r.plus_yac || 0), 0),
    EPA: rows.reduce((s, r) => s + (r.EPA || 0), 0),
    target_share: rows.reduce((s, r) => s + (r.target_share || 0), 0) / rows.length || null,
    WOPR: rows.reduce((s, r) => s + (r.WOPR || 0), 0) / rows.length || null,
  });

  const renderTable = (rows, label) => (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Season</th>
              <th className="p-2">TGTS</th>
              <th className="p-2">REC</th>
              <th className="p-2">YDS</th>
              <th className="p-2">TD</th>
              <th className="p-2">FUM</th>
              <th className="p-2">FD</th>
              <th className="p-2">Cush</th>
              <th className="p-2">Sep</th>
              <th className="p-2">IAY</th>
              <th className="p-2">AirYds</th>
              <th className="p-2">%Air</th>
              <th className="p-2">xYAC</th>
              <th className="p-2">YAC</th>
              <th className="p-2">+YAC</th>
              <th className="p-2">EPA</th>
              <th className="p-2">Tgt%</th>
              <th className="p-2">WOPR</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.season}-${i}`} className="border-t">
                <td className="p-2">{r.season}</td>
                <td className="p-2">{r.TGTS ?? '-'}</td>
                <td className="p-2">{r.REC ?? '-'}</td>
                <td className="p-2">{r.YDS ?? '-'}</td>
                <td className="p-2">{r.TD ?? '-'}</td>
                <td className="p-2">{r.FUM ?? '-'}</td>
                <td className="p-2">{r.FD ?? '-'}</td>
                <td className="p-2">{r.avg_cushion ? Number(r.avg_cushion).toFixed(1) : '-'}</td>
                <td className="p-2">{r.avg_separation ? Number(r.avg_separation).toFixed(1) : '-'}</td>
                <td className="p-2">{r.avg_intended_air_yards ? Number(r.avg_intended_air_yards).toFixed(1) : '-'}</td>
                <td className="p-2">{r.receiving_air_yards ?? '-'}</td>
                <td className="p-2">{r.percent_share_air_yards ? Number(r.percent_share_air_yards).toFixed(2) : '-'}</td>
                <td className="p-2">{r.xYAC ? Number(r.xYAC).toFixed(1) : '-'}</td>
                <td className="p-2">{r.YAC ?? '-'}</td>
                <td className="p-2">{r.plus_yac ? Number(r.plus_yac).toFixed(1) : '-'}</td>
                <td className="p-2">{r.EPA ? Number(r.EPA).toFixed(2) : '-'}</td>
                <td className="p-2">{r.target_share ? Number(r.target_share).toFixed(2) : '-'}</td>
                <td className="p-2">{r.WOPR ? Number(r.WOPR).toFixed(2) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">📈 Receiving Metrics</h2>
      {Object.keys(grouped).map((season) => renderTable(grouped[season], `Season ${season}`))}
      {expanded && renderTable([getTotalRow(stats)], 'Career Total')}
      {stats.length > 1 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-blue-600 underline text-sm"
        >
          {expanded ? 'Hide Career Total' : 'Show Career Total'}
        </button>
      )}
    </section>
  );
}
