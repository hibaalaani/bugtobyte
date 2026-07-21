import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'

// ─── Batch Banner — update before each new intake ─────────────────────────────
const BATCH_CONFIG = {
  enabled: true,
  date: 'November 7',
  spotsLeft: 3,
  ctaPage: 'booking',
}

import { getWaUrl } from '@/utils/whatsapp'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'
import Navbar from '@/components/Navbar'
import ChatWidget from '@/components/ChatWidget'
import Trial from '@/pages/Trial'
import TrialAr from '@/pages/TrialAr'
import HomePage from '@/pages/Home'
import AboutPage from '@/pages/About'
import ContactPage from '@/pages/Contact'
import BookingPage from '@/pages/Booking'
import AuthPage from '@/pages/Auth'
import Dashboard from '@/pages/Dashboard'
import ResetPassword from '@/pages/ResetPassword'
import TermsPage from '@/pages/Terms'
import CoursePage from '@/pages/CoursePage'
import PrivacyPage from '@/pages/Privacy'
import ImpressumPage from '@/pages/Impressum'
import AdminPage from '@/pages/Admin'

const TRANSITION = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.22 } },
}

const HIDE_NAV = ['login', 'signup', 'reset-password', 'trial', 'trial-ar']

function AppInner() {
  const [page, setPage] = useState('home')
  const [bannerDismissed, setBanner] = useState(false)
  const { isRTL, lang } = useLanguage()
  const { isDark } = useTheme()
  const { user } = useAuth()

  const waUrl = getWaUrl(lang)
  const showBanner = BATCH_CONFIG.enabled && !bannerDismissed && !HIDE_NAV.includes(page)
  const bannerH = 40
  const topOffset = showBanner ? bannerH : 0

  useEffect(() => {
    if (user) {
      const returnTo = sessionStorage.getItem('returnTo')
      if (returnTo) {
        sessionStorage.removeItem('returnTo')
        setPage(returnTo)
      }
    }
  }, [user])

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.get('page') === 'trial') setPage('trial')
    if (p.get('page') === 'trial-ar') setPage('trial-ar')
    if (p.get('reset') === 'true') setPage('reset-password')
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
      case 'home': return <HomePage setPage={setPage} />
      case 'about': return <AboutPage setPage={setPage} />
      case 'contact': return <ContactPage />
      case 'trial': return <Trial setPage={setPage} />
      case 'trial-ar': return <TrialAr setPage={setPage} />
      case 'booking': return <BookingPage setPage={setPage} />
      case 'login': return <AuthPage setPage={setPage} initialMode="login" />
      case 'signup': return <AuthPage setPage={setPage} initialMode="signup" />
      case 'dashboard': return <Dashboard setPage={setPage} />
      case 'reset-password': return <ResetPassword setPage={setPage} />
      case 'terms': return <TermsPage setPage={setPage} />
      case 'course': return <CoursePage setPage={setPage} />
      case 'privacy': return <PrivacyPage setPage={setPage} />
      case 'impressum': return <ImpressumPage setPage={setPage} />
      case 'admin': return <AdminPage setPage={setPage} />
      default: return <HomePage setPage={setPage} />
    }
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} style={{ background: 'var(--bg-main)', minHeight: '100vh', fontFamily: isRTL ? '"Cairo", "Inter", sans-serif' : '"Inter", sans-serif' }}>
      <Toaster position="top-center" toastOptions={{ style: { background: isDark ? '#1a1f35' : '#ffffff', color: isDark ? '#F0EFE7' : '#1A1F3A', border: '1px solid var(--border-color)' } }} />

      {/* ── Urgency banner ── */}
      {showBanner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 201,
          height: bannerH,
          background: 'linear-gradient(90deg,rgb(252, 255, 64) 0%,rgb(248, 169, 66) 50%, rgb(252, 255, 64) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          padding: '0 48px',
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#000', whiteSpace: 'nowrap' }}>
            🚀 Next batch starts <strong>{BATCH_CONFIG.date}</strong>
            &nbsp;·&nbsp;
            Only <strong>{BATCH_CONFIG.spotsLeft} spots</strong> left
          </span>
          <button
            onClick={() => setPage(BATCH_CONFIG.ctaPage)}
            style={{ fontSize: 12, fontWeight: 800, color: '#000', background: 'rgba(0,0,0,0.15)', border: '1.5px solid rgba(0,0,0,0.25)', borderRadius: 20, padding: '3px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Book free demo →
          </button>
          <button
            onClick={() => setBanner(true)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.5)', display: 'flex', padding: 4 }}
            aria-label="Dismiss"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {!HIDE_NAV.includes(page) && <Navbar page={page} setPage={setPage} topOffset={topOffset} />}

      {/* ── Page content — shifted down when banner is visible ── */}
      <div style={{ marginTop: topOffset, transition: 'margin-top 0.3s ease' }}>
        <AnimatePresence mode="wait">
          <motion.div key={page} {...TRANSITION}>
            {render()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Floating WhatsApp button ── */}
      {!HIDE_NAV.includes(page) && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat with us on WhatsApp"
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
            width: 56, height: 56, borderRadius: '50%',
            background: '#25D366',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(37,211,102,0.5)',
            textDecoration: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,211,102,0.7)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.5)' }}
        >
          <WhatsAppIcon />
        </a>
      )}

      {/* ── Floating chat widget ── */}
      {!HIDE_NAV.includes(page) && <ChatWidget />}
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
