import { motion } from 'framer-motion'
import { useState } from 'react'
import { Calendar, Clock, Video, LogOut, Plus, CheckCircle, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useBookings } from '@/hooks/useBookings'
import toast from 'react-hot-toast'
import ConfirmModal from '@/components/ConfirmModal'
import { useLanguage } from '@/contexts/LanguageContext'

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  confirmed: { bg: 'rgba(0,255,135,.1)',  color: '#00FF87' },
  pending:   { bg: 'rgba(251,191,36,.1)', color: '#fbbf24' },
  cancelled: { bg: 'rgba(248,113,113,.1)',color: '#f87171' },
  completed: { bg: 'rgba(96,165,250,.1)', color: '#60A5FA' },
}

export default function Dashboard({ setPage }: { setPage: (p: string) => void }) {
  const { profile, signOut } = useAuth()
  const { bookings, loading, cancelBooking } = useBookings()
  const { tr } = useLanguage()
  const d = tr.dashboard
  const upcoming = bookings.filter(b => b.status !== 'cancelled' && b.status !== 'completed')
  const past     = bookings.filter(b => b.status === 'completed')
  const [cancelId, setCancelId] = useState<string | null>(null)

  const handleCancel = async () => {
    if (!cancelId) return
    const msg = tr.dashboard.bookingCancelled
    setCancelId(null)
    await cancelBooking(cancelId)
    toast.success(msg)
  }

  return (
    <div style={{ background:'#050A12', color:'#F0EFE7', minHeight:'100vh', paddingTop:80 }}>
      <ConfirmModal
        open={cancelId !== null}
        title={d.cancelModal.title}
        message={d.cancelModal.message}
        confirmLabel={d.cancelModal.confirm}
        cancelLabel={d.cancelModal.keep}
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
      />
      {/* Header */}
      <div style={{ borderBottom:'1px solid rgba(255,255,255,.06)', background:'rgba(255,255,255,.02)' }}>
        <div className="dash-head" style={{ maxWidth:1100, margin:'0 auto', padding:'40px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:20 }}>
          <div>
            <div style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:600, fontSize:12, letterSpacing:'0.12em', textTransform:'uppercase', color:'#00FF87', marginBottom:10 }}>{tr.nav.dashboard}</div>
            <h1 style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:800, fontSize:'clamp(26px,4vw,40px)', lineHeight:1.1 }}>
              {d.welcome} <span style={{ background:'linear-gradient(135deg,#00FF87,#60A5FA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{profile?.full_name?.split(' ')[0] ?? ''}</span>
            </h1>
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <motion.button whileHover={{ y:-2 }} onClick={() => { setPage('booking'); window.scrollTo({ top:0 }); }} style={{ background:'linear-gradient(135deg,#00FF87,#00D4AA)', color:'#050A12', border:'none', borderRadius:6, padding:'11px 22px', fontFamily:'IBM Plex Sans, sans-serif', fontWeight:700, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
              <Plus size={16} /> {tr.nav.bookDemo}
            </motion.button>
            <motion.button whileHover={{ y:-2 }} onClick={async () => { await signOut(); setPage('home'); }} style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:6, padding:'11px 18px', color:'rgba(240,239,231,.6)', fontFamily:'IBM Plex Sans, sans-serif', fontWeight:600, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
              <LogOut size={15} /> {tr.nav.signOut}
            </motion.button>
          </div>
        </div>
      </div>

      <div className="dash-body" style={{ maxWidth:1100, margin:'0 auto', padding:'48px 32px' }}>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:48 }}>
          {[
            { label: d.upcoming,  value: upcoming.length,                                              icon: Calendar,    color:'#00FF87' },
            { label: d.completed, value: bookings.filter(b => b.status === 'completed').length,        icon: CheckCircle, color:'#60A5FA' },
            { label: d.profile,  value: profile?.full_name?.split(' ')[0] ?? '—', icon: User, color:'#A78BFA' },
          ].map(s => (
            <motion.div key={s.label} initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:10, padding:'20px 24px', display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:44, height:44, borderRadius:10, background:`${s.color}18`, border:`1px solid ${s.color}30`, display:'grid', placeItems:'center', flexShrink:0 }}>
                <s.icon size={20} color={s.color} />
              </div>
              <div>
                <div style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:800, fontSize:22, color:'#F0EFE7' }}>{s.value}</div>
                <div style={{ fontSize:12, color:'rgba(240,239,231,.4)', fontFamily:'IBM Plex Sans, sans-serif', marginTop:2 }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Upcoming bookings */}
        <div style={{ marginBottom:48 }}>
          <h2 style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:700, fontSize:20, marginBottom:24, display:'flex', alignItems:'center', gap:10 }}>
            {d.upcomingLessons}
            {upcoming.length > 0 && <span style={{ background:'rgba(0,255,135,.15)', color:'#00FF87', borderRadius:50, padding:'2px 10px', fontSize:12, fontWeight:700 }}>{upcoming.length}</span>}
          </h2>

          {loading ? (
            <div style={{ textAlign:'center', padding:48, color:'rgba(240,239,231,.4)', fontFamily:'IBM Plex Sans, sans-serif' }}>{d.loading}</div>
          ) : upcoming.length === 0 ? (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ background:'rgba(255,255,255,.02)', border:'1px dashed rgba(255,255,255,.08)', borderRadius:12, padding:'60px 32px', textAlign:'center' }}>
              <Calendar size={48} style={{ color:'rgba(240,239,231,.15)', marginBottom:20 }} />
              <h3 style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:700, fontSize:20, marginBottom:10, color:'rgba(240,239,231,.6)' }}>{d.noUpcoming}</h3>
              <p style={{ color:'rgba(240,239,231,.35)', fontFamily:'IBM Plex Sans, sans-serif', marginBottom:28 }}>{d.noUpcomingDesc}</p>
              <button onClick={() => { setPage('booking'); window.scrollTo({ top:0 }); }} style={{ background:'linear-gradient(135deg,#00FF87,#00D4AA)', color:'#050A12', border:'none', borderRadius:6, padding:'12px 28px', fontFamily:'IBM Plex Sans, sans-serif', fontWeight:700, fontSize:14, cursor:'pointer' }}>
                {d.bookFreeDemo}
              </button>
            </motion.div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {upcoming.map((b, i) => (
                <motion.div key={b.id} initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay: i*0.07 }} style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:10, padding:'22px 28px', display:'flex', gap:20, alignItems:'center', flexWrap:'wrap' }}>
                  <div style={{ width:50, height:50, borderRadius:10, background:'rgba(0,255,135,.08)', border:'1px solid rgba(0,255,135,.2)', display:'grid', placeItems:'center', flexShrink:0 }}>
                    <Calendar size={22} color="#00FF87" />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:700, fontSize:17, marginBottom:4 }}>
                      {b.course_title ?? 'Demo Lesson'}
                    </div>
                    <div style={{ display:'flex', gap:16, color:'rgba(240,239,231,.5)', fontFamily:'IBM Plex Sans, sans-serif', fontSize:14 }}>
                      <span style={{ display:'flex', alignItems:'center', gap:5 }}><Calendar size={13} /> {b.appt_date}</span>
                      <span style={{ display:'flex', alignItems:'center', gap:5 }}><Clock size={13} /> {b.time_slot?.slice(0,5)}</span>
                    </div>
                    {b.zoom_link && (
                      <a href={b.zoom_link} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:5, color:'#60A5FA', fontSize:13, textDecoration:'none', marginTop:8 }}>
                        <Video size={13} /> {d.joinZoom}
                      </a>
                    )}
                  </div>
                  <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
                    <span style={{ background:STATUS_STYLES[b.status]?.bg, color:STATUS_STYLES[b.status]?.color, borderRadius:50, padding:'4px 14px', fontSize:12, fontFamily:'IBM Plex Sans, sans-serif', fontWeight:700 }}>{b.status}</span>
                    <button onClick={() => setCancelId(b.id)} style={{ background:'rgba(248,113,113,.08)', border:'1px solid rgba(248,113,113,.2)', borderRadius:6, padding:'6px 14px', color:'#f87171', cursor:'pointer', fontSize:12, fontFamily:'IBM Plex Sans, sans-serif', fontWeight:600 }}>{d.cancel}</button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Past bookings */}
        {past.length > 0 && (
          <div>
            <h2 style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:700, fontSize:18, marginBottom:20, color:'rgba(240,239,231,.6)' }}>{d.pastSessions}</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {past.map(b => (
                <div key={b.id} style={{ background:'rgba(255,255,255,.02)', border:'1px solid rgba(255,255,255,.04)', borderRadius:10, padding:'16px 24px', display:'flex', gap:16, alignItems:'center', flexWrap:'wrap', opacity:.65 }}>
                  <div style={{ flex:1 }}>
                    <span style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:600, fontSize:15 }}>{b.course_title ?? 'Demo Lesson'}</span>
                    <span style={{ color:'rgba(240,239,231,.4)', fontFamily:'IBM Plex Sans, sans-serif', fontSize:13, marginLeft:16 }}>{b.appt_date} · {b.time_slot?.slice(0,5)}</span>
                  </div>
                  <span style={{ background:STATUS_STYLES[b.status]?.bg, color:STATUS_STYLES[b.status]?.color, borderRadius:50, padding:'3px 12px', fontSize:12, fontFamily:'IBM Plex Sans, sans-serif', fontWeight:700 }}>{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
