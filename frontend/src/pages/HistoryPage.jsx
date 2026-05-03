import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Search, Filter, ChevronLeft, ChevronRight, SortAsc, SortDesc } from 'lucide-react'
import { usePredictions } from '@/hooks/usePredictions'
import StatusBadge from '@/components/ui/StatusBadge'
import Button from '@/components/ui/Button'
import GlassCard from '@/components/ui/GlassCard'
import Modal from '@/components/ui/Modal'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { formatDate, formatPercent } from '@/utils/helpers'

const STATUS_OPTIONS = ['', 'Normal', 'Warning', 'Critical', 'Failure']
const SORT_FIELDS = [
  { value: 'createdAt', label: 'Date' },
  { value: 'failure_probability', label: 'Risk' },
  { value: 'engine_rpm', label: 'RPM' },
]

export default function HistoryPage() {
  const { predictions, loading, meta, fetchPredictions, deletePrediction } = usePredictions()
  const [params, setParams] = useState({ page: 1, limit: 10, status: '', sortBy: 'createdAt', sortOrder: 'desc' })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const p = { ...params }
    if (!p.status) delete p.status
    fetchPredictions(p)
  }, [params])

  const setParam = (key, val) => setParams(p => ({ ...p, [key]: val, page: key !== 'page' ? 1 : val }))
  const toggleSort = () => setParam('sortOrder', params.sortOrder === 'desc' ? 'asc' : 'desc')

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await deletePrediction(deleteTarget)
    setDeleting(false)
    setDeleteTarget(null)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Prediction History</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {meta?.total ?? 0} total records
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard style={{ padding: '1rem' }}>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 flex-1 min-w-40">
              <Filter size={14} style={{ color: 'var(--text-muted)' }} />
              <select value={params.status} onChange={e => setParam('status', e.target.value)}
                className="input-field py-2 text-sm flex-1" style={{ padding: '8px 12px' }}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s || 'All statuses'}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select value={params.sortBy} onChange={e => setParam('sortBy', e.target.value)}
                className="input-field py-2 text-sm" style={{ padding: '8px 12px' }}>
                {SORT_FIELDS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
              </select>
              <button onClick={toggleSort} className="p-2 rounded-xl transition-colors"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-dim)', color: 'var(--text-muted)' }}>
                {params.sortOrder === 'desc' ? <SortDesc size={15} /> : <SortAsc size={15} />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Per page:</span>
              <select value={params.limit} onChange={e => setParam('limit', Number(e.target.value))}
                className="input-field py-2 text-sm" style={{ padding: '8px 12px', width: 'auto' }}>
                {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {loading ? <TableSkeleton rows={8} /> : (
          <div className="space-y-2">
            {!predictions.length ? (
              <GlassCard className="text-center py-16">
                <p style={{ color: 'var(--text-muted)' }}>No predictions found</p>
              </GlassCard>
            ) : (
              <AnimatePresence>
                {predictions.map((p, i) => (
                  <motion.div key={p._id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="glass rounded-xl p-4 flex flex-wrap items-center gap-4"
                    whileHover={{ borderColor: 'var(--border-dim)' }}
                    style={{ border: '1px solid var(--border-subtle)' }}
                  >
                    <div className="flex-1 min-w-48">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                        RPM {p.engine_rpm} · {p.coolant_temp}°C · {p.lub_oil_temp}°C oil
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{formatDate(p.createdAt)}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Risk</p>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                          {formatPercent(p.failure_probability)}
                        </p>
                      </div>
                      <StatusBadge status={p.status} />
                      <button onClick={() => setDeleteTarget(p._id)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-rose-500/10"
                        style={{ color: 'var(--text-muted)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" size="sm" disabled={!meta.hasPrevPage}
            onClick={() => setParam('page', params.page - 1)}>
            <ChevronLeft size={15} />
          </Button>
          <span className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {params.page} / {meta.totalPages}
          </span>
          <Button variant="secondary" size="sm" disabled={!meta.hasNextPage}
            onClick={() => setParam('page', params.page + 1)}>
            <ChevronRight size={15} />
          </Button>
        </div>
      )}

      {/* Delete modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Prediction">
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Are you sure? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" loading={deleting} onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}