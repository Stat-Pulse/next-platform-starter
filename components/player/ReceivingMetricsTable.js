'use client';
import { useState, useEffect } from 'react';

export default function ReceivingMetricsTable({ playerId }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReceivingMetrics() {
      try {
        console.log('Fetching receiving metrics for playerId:', playerId);
        const response = await fetch(`/api/player/${playerId}/receiving`);
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('API response:', result);
        if (result.data) {
          setStats(result.data);
        } else {
          console.error('No data in response:', result);
          setStats([]);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchReceivingMetrics();
  }, [playerId]);

  if (loading) return <p className="text-sm text-gray-500">Loading receiving metrics...</p>;
  if (error) return <p className="text-sm text-red-500">Error loading receiving metrics: {error}</p>;
  if (!stats.length) return <p className="text-sm text-gray-500">No receiving data available.</p>;

  return (
    <section className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Receiving Metrics</h2>
      <div className="overflow-x-auto border rounded-md shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-700">
            <tr>
              <th className="p-3 font-semibold">Season</th>
              <th className="p-3 font-semibold text-center">TGTS</th>
              <th className="p-3 font-semibold text-center">REC</th>
              <th className="p-3 font-semibold text-center">YDS</th>
              <th className="p-3 font-semibold text-center">TD</th>
              <th className="p-3 font-semibold text-center">FUM</th>
              <th className="p-3 font-semibold text-center">FD</th>
              <th className="p-3 font-semibold text-center">Avg Cushion</th>
              <th className="p-3 font-semibold text-center">Avg Separation</th>
              <th className="p-3 font-semibold text-center">Avg Intended Air Yards</th>
              <th className="p-3 font-semibold text-center">Receiving Air Yards</th>
              <th className="p-3 font-semibold text-center">Percent Share Air Yards</th>
              <th className="p-3 font-semibold text-center">xYAC</th>
              <th className="p-3 font-semibold text-center">YAC</th>
              <th className="p-3 font-semibold text-center">+YAC</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row, index) => (
              <tr key={index} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="p-3">{row.season}</td>
                <td className="p-3 text-center">{row.TGTS}</td>
                <td className="p-3 text-center">{row.REC}</td>
                <td className="p-3 text-center">{row.YDS}</td>
                <td className="p-3 text-center">{row.TD}</td>
                <td className="p-3 text-center">{row.FUM}</td>
                <td className="p-3 text-center">{row.FD}</td>
                <td className="p-3 text-center">{row.avg_cushion ? row.avg_cushion.toFixed(1) : '-'}</td>
                <td className="p-3 text-center">{row.avg_separation ? row.avg_separation.toFixed(1) : '-'}</td>
                <td className="p-3 text-center">{row.avg_intended_air_yards ? row.avg_intended_air_yards.toFixed(1) : '-'}</td>
                <td className="p-3 text-center">{row.receiving_air_yards || '-'}</td>
                <td className="p-3 text-center">{row.percent_share_air_yards ? row.percent_share_air_yards.toFixed(2) : '-'}</td>
                <td className="p-3 text-center">{row.xYAC ? row.xYAC.toFixed(1) : '-'}</td>
                <td className="p-3 text-center">{row.YAC ? row.YAC.toFixed(1) : '-'}</td>
                <td className="p-3 text-center">{row.plus_yac ? row.plus_yac.toFixed(1) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}