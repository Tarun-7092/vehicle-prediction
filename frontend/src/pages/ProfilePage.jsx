import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Shield, Calendar, Activity, AlertTriangle, CheckCircle, Save } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authApi } from '@/api/auth'
import GlassCard from '@/components/ui/GlassCard'
import Button from '@/components/ui/Button'
import { FormField } from '@/components/auth/AuthForm'
import { formatDate } from '@/utils/helpers'
import toast from 'react-hot-toast'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwErrors, setPwErrors] = useState({})

  const handlePwChange = e => {
    setPwForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setPwErrors(err => { const n = { ...err }; delete n[e.target.name]; return n })
  }

  const validatePw = () => {
    const errs = {}
    if (!pwForm.currentPassword) errs.currentPassword = 'Required'
    if (!pwForm.newPassword) errs.newPassword = 'Required'
    else if (pwForm.newPassword.length < 8) errs.newPassword = 'Min 8 characters'
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pwForm.newPassword))
      errs.newPassword = 'Must include uppercase, lowercase and a number'
    if (pwForm.newPassword !== pwForm.confirmPassword)
      errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const handlePwSubmit = async e => {
    e.preventDefault()
    const errs = validatePw()
    if (Object.keys(errs).length) { setPwErrors(errs); return }
    setPwLoading(true)
    try {
      await authApi.updatePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      toast.success('Password updated — please log in again')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(logout, 1500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password')
    } finally { setPwLoading(false) }
  }

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Profile</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Your account details and settings</p>
      </motion.div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

        {/* Identity card */}
        <motion.div variants={item}>
          <GlassCard glow="cyan">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold glow-cyan"
                  style={{ background: 'linear-gradient(135deg, var(--cyan), var(--violet))', color: '#fff' }}>
                  {initials}
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 animate-pulse-emerald"
                  style={{ background: 'var(--emerald)', borderColor: 'var(--bg-base)' }} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</h3>
                <p className="text-sm truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {/* Role badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: user?.role === 'admin' ? 'rgba(167,139,250,0.12)' : 'rgba(56,189,248,0.1)',
                      border: `1px solid ${user?.role === 'admin' ? 'rgba(167,139,250,0.3)' : 'rgba(56,189,248,0.25)'}`,
                      color: user?.role === 'admin' ? 'var(--violet)' : 'var(--cyan)',
                    }}>
                    <Shield size={11} />
                    {user?.role === 'admin' ? 'Administrator' : 'User'}
                  </span>
                  {/* Active badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', color: 'var(--emerald)' }}>
                    <CheckCircle size={11} />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Account info */}
        <motion.div variants={item}>
          <GlassCard>
            <h4 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <User size={15} style={{ color: 'var(--cyan)' }} />
              Account Information
            </h4>
            <div className="space-y-0 divide-y" style={{ '--tw-divide-opacity': 1 }}>
              {[
                { icon: User,     label: 'Full Name',    value: user?.name },
                { icon: Mail,     label: 'Email',        value: user?.email },
                { icon: Shield,   label: 'Role',         value: user?.role === 'admin' ? 'Administrator' : 'User' },
                { icon: Activity, label: 'Last Login',   value: user?.lastLogin  ? formatDate(user.lastLogin)  : '—' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2.5">
                    <Icon size={14} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)', fontFamily: label === 'Email' ? 'var(--font-mono)' : 'inherit' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Change password */}
        <motion.div variants={item}>
          <GlassCard>
            <h4 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Lock size={15} style={{ color: 'var(--violet)' }} />
              Change Password
            </h4>
            <form onSubmit={handlePwSubmit} className="space-y-4">
              <FormField
                label="Current Password"
                name="currentPassword"
                type="password"
                value={pwForm.currentPassword}
                onChange={handlePwChange}
                placeholder="Enter current password"
                icon={Lock}
                error={pwErrors.currentPassword}
              />
              <FormField
                label="New Password"
                name="newPassword"
                type="password"
                value={pwForm.newPassword}
                onChange={handlePwChange}
                placeholder="Min 8 chars, uppercase & number"
                icon={Lock}
                error={pwErrors.newPassword}
              />
              <FormField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={pwForm.confirmPassword}
                onChange={handlePwChange}
                placeholder="Repeat new password"
                icon={Lock}
                error={pwErrors.confirmPassword}
              />

              {/* Password strength hints */}
              {pwForm.newPassword && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="rounded-xl p-3 space-y-1.5"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  {[
                    { label: 'At least 8 characters',          ok: pwForm.newPassword.length >= 8 },
                    { label: 'Contains uppercase letter',       ok: /[A-Z]/.test(pwForm.newPassword) },
                    { label: 'Contains lowercase letter',       ok: /[a-z]/.test(pwForm.newPassword) },
                    { label: 'Contains a number',               ok: /\d/.test(pwForm.newPassword) },
                  ].map(({ label, ok }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: ok ? 'rgba(52,211,153,0.15)' : 'rgba(61,96,128,0.2)' }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: ok ? 'var(--emerald)' : 'var(--text-muted)' }} />
                      </div>
                      <span className="text-xs" style={{ color: ok ? 'var(--emerald)' : 'var(--text-muted)' }}>{label}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              <div className="pt-1">
                <Button type="submit" loading={pwLoading} disabled={pwLoading} size="md">
                  <Save size={15} />
                  Update Password
                </Button>
              </div>
            </form>
          </GlassCard>
        </motion.div>

        {/* Danger zone */}
        <motion.div variants={item}>
          <GlassCard style={{ border: '1px solid rgba(251,113,133,0.15)' }}>
            <h4 className="font-bold text-sm mb-1 flex items-center gap-2" style={{ color: 'var(--rose)' }}>
              <AlertTriangle size={15} />
              Danger Zone
            </h4>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              Logging out will clear your session and require you to sign in again.
            </p>
            <Button variant="danger" size="sm" onClick={logout}>
              Sign out of all sessions
            </Button>
          </GlassCard>
        </motion.div>

      </motion.div>
    </div>
  )
}