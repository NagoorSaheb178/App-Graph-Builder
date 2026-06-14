import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

async function enableMocking() {
  const { worker } = await import('./mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocking().then(() => {
  const rootEl = document.getElementById('root')
  if (!rootEl) throw new Error('Root element not found')
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
