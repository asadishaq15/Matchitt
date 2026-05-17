import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { initScrollEngine } from './lib/scrollEngine'
import App from './App.jsx'

initScrollEngine()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
