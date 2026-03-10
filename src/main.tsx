import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker with auto-update
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New version of GoalPulse available. Update now?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('GoalPulse is ready for offline use!')
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
