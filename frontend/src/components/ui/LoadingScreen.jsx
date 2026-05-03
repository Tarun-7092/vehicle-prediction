import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'var(--bg-void)' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: '2px solid transparent', borderTopColor: 'var(--cyan)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-2 rounded-full"
            style={{ border: '2px solid transparent', borderTopColor: 'var(--violet)' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--cyan)' }} />
          </div>
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Initializing...</p>
      </motion.div>
    </div>
  )
}