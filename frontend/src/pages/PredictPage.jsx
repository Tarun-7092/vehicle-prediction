import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, RotateCcw } from 'lucide-react'
import { predictionsApi } from '@/api/predictions'
import SensorInput, { FIELDS } from '@/components/predictions/SensorInput'
import PredictionResult from '@/components/predictions/PredictionResult'
import Button from '@/components/ui/Button'
import GlassCard from '@/components/ui/GlassCard'
import toast from 'react-hot-toast'

const INITIAL = Object.fromEntries(FIELDS.map(f => [f.key, '']))

export default function PredictPage() {
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleChange = e => {
    setValues(v => ({ ...v, [e.target.name]: e.target.value }))
    setErrors(err => { const n = { ...err }; delete n[e.target.name]; return n })
  }

  const validate = () => {
    const errs = {}
    FIELDS.forEach(({ key, label, min, max }) => {
      const v = parseFloat(values[key])
      if (values[key] === '' || isNaN(v)) errs[key] = `${label} is required`
      else if (v < min || v > max) errs[key] = `Must be between ${min} and ${max}`
    })
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const payload = Object.fromEntries(FIELDS.map(f => [f.key, parseFloat(values[f.key])]))
      const { data } = await predictionsApi.create(payload)
      setResult(data.data.prediction)
      toast.success('Prediction complete!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Prediction failed. Is the ML service running?')
    } finally { setLoading(false) }
  }

  const reset = () => { setValues(INITIAL); setResult(null); setErrors({}) }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Run Prediction</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Enter sensor readings to get an ML breakdown prediction</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <GlassCard>
            <h3 className="font-bold text-sm mb-5 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Zap size={16} style={{ color: 'var(--cyan)' }} />
              Sensor Data Input
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <SensorInput values={values} onChange={handleChange} errors={errors} />
              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={loading} disabled={loading} className="flex-1" size="lg">
                  <Zap size={16} />
                  {loading ? 'Analyzing...' : 'Run Prediction'}
                </Button>
                <Button type="button" variant="secondary" onClick={reset} size="lg">
                  <RotateCcw size={16} />
                </Button>
              </div>
            </form>
          </GlassCard>
        </motion.div>

        {/* Result panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <AnimatePresence mode="wait">
            {result ? (
              <PredictionResult key="result" result={result} />
            ) : (
              <motion.div key="placeholder"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center min-h-80">
                <div className="w-20 h-20 rounded-full mb-4 flex items-center justify-center animate-float"
                  style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.15)' }}>
                  <Zap size={32} style={{ color: 'var(--cyan)', opacity: 0.5 }} />
                </div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>Awaiting sensor data</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Fill in all fields and click Run Prediction
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}