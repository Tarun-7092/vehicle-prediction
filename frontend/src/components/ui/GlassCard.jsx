import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', glow, style = {}, ...props }) {
  return (
    <motion.div
      className={`glass rounded-2xl ${glow ? `glow-${glow}` : ''} ${className}`}
      style={{ padding: '1.5rem', ...style }}
      {...props}
    >
      {children}
    </motion.div>
  )
}