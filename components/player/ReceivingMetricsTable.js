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
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Receiving Metrics</h2>
      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Season</th>
              <th className="p-2">TGTS</th>
              <th className="p-2">REC</th>
              <th className="p-2">YDS</th>
              <th className="p-2">TD</th>
              <th className="p-2">FUM</th>
              <th className="p-2">FD</th>
              <th className="p-2">Avg Cushion</th>
              <th className="p-2">Avg Separation</th>
              <th className="p-2">Avg Intended Air Yards</th>
              <th className="p-2">Receiving Air Yards</th>
              <th className="p-2">Percent Share Air Yards</th>
              <th className="p-2">xYAC</th>
              <th className="p-2">YAC</th>
              <th className="p-2">+YAC</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{row.season}</td>
                <td className="p-2">{row.TGTS}</td>
                <td className="p-2">{row.REC}</td>
                <td className="p-2">{row.YDS}</td>
                <td className="p-2">{row.TD}</td>
                <td className="p-2">{row.FUM}</td>
                <td className="p-2">{row.FD}</td>
                <td className="p-2">{row.avg_cushion ? row.avg_cushion.toFixed(1) : '-'}</td>
                <td className="p-2">{row.avg_separation ? row.avg_separation.toFixed(1) : '-'}</td>
                <td className="p-2">{row.avg_intended_air_yards ? row.avg_intended_air_yards.toFixed(1) : '-'}</td>
                <td className="p-2">{row.receiving_air_yards || '-'}</td>
                <td className="p-2">{row.percent_share_air_yards ? row.percent_share_air_yards.toFixed(2) : '-'}</td>
                <td className="p-2">{row.xYAC ? row.xYAC.toFixed(1) : '-'}</td>
                <td className="p-2">{row.YAC ? row.YAC.toFixed(1) : '-'}</td>
                <td className="p-2">{row.plus_yac ? row.plus_yac.toFixed(1) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}