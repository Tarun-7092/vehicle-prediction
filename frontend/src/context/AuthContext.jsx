import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '@/api/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const verify = async () => {
      if (!token) { setInitializing(false); return }
      try {
        const { data } = await authApi.getMe()
        setUser(data.data.user)
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null); setUser(null)
      } finally { setInitializing(false) }
    }
    verify()
  }, [])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const { data } = await authApi.login(credentials)
      const { token: t, user: u } = data.data
      localStorage.setItem('token', t)
      localStorage.setItem('user', JSON.stringify(u))
      setToken(t); setUser(u)
      toast.success(`Welcome back, ${u.name.split(' ')[0]}!`)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      toast.error(msg)
      return { success: false, message: msg }
    } finally { setLoading(false) }
  }, [])

  const register = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const { data } = await authApi.register(credentials)
      const { token: t, user: u } = data.data
      localStorage.setItem('token', t)
      localStorage.setItem('user', JSON.stringify(u))
      setToken(t); setUser(u)
      toast.success('Account created successfully!')
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
      return { success: false, message: msg }
    } finally { setLoading(false) }
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout() } catch {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null); setUser(null)
    toast.success('Logged out successfully')
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, initializing, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}