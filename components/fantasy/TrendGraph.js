import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function TrendGraph({ player, statKey = 'fantasy_points' }) {
  if (!player || !player.weekly_stats || !Array.isArray(player.weekly_stats)) {
    return <p className="text-sm text-gray-500">No data available for trends.</p>;
  }

  const labels = player.weekly_stats.map((week) => `Week ${week.week}`);
  const dataPoints = player.weekly_stats.map((week) => week[statKey]);

  const chartData = {
    labels,
    datasets: [
      {
        label: statKey.replaceAll('_', ' ').toUpperCase(),
        data: dataPoints,
        fill: false,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: Math.ceil(Math.max(...dataPoints) / 4),
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white rounded-md p-4 shadow mb-6">
      <h3 className="text-md font-semibold mb-2">Trend: {statKey.replaceAll('_', ' ')}</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}
