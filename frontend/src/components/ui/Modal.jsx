import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, maxWidth = '500px' }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0" style={{ background: 'rgba(3,7,18,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="glass-bright rounded-2xl relative z-10 w-full"
            style={{ maxWidth, border: '1px solid var(--border-dim)' }}
          >
            <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" style={{ color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}