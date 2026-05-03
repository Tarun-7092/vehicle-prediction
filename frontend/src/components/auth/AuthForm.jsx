import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'

export function FormField({ label, name, type = 'text', value, onChange, placeholder, error, icon: Icon }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />}
        <input
          name={name}
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field"
          style={{ paddingLeft: Icon ? '40px' : '16px', paddingRight: isPassword ? '40px' : '16px' }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs mt-1" style={{ color: 'var(--rose)' }}>{error}</p>}
    </div>
  )
}