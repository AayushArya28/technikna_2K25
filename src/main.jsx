import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  {/* <App /> */}
    <div className="pt-25 min-h-screen flex items-center justify-center bg-black">
      <img
        src="/images/coming-soon.jpg"
        alt="Coming Soon"
        className="max-w-xs sm:max-w-sm md:max-w-md opacity-90"
      />
    </div>
  </StrictMode>,
)
