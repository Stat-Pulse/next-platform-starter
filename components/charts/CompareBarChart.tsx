
// components/charts/CompareBarChart.tsx
"use client";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CompareBarChartProps {
  data: ChartData<'bar'>;
  options: ChartOptions<'bar'>;
}

export default function CompareBarChart({ data, options }: CompareBarChartProps) {
  return <Bar data={data} options={options} />;
}


idk if this is used or not
components/charts/TrendLineChart.js
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

