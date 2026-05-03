import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, TrendingUp } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import ProbabilityGauge from '@/components/charts/ProbabilityGauge'
import { formatDate } from '@/utils/helpers'

const icons = {
  Normal: { Icon: CheckCircle, color: '#34d399' },
  Warning: { Icon: AlertTriangle, color: '#fbbf24' },
  Critical: { Icon: XCircle, color: '#fb7185' },
  Failure: { Icon: XCircle, color: '#fb7185' },
}

export default function PredictionResult({ result }) {
  const { Icon, color } = icons[result.status] || icons.Normal

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="glass-bright rounded-2xl p-6"
      style={{ border: `1px solid ${color}30` }}
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
          <Icon size={24} style={{ color }} />
        </motion.div>
        <div>
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Prediction Result</h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(result.createdAt)}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={result.status} size="md" />
        </div>
      </div>

      <div className="flex flex-col items-center mb-6">
        <ProbabilityGauge value={result.failure_probability} />
      </div>

      {/* Sensor data recap */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Engine RPM', value: result.engine_rpm },
          { label: 'Lub Oil P.', value: `${result.lub_oil_pressure} bar` },
          { label: 'Fuel P.',    value: `${result.fuel_pressure} bar` },
          { label: 'Coolant P.', value: `${result.coolant_pressure} bar` },
          { label: 'Oil Temp',   value: `${result.lub_oil_temp}°C` },
          { label: 'Coolant T.', value: `${result.coolant_temp}°C` },
        ].map(({ label, value }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
            className="rounded-xl p-2.5 text-center"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
          >
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}