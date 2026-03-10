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
          background:     'rgba(30,33,56,0.97)',
          border:         '1px solid rgba(255,203,119,0.25)',
          color:          '#E4E6F0',
          fontFamily:     '"Outfit", sans-serif',
          fontSize:       '14px',
          borderRadius:   '12px',
          backdropFilter: 'blur(20px)',
        },
        success: { iconTheme: { primary: '#FFCB77', secondary: '#1E2138' } },
        error:   { iconTheme: { primary: '#FF6B6B', secondary: '#1E2138' } },
      }}
    />
  </StrictMode>,
)
