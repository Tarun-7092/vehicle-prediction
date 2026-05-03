import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, AlertTriangle, CheckCircle, TrendingUp, Zap, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { predictionsApi } from '@/api/predictions'
import { useAuth } from '@/context/AuthContext'
import StatCard from '@/components/ui/StatCard'
import GlassCard from '@/components/ui/GlassCard'
import StatusBadge from '@/components/ui/StatusBadge'
import MonthlyChart from '@/components/charts/MonthlyChart'
import StatusPieChart from '@/components/charts/StatusPieChart'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { formatDate, formatPercent } from '@/utils/helpers'
import Button from '@/components/ui/Button'

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    predictionsApi.getDashboard()
      .then(r => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = data?.summary || {}

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Good day, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Here's your vehicle intelligence overview</p>
      </motion.div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={item}><StatCard label="Total Predictions" value={stats.total ?? 0} icon={Activity} color="cyan" delay={0} /></motion.div>
          <motion.div variants={item}><StatCard label="Normal" value={stats.normal ?? 0} icon={CheckCircle} color="emerald" delay={0.08} sub="All clear" /></motion.div>
          <motion.div variants={item}><StatCard label="Failures Detected" value={stats.failures ?? 0} icon={AlertTriangle} color="rose" delay={0.16} /></motion.div>
          <motion.div variants={item}><StatCard label="Avg Risk" value={formatPercent(stats.avgFailureProbability ?? 0)} icon={TrendingUp} color="violet" delay={0.24} /></motion.div>
        </motion.div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <GlassCard>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Monthly Activity</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Predictions over the last 12 months</p>
              </div>
            </div>
            <MonthlyChart data={data?.monthlyStats || []} />
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard>
            <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Status Breakdown</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Distribution by prediction type</p>
            <StatusPieChart data={data?.statusBreakdown || {}} />
          </GlassCard>
        </motion.div>
      </div>

      {/* Recent Predictions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <GlassCard>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Recent Predictions</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Latest sensor readings and results</p>
            </div>
            <Link to="/history">
              <Button variant="secondary" size="sm">View all</Button>
            </Link>
          </div>

          {!data?.recentPredictions?.length ? (
            <div className="text-center py-12">
              <Zap size={32} className="mx-auto mb-3 opacity-20" style={{ color: 'var(--cyan)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No predictions yet</p>
              <Link to="/predict" className="mt-3 inline-block">
                <Button size="sm">Run first prediction</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {data.recentPredictions.map((p, i) => (
                <motion.div key={p._id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.04 }}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center gap-3">
                    <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                    <div>
                      <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        RPM {p.engine_rpm} • {p.coolant_temp}°C coolant
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(p.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      {formatPercent(p.failure_probability)}
                    </span>
                    <StatusBadge status={p.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  )
}