import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-void)' }}>
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: `linear-gradient(rgba(56,189,248,0.02) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(56,189,248,0.02) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />

      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Topbar sidebarOpen={sidebarOpen} onMenuClick={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="p-6 min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}