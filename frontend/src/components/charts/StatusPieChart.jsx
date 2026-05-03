import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = { Normal: '#34d399', Warning: '#fbbf24', Critical: '#fb7185', Failure: '#f43f5e' }

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="glass rounded-xl p-3" style={{ border: '1px solid var(--border-dim)' }}>
      <p className="text-xs font-bold" style={{ color: COLORS[name] || '#38bdf8' }}>{name}: {value}</p>
    </div>
  )
}

export default function StatusPieChart({ data = {} }) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }))
  if (!chartData.length) return <div className="flex items-center justify-center h-48 text-sm" style={{ color: 'var(--text-muted)' }}>No data yet</div>

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
          paddingAngle={4} dataKey="value" strokeWidth={0}>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] || '#38bdf8'} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  )
}