import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Chrome } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

type Mode = 'login' | 'signup' | 'forgot'

export default function AuthPage({ setPage, initialMode = 'login' }: { setPage: (p: string) => void; initialMode?: Mode }) {
  const [mode,     setMode]     = useState<Mode>(initialMode)
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)

  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (mode === 'login') {
      const { error } = await signInWithEmail(email, password)
      if (error) {
        const msg = error.message.toLowerCase()
        if (msg.includes('email') && (msg.includes('confirm') || msg.includes('verif'))) {
          toast.error('Please confirm your email first — check your inbox.')
        } else {
          toast.error(error.message)
        }
        setLoading(false)
        return
      }
      toast.success('Welcome back!')
      setPage('dashboard')
    }

    if (mode === 'signup') {
      if (!name.trim()) { toast.error('Please enter your name'); setLoading(false); return }
      if (password.length < 8) { toast.error('Password must be at least 8 characters'); setLoading(false); return }
      const { error } = await signUpWithEmail(email, password, name)
      if (error) { toast.error(error.message); setLoading(false); return }
      toast.success('Account created! Check your email to confirm.')
      setMode('login')
    }

    if (mode === 'forgot') {
      const { createClient } = await import('@supabase/supabase-js')
      const sb = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/?reset=true` })
      if (error) { toast.error(error.message) } else { toast.success('Reset link sent! Check your inbox.'); setMode('login') }
    }

    setLoading(false)
  }

  const handleGoogle = async () => {
    try { await signInWithGoogle() }
    catch { toast.error('Google sign-in failed. Try again.') }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#050A12', display:'grid', placeItems:'center', padding:'100px 24px 60px', position:'relative' }}>
      {/* Grid bg */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(0,255,135,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,135,.04) 1px,transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none' }} />
      <motion.div animate={{ opacity:[.15,.3,.15] }} transition={{ duration:6, repeat:Infinity }} style={{ position:'absolute', top:'30%', left:'50%', transform:'translateX(-50%)', width:600, height:400, background:'radial-gradient(ellipse,rgba(0,255,135,.12) 0%,transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />

      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} style={{ width:'100%', maxWidth:440, position:'relative', zIndex:1 }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:24, color:'#F0EFE7', marginBottom:8 }}>
            Bug<span style={{ color:'#00FF87' }}>To</span>Byte
          </div>
          <h1 style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:28, color:'#F0EFE7', marginBottom:8 }}>
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
          </h1>
          <p style={{ color:'rgba(240,239,231,.5)', fontFamily:'DM Sans, sans-serif', fontSize:15 }}>
            {mode === 'login' ? 'Sign in to manage your bookings' : mode === 'signup' ? 'Join 1,200+ families learning with us' : 'We\'ll send you a secure reset link'}
          </p>
        </div>

        <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:12, padding:36 }}>

          {/* Google button */}
          {mode !== 'forgot' && (
            <>
              <button onClick={handleGoogle} style={{ width:'100%', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:8, padding:'13px 20px', color:'#F0EFE7', fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:24, transition:'background .2s' }} onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,.09)')} onMouseLeave={e => (e.currentTarget.style.background='rgba(255,255,255,.06)')}>
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.2 0 5.7 1.1 7.6 2.9l5.6-5.6C33.7 3.5 29.2 1.5 24 1.5 14.9 1.5 7.2 6.8 3.6 14.4l6.6 5.1C12 13.8 17.4 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h12.7c-.6 3-2.4 5.5-4.9 7.2l7.6 5.9c4.5-4.2 7.1-10.3 7.1-17.2z"/><path fill="#FBBC05" d="M10.2 28.5a14.6 14.6 0 010-9l-6.6-5.1A22.6 22.6 0 001.5 24c0 3.6.9 7.1 2.5 10.1l6.2-5.6z"/><path fill="#34A853" d="M24 46.5c5.2 0 9.6-1.7 12.8-4.6l-7.6-5.9c-1.7 1.1-3.9 1.8-5.2 1.8-6.6 0-12-4.3-13.8-10l-6.2 5.6C7.2 41.2 14.9 46.5 24 46.5z"/></svg>
                Continue with Google
              </button>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
                <div style={{ flex:1, height:1, background:'rgba(255,255,255,.1)' }} />
                <span style={{ fontSize:12, color:'rgba(240,239,231,.35)', fontFamily:'DM Sans, sans-serif' }}>or continue with email</span>
                <div style={{ flex:1, height:1, background:'rgba(255,255,255,.1)' }} />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div style={{ marginBottom:18 }}>
                <label style={{ display:'block', fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:12, letterSpacing:'0.08em', color:'rgba(240,239,231,.6)', marginBottom:8, textTransform:'uppercase' }}>Full Name</label>
                <div style={{ position:'relative' }}>
                  <User size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(240,239,231,.35)' }} />
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" required style={{ width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:'13px 14px 13px 42px', color:'#F0EFE7', fontFamily:'DM Sans, sans-serif', fontSize:15, outline:'none' }} onFocus={e => e.target.style.borderColor='rgba(0,255,135,.5)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,.1)'} />
                </div>
              </div>
            )}

            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:12, letterSpacing:'0.08em', color:'rgba(240,239,231,.6)', marginBottom:8, textTransform:'uppercase' }}>Email Address</label>
              <div style={{ position:'relative' }}>
                <Mail size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(240,239,231,.35)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" required style={{ width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:'13px 14px 13px 42px', color:'#F0EFE7', fontFamily:'DM Sans, sans-serif', fontSize:15, outline:'none' }} onFocus={e => e.target.style.borderColor='rgba(0,255,135,.5)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,.1)'} />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div style={{ marginBottom: mode === 'login' ? 8 : 28 }}>
                <label style={{ display:'block', fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:12, letterSpacing:'0.08em', color:'rgba(240,239,231,.6)', marginBottom:8, textTransform:'uppercase' }}>Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(240,239,231,.35)' }} />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'Min 8 characters' : '••••••••'} required style={{ width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:'13px 44px 13px 42px', color:'#F0EFE7', fontFamily:'DM Sans, sans-serif', fontSize:15, outline:'none' }} onFocus={e => e.target.style.borderColor='rgba(0,255,135,.5)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,.1)'} />
                  <button type="button" onClick={() => setShowPass(s => !s)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(240,239,231,.4)', cursor:'pointer', padding:0 }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div style={{ textAlign:'right', marginBottom:24 }}>
                <button type="button" onClick={() => setMode('forgot')} style={{ background:'none', border:'none', color:'rgba(0,255,135,.7)', cursor:'pointer', fontFamily:'DM Sans, sans-serif', fontSize:13 }}>Forgot password?</button>
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width:'100%', background:'linear-gradient(135deg,#00FF87,#00D4AA)', color:'#050A12', border:'none', borderRadius:8, padding:'14px', fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:loading?0.6:1 }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div style={{ textAlign:'center', marginTop:24, paddingTop:24, borderTop:'1px solid rgba(255,255,255,.07)' }}>
            {mode === 'login' ? (
              <p style={{ color:'rgba(240,239,231,.5)', fontFamily:'DM Sans, sans-serif', fontSize:14 }}>
                No account?{' '}
                <button onClick={() => setMode('signup')} style={{ background:'none', border:'none', color:'#00FF87', cursor:'pointer', fontWeight:600, fontFamily:'inherit', fontSize:'inherit' }}>Sign up free</button>
              </p>
            ) : (
              <button onClick={() => setMode('login')} style={{ background:'none', border:'none', color:'rgba(240,239,231,.5)', cursor:'pointer', fontFamily:'DM Sans, sans-serif', fontSize:14 }}>
                ← Back to login
              </button>
            )}
          </div>
        </div>

        {/* Back to site */}
        <div style={{ textAlign:'center', marginTop:24 }}>
          <button onClick={() => { setPage('home'); window.scrollTo({ top:0 }); }} style={{ background:'none', border:'none', color:'rgba(240,239,231,.3)', cursor:'pointer', fontFamily:'DM Sans, sans-serif', fontSize:13 }}>← Back to site</button>
        </div>
      </motion.div>
    </div>
  )
}
