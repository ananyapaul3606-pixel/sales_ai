import { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = {
  hot: '#ef4444',
  warm: '#f59e0b',
  cold: '#6b7280',
};

const ScoreDistribution = memo(function ScoreDistribution({ data = { hot: 0, warm: 0, cold: 0 } }) {
  const chartData = [
    { name: 'HOT', value: data.hot || 0, color: COLORS.hot },
    { name: 'WARM', value: data.warm || 0, color: COLORS.warm },
    { name: 'COLD', value: data.cold || 0, color: COLORS.cold },
  ].filter((item) => item.value > 0);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-100 text-sm">
        <p className="font-medium text-gray-900">{item.name}</p>
        <p className="text-gray-600">Count: <span className="font-semibold">{item.value}</span></p>
        <p className="text-gray-600">Percentage: <span className="font-semibold">{pct}%</span></p>
      </div>
    );
  };

  const renderCustomLabel = ({ cx, cy }) => {
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="fill-gray-900 font-bold text-lg">
        {total}
      </text>
    );
  };

  return (
    <div className="w-full h-80 flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="text-sm text-gray-700 font-medium">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-500 -mt-4">Total leads: <span className="font-semibold text-gray-900">{total}</span></p>
    </div>
  );
});

export default ScoreDistribution;
