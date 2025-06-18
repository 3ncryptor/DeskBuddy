import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster position="top-right" toastOptions={{
      style: { borderRadius: '12px', background: '#fff', color: '#222', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
      success: { style: { background: '#e6fffa', color: '#222' } },
      error: { style: { background: '#fff0f0', color: '#d32f2f' } }
    }} />
  </StrictMode>,
)
