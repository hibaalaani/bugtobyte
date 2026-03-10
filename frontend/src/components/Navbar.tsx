import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const NAV_LINKS = [
  { label: 'Home',    page: 'home'    },
  { label: 'About',   page: 'about'   },
  { label: 'Contact', page: 'contact' },
]

export default function Navbar({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const { profile, signOut } = useAuth()
  const [open,    setOpen]    = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = (p: string) => { setPage(p); setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position:     'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          background:   scrolled ? 'rgba(5,10,18,.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,.06)' : 'none',
          transition:   'all .35s ease',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 68, display: 'flex', alignItems: 'center', gap: 32 }}>

          {/* Logo */}
          <button onClick={() => go('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: '#F0EFE7', letterSpacing: '-0.02em', flexShrink: 0 }}>
            Bug<span style={{ color: '#00FF87' }}>To</span>Byte
          </button>

          {/* Desktop nav */}
          <div className="nav-links" style={{ display: 'flex', gap: 4, flex: 1 }}>
            {NAV_LINKS.map(link => (
              <button key={link.page} onClick={() => go(link.page)} style={{ background: page === link.page ? 'rgba(0,255,135,.08)' : 'none', border: 'none', borderRadius: 6, padding: '8px 16px', color: page === link.page ? '#00FF87' : 'rgba(240,239,231,.6)', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14, transition: 'all .2s' }} onMouseEnter={e => { if (page !== link.page) e.currentTarget.style.color='rgba(240,239,231,.9)' }} onMouseLeave={e => { if (page !== link.page) e.currentTarget.style.color='rgba(240,239,231,.6)' }}>
                {link.label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="nav-actions" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {profile ? (
              <>
                <button onClick={() => go('dashboard')} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 6, padding: '8px 16px', color: '#F0EFE7', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <User size={14} /> {profile.full_name?.split(' ')[0] ?? 'Dashboard'}
                </button>
                <button onClick={async () => { await signOut(); go('home'); }} style={{ background: 'none', border: '1px solid rgba(255,255,255,.1)', borderRadius: 6, padding: '8px 12px', color: 'rgba(240,239,231,.5)', cursor: 'pointer' }}>
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => go('login')} style={{ background: 'none', border: '1px solid rgba(255,255,255,.12)', borderRadius: 6, padding: '8px 18px', color: 'rgba(240,239,231,.75)', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 13, transition: 'all .2s' }} onMouseEnter={e => e.currentTarget.style.borderColor='rgba(0,255,135,.4)'} onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,.12)'}>
                  Sign In
                </button>
                <button onClick={() => go('booking')} style={{ background: 'linear-gradient(135deg,#00FF87,#00D4AA)', border: 'none', borderRadius: 6, padding: '9px 20px', color: '#050A12', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, boxShadow: '0 0 24px rgba(0,255,135,.25)' }}>
                  Book Demo
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(o => !o)} style={{ display: 'none', background: 'none', border: 'none', color: '#F0EFE7', cursor: 'pointer', padding: 4 }} className="mobile-menu-btn">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:.25 }} style={{ position:'fixed', top:68, left:0, right:0, zIndex:199, background:'rgba(5,10,18,.97)', borderBottom:'1px solid rgba(255,255,255,.08)', padding:'20px 32px 28px' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {[...NAV_LINKS, { label:'Book a Demo', page:'booking' }].map(link => (
                <button key={link.page} onClick={() => go(link.page)} style={{ background:'none', border:'none', textAlign:'left', padding:'12px 4px', color:'#F0EFE7', cursor:'pointer', fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:17, borderBottom:'1px solid rgba(255,255,255,.04)' }}>{link.label}</button>
              ))}
              {profile ? (
                <button onClick={async () => { await signOut(); go('home'); }} style={{ background:'none', border:'none', textAlign:'left', padding:'12px 4px', color:'rgba(240,239,231,.45)', cursor:'pointer', fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:17 }}>Sign Out</button>
              ) : (
                <button onClick={() => go('login')} style={{ background:'none', border:'none', textAlign:'left', padding:'12px 4px', color:'rgba(240,239,231,.7)', cursor:'pointer', fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:17 }}>Sign In</button>
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
