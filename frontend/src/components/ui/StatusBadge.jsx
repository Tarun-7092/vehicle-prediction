import { motion } from 'framer-motion'
import { getStatusStyles } from '@/utils/helpers'

export default function StatusBadge({ status, size = 'sm' }) {
  const s = getStatusStyles(status)
  const pad = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-4 py-1.5 text-sm'
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${pad}`}
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.pulse}`} style={{ background: s.text }} />
      {status}
    </motion.span>
  )
}