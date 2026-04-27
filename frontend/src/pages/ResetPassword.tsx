import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, ArrowRight, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import toast from 'react-hot-toast'

export default function ResetPassword({ setPage }: { setPage: (p: string) => void }) {
  const { session, loading } = useAuth()
  const { tr } = useLanguage()
  const r = tr.resetPw
  const [password,   setPassword]   = useState('')
  const [confirm,    setConfirm]    = useState('')
  const [showPass,   setShowPass]   = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { toast.error(r.minChars); return }
    if (password !== confirm)  { toast.error(r.noMatch); return }
    setSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSubmitting(false)
    if (error) { toast.error(error.message); return }
    toast.success(r.updated)
    setPage('dashboard')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,.05)',
    border: '1px solid rgba(255,255,255,.1)', borderRadius: 8,
    padding: '13px 14px 13px 42px', color: '#F0EFE7',
    fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, outline: 'none',
  }

  const status = loading ? 'waiting' : session ? 'ready' : 'expired'

  return (
    <div style={{ minHeight: '100vh', background: '#050A12', display: 'grid', placeItems: 'center', padding: '100px 24px 60px', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,255,135,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,135,.04) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
      <motion.div animate={{ opacity: [.15, .3, .15] }} transition={{ duration: 6, repeat: Infinity }} style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse,rgba(0,255,135,.12) 0%,transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 800, fontSize: 24, color: '#F0EFE7', marginBottom: 8 }}>
            Bug<span style={{ color: '#00FF87' }}>To</span>Byte
          </div>
          <h1 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700, fontSize: 28, color: '#F0EFE7', marginBottom: 8 }}>
            {status === 'expired' ? r.linkExpired : r.setNew}
          </h1>
          <p style={{ color: 'rgba(240,239,231,.5)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15 }}>
            {status === 'waiting' && r.verifying}
            {status === 'ready'   && r.chooseStrong}
            {status === 'expired' && r.expiredDesc}
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: 36 }}>

          {status === 'waiting' && (
            <div style={{ display: 'grid', placeItems: 'center', padding: '32px 0' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid rgba(0,255,135,.2)', borderTopColor: '#00FF87', animation: 'spin 0.8s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {status === 'expired' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.25)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
                <Mail size={24} color="#fbbf24" />
              </div>
              <p style={{ color: 'rgba(240,239,231,.55)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
                {r.requestNew}
              </p>
              <button onClick={() => setPage('login')} style={{ width: '100%', background: 'linear-gradient(135deg,#00FF87,#00D4AA)', color: '#050A12', border: 'none', borderRadius: 8, padding: '14px', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                {r.backToLogin}
              </button>
            </div>
          )}

          {status === 'ready' && (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: 12, letterSpacing: '0.08em', color: 'rgba(240,239,231,.6)', marginBottom: 8, textTransform: 'uppercase' }}>{r.newPassword}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,239,231,.35)' }} />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={r.minPh} required style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,255,135,.5)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'} />
                  <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(240,239,231,.4)', cursor: 'pointer', padding: 0 }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: 12, letterSpacing: '0.08em', color: 'rgba(240,239,231,.6)', marginBottom: 8, textTransform: 'uppercase' }}>{r.confirmPassword}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,239,231,.35)' }} />
                  <input type={showPass ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder={r.repeatPh} required style={{ ...inputStyle, paddingRight: 14 }}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,255,135,.5)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'} />
                </div>
              </div>

              <button type="submit" disabled={submitting} style={{ width: '100%', background: 'linear-gradient(135deg,#00FF87,#00D4AA)', color: '#050A12', border: 'none', borderRadius: 8, padding: '14px', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: submitting ? 0.6 : 1 }}>
                {submitting ? r.updating : r.updateBtn}
                {!submitting && <ArrowRight size={16} />}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
