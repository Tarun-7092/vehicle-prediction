import { motion } from 'framer-motion'

export default function StatCard({ label, value, icon: Icon, color = 'cyan', sub, delay = 0 }) {
  const colorMap = {
    cyan:    { bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.2)',  text: '#38bdf8', glow: '0 0 20px rgba(56,189,248,0.15)' },
    violet:  { bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)', text: '#a78bfa', glow: '0 0 20px rgba(167,139,250,0.15)' },
    emerald: { bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.2)',  text: '#34d399', glow: '0 0 20px rgba(52,211,153,0.15)' },
    rose:    { bg: 'rgba(251,113,133,0.1)', border: 'rgba(251,113,133,0.2)', text: '#fb7185', glow: '0 0 20px rgba(251,113,133,0.15)' },
    amber:   { bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.2)',  text: '#fbbf24', glow: '0 0 20px rgba(251,191,36,0.15)' },
  }
  const c = colorMap[color] || colorMap.cyan

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -3, boxShadow: c.glow }}
      className="glass rounded-2xl p-5 cursor-default"
      style={{ border: `1px solid ${c.border}` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{value}</p>
          {sub && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: c.bg, border: `1px solid ${c.border}` }}>
          <Icon size={18} style={{ color: c.text }} />
        </div>
      </div>
    </motion.div>
  )
}