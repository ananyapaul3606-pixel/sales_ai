import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];

const PipelineChart = memo(function PipelineChart({ data = [] }) {
  const total = data.reduce((sum, item) => sum + (item.count || 0), 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0.0';
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-100 text-sm">
        <p className="font-medium text-gray-900">{item.status}</p>
        <p className="text-gray-600">Count: <span className="font-semibold">{item.count}</span></p>
        <p className="text-gray-600">Percentage: <span className="font-semibold">{pct}%</span></p>
      </div>
    );
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="status" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(5, 150, 105, 0.05)' }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={entry.status} fill={COLORS[index % COLORS.length]} />
            ))}
            <LabelList dataKey="count" position="top" fontSize={12} fontWeight={600} fill="#374151" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default PipelineChart;
