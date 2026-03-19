import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, User, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Navbar({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const { profile, signOut } = useAuth()
  const { tr } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const NAV_LINKS = [
    { label: tr.nav.home,    page: 'home'    },
    { label: tr.nav.about,   page: 'about'   },
    { label: tr.nav.contact, page: 'contact' },
  ]

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = (p: string) => { setPage(p); setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const navBg = scrolled
    ? 'var(--bg-nav)'
    : isDark ? 'transparent' : 'rgba(238,242,255,0.90)'

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          background: navBg,
          backdropFilter: (scrolled || !isDark) ? 'blur(20px)' : 'none',
          borderBottom: (scrolled || !isDark) ? '1px solid var(--border-color)' : 'none',
          transition: 'all .35s ease',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', height: 72, display: 'flex', alignItems: 'center', gap: 8 }}>

          {/* Logo */}
          <button onClick={() => go('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, display: 'flex', alignItems: 'center', marginRight: 8 }}>
            <span style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontWeight: 900,
              fontSize: 28,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'baseline',
              userSelect: 'none',
            }}>
              <span style={{ color: isDark ? '#F0F2FF' : '#1A1F3A', WebkitTextStroke: '2px #FFD60A', paintOrder: 'stroke fill' }}>Bug</span>
              <span style={{ color: '#FFD60A', WebkitTextStroke: isDark ? '2px #0A0C1A' : '2px #1A1F3A', paintOrder: 'stroke fill' }}>To</span>
              <span style={{ color: isDark ? '#F0F2FF' : '#1A1F3A', WebkitTextStroke: '2px #00E5FF', paintOrder: 'stroke fill' }}>Byte</span>
            </span>
          </button>

          {/* Desktop nav links */}
          <div className="nav-links" style={{ display: 'flex', gap: 2, flex: 1 }}>
            {NAV_LINKS.map(link => (
              <button key={link.page} onClick={() => go(link.page)}
                style={{
                  background: page === link.page
                    ? (isDark ? 'rgba(255,214,10,0.10)' : 'rgba(180,83,9,0.09)')
                    : 'none',
                  border: 'none', borderRadius: 8,
                  padding: '7px 15px',
                  color: page === link.page ? 'var(--nav-link-active)' : 'var(--nav-link-color)',
                  cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: 14,
                  transition: 'all .2s',
                }}
                onMouseEnter={e => { if (page !== link.page) e.currentTarget.style.color = 'var(--nav-link-hover)' }}
                onMouseLeave={e => { if (page !== link.page) e.currentTarget.style.color = 'var(--nav-link-color)' }}>
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="nav-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>

            {/* Language switcher */}
            <LanguageSwitcher />

            {/* Divider */}
            <div style={{ width: 1, height: 22, background: 'var(--border-color)' }} />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                padding: '6px 8px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = isDark ? '#FFD60A' : '#E8960A'; e.currentTarget.style.color = isDark ? '#FFD60A' : '#E8960A' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Auth */}
            {profile ? (
              <>
                <button onClick={() => go('dashboard')}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '6px 14px', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User size={14} /> {profile.full_name?.split(' ')[0] ?? tr.nav.dashboard}
                </button>
                <button onClick={async () => { await signOut(); go('home') }}
                  style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: 8, padding: '6px 10px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <button onClick={() => go('login')}
                style={{
                  background: 'linear-gradient(135deg, #FFD60A, #FFE040)',
                  border: 'none', borderRadius: 8,
                  padding: '7px 18px',
                  color: '#0A0C1A',
                  cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700, fontSize: 13,
                  transition: 'all .2s',
                  boxShadow: '0 2px 12px rgba(255,214,10,0.35)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,214,10,0.55)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(255,214,10,0.35)' }}>
                {tr.nav.signIn}
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(o => !o)}
            style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: 4, marginLeft: 'auto' }}
            className="mobile-menu-btn">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .25 }}
            style={{ position: 'fixed', top: 72, left: 0, right: 0, zIndex: 199, background: 'var(--bg-mobile-menu)', borderBottom: '1px solid var(--border-color)', padding: '20px 28px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <LanguageSwitcher />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {NAV_LINKS.map(link => (
                <button key={link.page} onClick={() => go(link.page)}
                  style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px 4px', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: 17, borderBottom: '1px solid var(--divider)' }}>
                  {link.label}
                </button>
              ))}
              <div style={{ padding: '14px 4px', borderBottom: '1px solid var(--divider)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: 15 }}>
                  {isDark ? 'Dark mode' : 'Light mode'}
                </span>
                <button onClick={toggleTheme}
                  style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '6px 8px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {isDark ? <Sun size={15} /> : <Moon size={15} />}
                </button>
              </div>
              {profile ? (
                <button onClick={async () => { await signOut(); go('home') }}
                  style={{ background: 'none', border: 'none', textAlign: 'left', padding: '12px 4px', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: 17 }}>
                  {tr.nav.signOut}
                </button>
              ) : (
                <button onClick={() => go('login')}
                  style={{ marginTop: 8, background: 'linear-gradient(135deg, #FFD60A, #FFE040)', border: 'none', borderRadius: 10, padding: '12px', color: '#0A0C1A', cursor: 'pointer', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700, fontSize: 15, textAlign: 'center' }}>
                  {tr.nav.signIn}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .nav-links, .nav-actions { display: none !important; }
        }
      `}</style>
    </>
  )
}
