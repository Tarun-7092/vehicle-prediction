import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AuthLayout() {
  return (
    <div className="min-h-screen noise-bg flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--bg-void)' }}>
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--cyan), transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--violet), transparent)' }} />

      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-cyan"
              style={{ background: 'linear-gradient(135deg, var(--cyan), var(--violet))' }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight gradient-text">VehicleAI</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Predictive Breakdown Intelligence</p>
        </div>
        <Outlet />
      </motion.div>
    </div>
  )
}