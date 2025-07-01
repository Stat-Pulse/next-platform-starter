// components/WeeklyChart.js
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { motion } from 'framer-motion';

export default function WeeklyChart({ chartData }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartData || chartData.length === 0) {
      // If there's no data, destroy any existing chart and do nothing.
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      return;
    }

    const ctx = document.getElementById('weeklyChartCanvas')?.getContext('2d');
    if (ctx) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // We now expect chartData to be pre-formatted
      const labels = chartData.map(d => `W${d.week}`);
      const datasets = [
        {
          label: 'Targets',
          data: chartData.map(d => d.targets),
          backgroundColor: '#00FFFF'
        },
        {
          label: 'Receptions',
          data: chartData.map(d => d.receptions),
          backgroundColor: '#0088ff'
        }
      ];

      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets },
        options: {
          plugins: { legend: { labels: { color: '#fff' } } },
          scales: {
            x: { ticks: { color: '#fff' } },
            y: { ticks: { color: '#fff' } }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData]); // This effect re-runs whenever the chartData prop changes

  return (
    <motion.div className="glass-card p-4" whileHover={{ scale: 1.05 }}>
      <h2 className="text-sm uppercase font-semibold text-cyan-300">Weekly Targets vs. Receptions</h2>
      <canvas id="weeklyChartCanvas" className="w-full h-64"></canvas>
    </motion.div>
  );
}