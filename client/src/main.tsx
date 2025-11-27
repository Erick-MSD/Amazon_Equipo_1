import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './assets/css/styles.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Toast from './components/Toast'
import './styles/echodot.css'

const container = document.getElementById('root')!
createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter basename={(import.meta as any).env?.BASE_URL || (import.meta as any).env?.VITE_BASE_URL || '/'}>
      <App />
      <Toast />
    </BrowserRouter>
  </React.StrictMode>
)
