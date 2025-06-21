// components/charts/CompareRadarChart.tsx
"use client";

import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface CompareRadarChartProps {
  data: ChartData<'radar'>;
  options: ChartOptions<'radar'>;
}

export default function CompareRadarChart({ data, options }: CompareRadarChartProps) {
  return <Radar data={data} options={options} />;
}
