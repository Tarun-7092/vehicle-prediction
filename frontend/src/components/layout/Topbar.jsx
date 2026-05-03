import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, LogOut, Menu, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const TITLES = {
  '/dashboard': { title: 'Dashboard', sub: 'Vehicle health at a glance' },
  '/predict':   { title: 'Predict',   sub: 'Run ML inference on sensor data' },
  '/history':   { title: 'History',   sub: 'All prediction records' },
  '/profile':   { title: 'Profile',   sub: 'Your account and settings' },
  '/admin':     { title: 'Admin',     sub: 'System management' },
}

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const { title, sub } = TITLES[pathname] || { title: 'VehicleAI', sub: '' }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className="h-16 flex items-center justify-between px-6 shrink-0"
      style={{ background: 'rgba(8,15,26,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div className="flex items-center gap-4">
          <h1 className="font-bold text-base leading-tight" style={{ color: 'var(--text-primary)' }}>{title}</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Status pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-emerald" style={{ background: 'var(--emerald)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--emerald)' }}>ML Online</span>
        </div>

        {/* User */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, var(--cyan), var(--violet))', color: '#fff' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm font-medium hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
            {user?.name?.split(' ')[0]}
          </span>
        </div>

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="p-2 rounded-xl transition-colors"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
          <LogOut size={15} />
        </motion.button>
      </div>
    </motion.header>
  )
}