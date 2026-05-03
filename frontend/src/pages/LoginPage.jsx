import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { FormField } from '@/components/auth/AuthForm'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    const res = await login(form)
    if (res.success) navigate('/dashboard')
  }

  return (
    <div className="glass-bright rounded-2xl p-8" style={{ border: '1px solid var(--border-dim)' }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Sign in</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Access your prediction dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange}
          placeholder="you@company.com" icon={Mail} />
        <FormField label="Password" name="password" type="password" value={form.password} onChange={handleChange}
          placeholder="••••••••" icon={Lock} />

        <Button type="submit" loading={loading} disabled={loading} className="w-full mt-2" size="lg">
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
        No account?{' '}
        <Link to="/register" className="font-semibold transition-colors" style={{ color: 'var(--cyan)' }}>
          Create one
        </Link>
      </p>
    </div>
  )
}