import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Zap, Clock, Shield, ChevronLeft, Activity, UserCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/predict',   icon: Zap,             label: 'Predict' },
  { to: '/history',   icon: Clock,           label: 'History' },
  { to: '/profile',   icon: UserCircle,      label: 'Profile' },
]

export default function Sidebar({ open, onToggle }) {
  const { isAdmin } = useAuth()
  const nav = isAdmin ? [...NAV, { to: '/admin', icon: Shield, label: 'Admin' }] : NAV

  return (
    <motion.aside
      animate={{ width: open ? 220 : 68 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative flex flex-col z-20 shrink-0"
      style={{ background: 'var(--bg-base)', borderRight: '1px solid var(--border-subtle)' }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 gap-3 shrink-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center glow-cyan"
          style={{ background: 'linear-gradient(135deg, var(--cyan), var(--violet))' }}>
          <Activity size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {open && (
            <motion.span
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="font-bold text-base tracking-tight gradient-text whitespace-nowrap"
            >VehicleAI</motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors relative overflow-hidden"
                style={{
                  background: isActive ? 'rgba(56,189,248,0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(56,189,248,0.2)' : '1px solid transparent',
                }}
              >
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                    style={{ background: 'var(--cyan)' }} />
                )}
                <Icon size={18} style={{ color: isActive ? 'var(--cyan)' : 'var(--text-muted)', flexShrink: 0 }} />
                <AnimatePresence>
                  {open && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                      style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                    >{label}</motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Toggle button */}
      <div className="p-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <motion.button onClick={onToggle} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center p-2 rounded-lg transition-colors"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
          <motion.div animate={{ rotate: open ? 0 : 180 }} transition={{ duration: 0.3 }}>
            <ChevronLeft size={16} />
          </motion.div>
        </motion.button>
      </div>
    </motion.aside>
  )
}