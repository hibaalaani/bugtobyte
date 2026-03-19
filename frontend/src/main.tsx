import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background:     'rgba(10,12,26,0.97)',
          border:         '1px solid rgba(0,229,255,0.20)',
          color:          '#F0F2FF',
          fontFamily:     '"IBM Plex Sans", sans-serif',
          fontSize:       '14px',
          borderRadius:   '12px',
          backdropFilter: 'blur(20px)',
        },
        success: { iconTheme: { primary: '#FFD60A', secondary: '#0A0C1A' } },
        error:   { iconTheme: { primary: '#FF4081', secondary: '#0A0C1A' } },
      }}
    />
  </StrictMode>,
)
