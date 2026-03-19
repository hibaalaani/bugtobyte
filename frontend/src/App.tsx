import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'
import Navbar      from '@/components/Navbar'
import HomePage    from '@/pages/Home'
import AboutPage   from '@/pages/About'
import ContactPage from '@/pages/Contact'
import BookingPage from '@/pages/Booking'
import AuthPage    from '@/pages/Auth'
import Dashboard      from '@/pages/Dashboard'
import ResetPassword  from '@/pages/ResetPassword'

const TRANSITION = {
  initial:  { opacity: 0, y: 14 },
  animate:  { opacity: 1, y: 0,  transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
  exit:     { opacity: 0, y: -8, transition: { duration: 0.22 } },
}

const HIDE_NAV = ['login', 'signup', 'reset-password']

function AppInner() {
  const [page, setPage] = useState('home')
  const { isRTL } = useLanguage()
  const { isDark } = useTheme()

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.get('reset')   === 'true') setPage('reset-password')
    if (p.get('payment') === 'success') {
      setPage('dashboard')
      toast.success('Payment successful! Your booking is confirmed.')
    }
    if (p.get('payment') === 'cancelled') {
      toast.error('Payment cancelled. Your booking slot has been released.')
    }
    if (p.toString()) window.history.replaceState({}, '', window.location.pathname)
  }, [])

  const render = () => {
    switch (page) {
      case 'home':      return <HomePage    setPage={setPage} />
      case 'about':     return <AboutPage   setPage={setPage} />
      case 'contact':   return <ContactPage />
      case 'booking':   return <BookingPage setPage={setPage} />
      case 'login':     return <AuthPage    setPage={setPage} initialMode="login"  />
      case 'signup':    return <AuthPage    setPage={setPage} initialMode="signup" />
      case 'dashboard':      return <Dashboard      setPage={setPage} />
      case 'reset-password': return <ResetPassword  setPage={setPage} />
      default:               return <HomePage       setPage={setPage} />
    }
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} style={{ background: 'var(--bg-main)', minHeight: '100vh', fontFamily: isRTL ? '"Cairo", "Inter", sans-serif' : '"Inter", sans-serif' }}>
      <Toaster position="top-center" toastOptions={{ style: { background: isDark ? '#1a1f35' : '#ffffff', color: isDark ? '#F0EFE7' : '#1A1F3A', border: '1px solid var(--border-color)' } }} />
      {!HIDE_NAV.includes(page) && <Navbar page={page} setPage={setPage} />}
      <AnimatePresence mode="wait">
        <motion.div key={page} {...TRANSITION}>
          {render()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppInner />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
