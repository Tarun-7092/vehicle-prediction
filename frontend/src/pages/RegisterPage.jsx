import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { FormField } from '@/components/auth/AuthForm'
import Button from '@/components/ui/Button'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [error, setError] = useState('')

  const handleChange = e => {
    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value
    }))

    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Frontend password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

    if (!passwordRegex.test(form.password)) {
      setError(
        'Password must contain uppercase, lowercase, and a number'
      )
      return
    }

    const res = await register(form)

    if (res.success) {
      navigate('/dashboard')
    } else {
      setError(
        res?.errors?.[0]?.message ||
        res?.message ||
        'Registration failed'
      )
    }
  }

  return (
    <div
      className="glass-bright rounded-2xl p-8"
      style={{ border: '1px solid var(--border-dim)' }}
    >
      <div className="mb-6">
        <h2
          className="text-2xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Create account
        </h2>

        <p
          className="text-sm mt-1"
          style={{ color: 'var(--text-muted)' }}
        >
          Start predicting vehicle health
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Jane Doe"
          icon={User}
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@company.com"
          icon={Mail}
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Min 8 chars with uppercase & number"
          icon={Lock}
        />

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full mt-2"
          size="lg"
        >
          Create account
        </Button>
      </form>

      <p
        className="text-center text-sm mt-6"
        style={{ color: 'var(--text-muted)' }}
      >
        Already have one?{' '}
        <Link
          to="/login"
          className="font-semibold"
          style={{ color: 'var(--cyan)' }}
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}