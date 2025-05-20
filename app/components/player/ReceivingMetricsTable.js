// app/components/player/ReceivingMetricsTable.js
'use client';

import { useEffect, useState } from 'react';

export default function ReceivingMetricsTable({ playerId }) {
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState({ REG: true, POST: false, CAREER: true });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/player/${playerId}/receiving`);
      const json = await res.json();
      if (json.data) {
        const grouped = { REG: [], POST: [], CAREER: [] };
        const totals = { REG: {}, POST: {} };

        json.data.forEach(row => {
          if (row.season_type === 'REG') grouped.REG.push(row);
          if (row.season_type === 'POST') grouped.POST.push(row);

          // Sum for career totals
          const target = totals[row.season_type] ||= {};
          for (const key in row) {
            if (['season', 'season_type'].includes(key)) continue;
            target[key] = (target[key] || 0) + (parseFloat(row[key]) || 0);
          }
        });

        // Combine REG + POST for career total
        const career = {};
        for (const key in totals.REG) {
          career[key] = (totals.REG[key] || 0) + (totals.POST[key] || 0);
        }
        grouped.CAREER.push({ ...career, season: 'Career', season_type: 'CAREER' });
        setData(grouped);
      }
    };
    fetchData();
  }, [playerId]);

  const columns = [
    { label: 'Season', key: 'season' },
    { label: 'TGTS', key: 'targets' },
    { label: 'REC', key: 'receptions' },
    { label: 'YDS', key: 'receiving_yards' },
    { label: 'TD', key: 'receiving_tds' },
    { label: 'FUM', key: 'receiving_fumbles' },
    { label: 'FD', key: 'receiving_first_downs' },
    { label: 'AirYards', key: 'receiving_air_yards' },
    { label: 'YAC', key: 'receiving_yac' },
    { label: 'EPA', key: 'receiving_epa' },
    { label: 'Cushion', key: 'avg_cushion' },
    { label: 'Separation', key: 'avg_separation' },
    { label: 'AirYardShare', key: 'air_yards_share' },
    { label: 'ExpYAC', key: 'avg_expected_yac' },
    { label: 'YAC+', key: 'avg_yac_above_expectation' },
    { label: 'TgtShare', key: 'target_share' },
    { label: 'WOPR', key: 'wopr' }
  ];

  const renderSection = (label, rows) => (
    <div className="mt-6">
      <button
        className="font-bold text-lg text-blue-700 hover:underline"
        onClick={() => setExpanded(prev => ({ ...prev, [label]: !prev[label] }))}
      >
        {expanded[label] ? '▼' : '▶'} {label === 'REG' ? 'Regular Season' : label === 'POST' ? 'Postseason' : 'Career Totals'}
      </button>
      {expanded[label] && (
        <div className="overflow-x-auto mt-2">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="border p-2 text-left">{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t">
                  {columns.map(col => (
                    <td key={col.key} className="border p-2 text-right">
                      {col.key === 'season' ? row[col.key] : parseFloat(row[col.key] || 0).toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-2">Receiving Metrics</h2>
      {renderSection('REG', data.REG || [])}
      {renderSection('POST', data.POST || [])}
      {renderSection('CAREER', data.CAREER || [])}
    </section>
  );
}
