import { motion } from 'framer-motion'
import { getRiskLabel } from '@/utils/helpers'

export default function ProbabilityGauge({ value = 0 }) {
  const pct = Math.round(value * 100)
  const { label, color } = getRiskLabel(value)
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(56,189,248,0.08)" strokeWidth="10" />
          <motion.circle
            cx="60" cy="60" r="54" fill="none"
            stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold"
            style={{ color, fontFamily: 'var(--font-mono)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >
            {pct}%
          </motion.span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>probability</span>
        </div>
      </div>
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: 'spring' }}
        className="px-4 py-1.5 rounded-full text-sm font-bold"
        style={{ background: `${color}15`, border: `1px solid ${color}50`, color }}
      >{label}</motion.div>
    </div>
  )
}