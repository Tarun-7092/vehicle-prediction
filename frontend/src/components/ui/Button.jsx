import { motion } from 'framer-motion'

const variants = {
  primary: {
    background: 'linear-gradient(135deg, var(--cyan), var(--violet))',
    color: '#fff',
    border: 'none',
    boxShadow: '0 0 20px rgba(56,189,248,0.25)',
  },
  secondary: {
    background: 'var(--bg-surface)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-dim)',
  },
  danger: {
    background: 'rgba(251,113,133,0.1)',
    color: 'var(--rose)',
    border: '1px solid rgba(251,113,133,0.3)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid transparent',
  },
}

export default function Button({ children, variant = 'primary', loading, disabled, className = '', size = 'md', ...props }) {
  const sizeCls = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' }[size]
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02, y: disabled || loading ? 0 : -1 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all cursor-pointer ${sizeCls} ${className}`}
      style={{ ...variants[variant], opacity: disabled ? 0.5 : 1, cursor: disabled || loading ? 'not-allowed' : 'pointer' }}
      {...props}
    >
      {loading && (
        <motion.div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
          animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
      )}
      {children}
    </motion.button>
  )
}