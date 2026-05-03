import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { MONTH_NAMES } from '@/utils/helpers'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl p-3" style={{ border: '1px solid var(--border-dim)' }}>
      <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-xs" style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function MonthlyChart({ data = [] }) {
  const formatted = data.map(d => ({
    name: MONTH_NAMES[(d.month || 1) - 1],
    Total: d.total,
    Failures: d.failures,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={formatted} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gFail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,189,248,0.06)" />
        <XAxis dataKey="name" tick={{ fill: '#3d6080', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#3d6080', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="Total" stroke="#38bdf8" strokeWidth={2} fill="url(#gTotal)" />
        <Area type="monotone" dataKey="Failures" stroke="#fb7185" strokeWidth={2} fill="url(#gFail)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}