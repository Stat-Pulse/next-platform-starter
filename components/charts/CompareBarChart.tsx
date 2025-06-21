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
