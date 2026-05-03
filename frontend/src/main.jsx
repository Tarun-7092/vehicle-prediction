import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import AppRouter from '@/routes/AppRouter'
import '@/styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1829',
            color: '#e2f0ff',
            border: '1px solid rgba(99,179,237,0.14)',
            borderRadius: '12px',
            fontFamily: 'Syne, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#0d1829' } },
          error:   { iconTheme: { primary: '#fb7185', secondary: '#0d1829' } },
          duration: 3500,
        }}
      />
    </AuthProvider>
  </StrictMode>
)