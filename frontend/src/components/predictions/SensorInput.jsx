import { motion } from 'framer-motion'

const FIELDS = [
  { key: 'engine_rpm',       label: 'Engine RPM',         unit: 'RPM',  min: 0,    max: 10000, step: 10,   placeholder: '1200' },
  { key: 'lub_oil_pressure', label: 'Lub Oil Pressure',   unit: 'bar',  min: 0,    max: 20,    step: 0.1,  placeholder: '3.5' },
  { key: 'fuel_pressure',    label: 'Fuel Pressure',      unit: 'bar',  min: 0,    max: 20,    step: 0.1,  placeholder: '2.8' },
  { key: 'coolant_pressure', label: 'Coolant Pressure',   unit: 'bar',  min: 0,    max: 10,    step: 0.1,  placeholder: '1.2' },
  { key: 'lub_oil_temp',     label: 'Lub Oil Temp',       unit: '°C',   min: -50,  max: 250,   step: 0.5,  placeholder: '75' },
  { key: 'coolant_temp',     label: 'Coolant Temp',       unit: '°C',   min: -50,  max: 200,   step: 0.5,  placeholder: '88' },
]

export { FIELDS }

export default function SensorInput({ values, onChange, errors = {} }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {FIELDS.map(({ key, label, unit, min, max, step, placeholder }, i) => (
        <motion.div key={key}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
        >
          <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: 'var(--text-muted)' }}>
            <span>{label}</span>
            <span className="px-1.5 py-0.5 rounded text-xs font-mono"
              style={{ background: 'var(--bg-surface)', color: 'var(--cyan)', border: '1px solid var(--border-subtle)' }}>{unit}</span>
          </label>
          <input
            type="number"
            name={key}
            value={values[key]}
            onChange={onChange}
            placeholder={placeholder}
            min={min} max={max} step={step}
            className="input-field"
            style={errors[key] ? { borderColor: 'var(--rose)', boxShadow: '0 0 0 3px rgba(251,113,133,0.1)' } : {}}
          />
          {errors[key] && <p className="text-xs mt-1" style={{ color: 'var(--rose)' }}>{errors[key]}</p>}
        </motion.div>
      ))}
    </div>
  )
}