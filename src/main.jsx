import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Let the app control scrolling instead of restoring the previous document
// position on refresh. pageshow also covers a page restored from browser cache.
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
window.addEventListener('pageshow', resetScroll)
resetScroll()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
