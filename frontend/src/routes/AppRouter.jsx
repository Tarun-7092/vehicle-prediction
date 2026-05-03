import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import AppLayout from '@/layouts/AppLayout'
import AuthLayout from '@/layouts/AuthLayout'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import PredictPage from '@/pages/PredictPage'
import HistoryPage from '@/pages/HistoryPage'
import AdminPage from '@/pages/AdminPage'
import ProfilePage from '@/pages/ProfilePage'
import LoadingScreen from '@/components/ui/LoadingScreen'

function Protected({ children, adminOnly = false }) {
  const { user, initializing, isAdmin } = useAuth()
  if (initializing) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

function PublicOnly({ children }) {
  const { user, initializing } = useAuth()
  if (initializing) return <LoadingScreen />
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />
        </Route>
        <Route element={<Protected><AppLayout /></Protected>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<Protected adminOnly><AdminPage /></Protected>} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}