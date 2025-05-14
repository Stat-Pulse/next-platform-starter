// File: components/charts/CompareBarChart.js

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function CompareBarChart({ data = [], stat = 'tds', label = 'Touchdowns' }) {
  const chartData = data.map(player => ({
    name: player.player_name || player.player_id,
    value: player[stat] ?? 0
  }))

  return (
    <div className="w-full h-64 my-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{label} Comparison</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} height={60} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}