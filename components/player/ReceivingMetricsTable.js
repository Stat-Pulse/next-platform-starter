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

  const grouped = stats.reduce(
    (acc, row) => {
      const type = row.season_type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(row);
      return acc;
    },
    {}
  );

  const getTotalRow = (rows) => {
    return {
      season: 'Career',
      targets: rows.reduce((s, r) => s + (r.targets || 0), 0),
      receptions: rows.reduce((s, r) => s + (r.receptions || 0), 0),
      receiving_yards: rows.reduce((s, r) => s + (r.receiving_yards || 0), 0),
      receiving_tds: rows.reduce((s, r) => s + (r.receiving_tds || 0), 0),
      receiving_fumbles: rows.reduce((s, r) => s + (r.receiving_fumbles || 0), 0),
      receiving_first_downs: rows.reduce((s, r) => s + (r.receiving_first_downs || 0), 0),
      avg_cushion: null,
      avg_separation: null,
      avg_intended_air_yards: null,
      receiving_air_yards: rows.reduce((s, r) => s + (r.receiving_air_yards || 0), 0),
      air_yards_share: null,
      avg_expected_yac: null,
      receiving_yac: rows.reduce((s, r) => s + (r.receiving_yac || 0), 0),
      avg_yac_above_expectation: null,
      receiving_epa: rows.reduce((s, r) => s + (r.receiving_epa || 0), 0),
      target_share: null,
      wopr: rows.reduce((s, r) => s + (r.wopr || 0), 0),
    };
  };

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
            {rows.map((r) => (
              <tr key={r.season} className="border-t">
                <td className="p-2">{r.season}</td>
                <td className="p-2">{r.targets}</td>
                <td className="p-2">{r.receptions}</td>
                <td className="p-2">{r.receiving_yards}</td>
                <td className="p-2">{r.receiving_tds}</td>
                <td className="p-2">{r.receiving_fumbles}</td>
                <td className="p-2">{r.receiving_first_downs}</td>
                <td className="p-2">{r.avg_cushion?.toFixed(1) || '-'}</td>
                <td className="p-2">{r.avg_separation?.toFixed(1) || '-'}</td>
                <td className="p-2">{r.avg_intended_air_yards?.toFixed(1) || '-'}</td>
                <td className="p-2">{r.receiving_air_yards}</td>
                <td className="p-2">{r.air_yards_share?.toFixed(2) || '-'}</td>
                <td className="p-2">{r.avg_expected_yac?.toFixed(1) || '-'}</td>
                <td className="p-2">{r.receiving_yac}</td>
                <td className="p-2">{r.avg_yac_above_expectation?.toFixed(1) || '-'}</td>
                <td className="p-2">{r.receiving_epa?.toFixed(2)}</td>
                <td className="p-2">{r.target_share?.toFixed(2) || '-'}</td>
                <td className="p-2">{r.wopr?.toFixed(2)}</td>
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
      {grouped['REG'] && renderTable(grouped['REG'], 'Regular Season')}
      {expanded && grouped['POST'] && renderTable(grouped['POST'], 'Postseason')}
      {expanded && renderTable([getTotalRow(stats)], 'Career Total')}
      {Object.keys(grouped).includes('POST') && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-blue-600 underline text-sm"
        >
          {expanded ? 'Hide Postseason & Career' : 'Show Postseason & Career'}
        </button>
      )}
    </section>
  );
}
