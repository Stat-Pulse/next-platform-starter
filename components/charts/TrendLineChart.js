// File: components/charts/TrendLineChart.js

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function TrendLineChart({ data, stat = 'fantasy_points_ppr', label = 'Fantasy Points (PPR)' }) {
  return (
    <div className="w-full h-64">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{label} Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey={stat} stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}