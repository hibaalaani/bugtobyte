import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, getDay, isToday, isSaturday, isSunday,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Clock, CheckCircle, ArrowRight, Wifi, BookOpen, Video, Star } from 'lucide-react'
import { supabase, Course } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useAvailability } from '@/hooks/useAvailability'
import toast from 'react-hot-toast'

const TIME_SLOTS = ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00']
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Sentinel object for the free demo — not a real DB course
const FREE_DEMO: Course = {
  id:             'free-demo',
  title:          'Free Demo Session',
  slug:           'free-demo',
  description:    '30 minutes live with one of our expert instructors. No commitment, no payment — just come and see if your child loves it.',
  category:       'Demo',
  age_min:        7,
  age_max:        17,
  duration_weeks: 0,
  price_usd:      0,
  thumbnail_url:  null,
  is_active:      true,
  sort_order:     0,
}

// ── Calendar grid ─────────────────────────────────────────────

function CalendarGrid({ month, onSelect, selected }: { month: Date; onSelect: (d: Date) => void; selected: Date | null }) {
  const days     = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) })
  const startPad = getDay(startOfMonth(month))
  const today    = new Date(); today.setHours(0,0,0,0)

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:8 }}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} style={{ textAlign:'center', fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:11, color:'rgba(240,239,231,.3)', letterSpacing:'0.08em', padding:'8px 0' }}>{d}</div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
        {[...Array(startPad)].map((_, i) => <div key={`pad-${i}`} />)}
        {days.map(day => {
          const isWeekend  = isSaturday(day) || isSunday(day)
          const isPastDay  = day < today
          const isDisabled = isWeekend || isPastDay
          const isSel      = selected && format(day,'yyyy-MM-dd') === format(selected,'yyyy-MM-dd')
          const isTodayDay = isToday(day)
          return (
            <motion.button
              key={day.toISOString()}
              whileHover={!isDisabled ? { scale:1.08 } : {}}
              whileTap={!isDisabled ? { scale:0.95 } : {}}
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect(day)}
              style={{
                aspectRatio:'1', borderRadius:8,
                border: isTodayDay && !isSel ? '1px solid rgba(0,255,135,.4)' : isSel ? 'none' : '1px solid transparent',
                background: isSel ? 'linear-gradient(135deg,#00FF87,#00D4AA)' : isTodayDay ? 'rgba(0,255,135,.08)' : 'rgba(255,255,255,.03)',
                color: isSel ? '#050A12' : isDisabled ? 'rgba(240,239,231,.18)' : '#F0EFE7',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                fontFamily:'Syne, sans-serif', fontWeight: isSel ? 700 : 400, fontSize:13,
                display:'grid', placeItems:'center', transition:'background .15s',
              }}
            >
              {format(day,'d')}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────

export default function BookingPage({ setPage }: { setPage: (p: string) => void }) {
  const { user, session } = useAuth()

  // Steps: 1 = choose session type, 2 = date/time, 3 = confirm, 4 = success (free only)
  const [step, setStep] = useState<1|2|3|4>(1)

  // Step 1 – session/course choice
  const [courses,     setCourses]     = useState<Course[]>([])
  const [selCourse,   setSelCourse]   = useState<Course | null>(null)
  const [loadCourses, setLoadCourses] = useState(true)

  // Step 2 – calendar
  const [month,   setMonth]   = useState(new Date())
  const [selDate, setSelDate] = useState<Date | null>(null)
  const [selTime, setSelTime] = useState<string | null>(null)

  // Step 3 – confirm
  const [kidName, setKidName] = useState('')
  const [kidAge,  setKidAge]  = useState('')
  const [notes,   setNotes]   = useState('')
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState<any>(null)

  const dateStr = selDate ? format(selDate,'yyyy-MM-dd') : null
  const { bookedSlots, loading: slotsLoading } = useAvailability(dateStr)

  const isFreeDemo = selCourse?.id === 'free-demo'

  // Fetch paid courses
  useEffect(() => {
    supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => { setCourses(data ?? []); setLoadCourses(false) })
  }, [])

  // ── Confirm booking ──────────────────────────────────────────
  const handleConfirm = async () => {
    if (!user || !session) { toast.error('Please log in first'); setPage('login'); return }
    if (!selDate || !selTime || !selCourse) return
    setLoading(true)

    const fullNotes = [
      kidName ? `Child: ${kidName}${kidAge ? `, age ${kidAge}` : ''}` : '',
      notes,
    ].filter(Boolean).join('\n')

    if (isFreeDemo) {
      // ── Free demo: insert as confirmed, no payment needed ────
      const { data: appt, error } = await supabase
        .from('appointments')
        .insert({
          parent_id: user.id,
          course_id: null,
          appt_date: format(selDate,'yyyy-MM-dd'),
          time_slot: selTime,
          notes:     fullNotes || null,
          status:    'confirmed',
        })
        .select()
        .single()

      if (error) {
        if (error.code === '23505') toast.error('That slot was just taken! Please choose another.')
        else toast.error(error.message)
        setLoading(false)
        return
      }

      // Send confirmation email (best-effort — don't block the success screen)
      fetch(`${API}/api/bookings/confirm`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ bookingId: appt.id }),
      }).then(async r => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}))
          console.error('[confirm email] backend error', r.status, body)
          toast.error(`Booking confirmed but email failed: ${body.error ?? r.status}`)
        }
      }).catch(err => {
        console.error('[confirm email] network error', err)
        toast.error('Booking confirmed but could not send email. Is the backend running?')
      })

      setBooking(appt)
      setStep(4)
      setLoading(false)

    } else {
      // ── Paid course: insert as pending, redirect to Stripe ───
      const { data: appt, error: apptErr } = await supabase
        .from('appointments')
        .insert({
          parent_id: user.id,
          course_id: selCourse.id,
          appt_date: format(selDate,'yyyy-MM-dd'),
          time_slot: selTime,
          notes:     fullNotes || null,
          status:    'pending',
        })
        .select()
        .single()

      if (apptErr) {
        if (apptErr.code === '23505') toast.error('That slot was just taken! Please choose another.')
        else toast.error(apptErr.message)
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${API}/api/stripe/create-checkout`, {
          method:  'POST',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ booking_id: appt.id, course_id: selCourse.id }),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Checkout failed')

        window.location.href = data.url
      } catch (err: any) {
        // Free the slot if Stripe setup failed
        await supabase.from('appointments').update({ status:'cancelled' }).eq('id', appt.id)
        toast.error(err.message || 'Payment setup failed. Please try again.')
        setLoading(false)
      }
    }
  }

  // ── Step labels ───────────────────────────────────────────────
  const stepLabels = ['Choose Session', 'Pick Date & Time', 'Confirm']

  return (
    <div style={{ background:'#050A12', color:'#F0EFE7', minHeight:'100vh', paddingTop:80, overflowX:'hidden' }}>
      <div style={{ position:'fixed', inset:0, backgroundImage:'linear-gradient(rgba(0,255,135,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,135,.03) 1px,transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none', zIndex:0 }} />

      <div className="booking-inner" style={{ maxWidth:1000, margin:'0 auto', padding:'60px 32px', position:'relative', zIndex:1 }}>

        {/* Header */}
        {step !== 4 && (
          <motion.div initial={{ y:32, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:.7 }} style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(0,255,135,.08)', border:'1px solid rgba(0,255,135,.2)', borderRadius:4, padding:'6px 16px', marginBottom:24, fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'#00FF87' }}>
              <Wifi size={12} /> Live Availability
            </div>
            <h1 style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'clamp(32px,5vw,52px)', lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:16 }}>
              Book a <span style={{ background:'linear-gradient(135deg,#00FF87,#60A5FA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Session</span>
            </h1>
            <p style={{ color:'rgba(240,239,231,.55)', fontSize:17, fontFamily:'DM Sans, sans-serif', lineHeight:1.75 }}>
              Start with a free demo or jump straight into a course.
            </p>
          </motion.div>
        )}

        {/* Progress (steps 1–3 only) */}
        {step !== 4 && (
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', marginBottom:56 }}>
            {stepLabels.map((label, i) => {
              const n = i + 1
              return (
                <div key={n} style={{ display:'flex', alignItems:'center' }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                    <motion.div
                      animate={{ background: step >= n ? 'linear-gradient(135deg,#00FF87,#00D4AA)' : 'rgba(255,255,255,.08)', color: step >= n ? '#050A12' : 'rgba(240,239,231,.35)' }}
                      style={{ width:36, height:36, borderRadius:'50%', display:'grid', placeItems:'center', fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:14 }}
                    >
                      {step > n ? <CheckCircle size={16} /> : n}
                    </motion.div>
                    <span style={{ fontSize:11, fontFamily:'Syne, sans-serif', color: step >= n ? 'rgba(240,239,231,.7)' : 'rgba(240,239,231,.25)', whiteSpace:'nowrap', letterSpacing:'0.05em' }}>{label}</span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div style={{ width:72, height:1, background: step > n ? 'rgba(0,255,135,.5)' : 'rgba(255,255,255,.08)', margin:'0 8px 22px' }} />
                  )}
                </div>
              )
            })}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ── STEP 1: Choose session type ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-24 }} transition={{ duration:.5 }}>

              {/* Free demo card — always first */}
              <div style={{ marginBottom:24 }}>
                <p style={{ fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:12, letterSpacing:'0.1em', color:'rgba(240,239,231,.4)', textTransform:'uppercase', marginBottom:14 }}>Try for free</p>
                <motion.button
                  whileHover={{ y:-3 }}
                  whileTap={{ scale:.99 }}
                  onClick={() => setSelCourse(FREE_DEMO)}
                  style={{
                    width:'100%', textAlign:'left', cursor:'pointer',
                    background: isFreeDemo ? 'rgba(0,255,135,.08)' : 'rgba(255,255,255,.03)',
                    border: isFreeDemo ? '1.5px solid rgba(0,255,135,.5)' : '1px solid rgba(255,255,255,.08)',
                    borderRadius:12, padding:'24px 28px', transition:'all .2s',
                    display:'flex', alignItems:'center', gap:20, flexWrap:'wrap',
                  }}
                >
                  <div style={{ width:52, height:52, borderRadius:12, background:'rgba(0,255,135,.12)', border:'1px solid rgba(0,255,135,.25)', display:'grid', placeItems:'center', flexShrink:0 }}>
                    <Star size={24} color="#00FF87" />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:18, color:'#F0EFE7', marginBottom:6 }}>Free Demo Session</div>
                    <div style={{ fontFamily:'DM Sans, sans-serif', fontSize:14, color:'rgba(240,239,231,.5)', lineHeight:1.6 }}>
                      30 minutes live with an expert instructor. No commitment, no card — just come and see if your child loves it.
                    </div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:24, color:'#00FF87' }}>Free</div>
                    <div style={{ fontFamily:'DM Sans, sans-serif', fontSize:12, color:'rgba(240,239,231,.4)', marginTop:2 }}>No payment</div>
                  </div>
                  {isFreeDemo && <CheckCircle size={20} color="#00FF87" style={{ flexShrink:0 }} />}
                </motion.button>
              </div>

              {/* Paid courses */}
              <p style={{ fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:12, letterSpacing:'0.1em', color:'rgba(240,239,231,.4)', textTransform:'uppercase', marginBottom:14 }}>Or choose a course</p>

              {loadCourses ? (
                <div style={{ textAlign:'center', padding:40, color:'rgba(240,239,231,.4)', fontFamily:'DM Sans, sans-serif' }}>Loading courses...</div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16, marginBottom:32 }}>
                  {courses.map(c => {
                    const isSel = selCourse?.id === c.id
                    return (
                      <motion.button
                        key={c.id}
                        whileHover={{ y:-3 }}
                        whileTap={{ scale:.98 }}
                        onClick={() => setSelCourse(c)}
                        style={{
                          textAlign:'left', cursor:'pointer',
                          background: isSel ? 'rgba(96,165,250,.08)' : 'rgba(255,255,255,.03)',
                          border: isSel ? '1.5px solid rgba(96,165,250,.5)' : '1px solid rgba(255,255,255,.08)',
                          borderRadius:12, padding:24, transition:'all .2s',
                        }}
                      >
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                          <div style={{ background:'rgba(96,165,250,.12)', border:'1px solid rgba(96,165,250,.2)', borderRadius:6, padding:'4px 12px', fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:11, color:'#60A5FA', letterSpacing:'0.08em' }}>
                            {c.category}
                          </div>
                          {isSel && <CheckCircle size={18} color="#60A5FA" />}
                        </div>
                        <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:17, color:'#F0EFE7', marginBottom:8 }}>{c.title}</div>
                        <div style={{ fontFamily:'DM Sans, sans-serif', fontSize:13, color:'rgba(240,239,231,.5)', lineHeight:1.6, marginBottom:16 }}>{c.description}</div>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <span style={{ fontFamily:'DM Sans, sans-serif', fontSize:12, color:'rgba(240,239,231,.4)' }}>Ages {c.age_min}–{c.age_max} · {c.duration_weeks}wks</span>
                          <span style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:20, color:'#F0EFE7' }}>${c.price_usd}</span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              )}

              <div style={{ textAlign:'center' }}>
                <motion.button
                  animate={{ opacity: selCourse ? 1 : 0.35 }}
                  onClick={() => selCourse && setStep(2)}
                  disabled={!selCourse}
                  style={{ background:'linear-gradient(135deg,#00FF87,#00D4AA)', color:'#050A12', border:'none', borderRadius:8, padding:'14px 40px', fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:15, cursor: selCourse ? 'pointer' : 'not-allowed', display:'inline-flex', alignItems:'center', gap:8 }}
                >
                  Continue <ArrowRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Date + time ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-24 }} transition={{ duration:.5 }}>
              <button onClick={() => setStep(1)} style={{ background:'none', border:'none', color:'rgba(240,239,231,.45)', cursor:'pointer', display:'flex', alignItems:'center', gap:6, marginBottom:28, fontSize:14, fontFamily:'DM Sans, sans-serif' }}><ChevronLeft size={16} /> Back</button>

              {/* Selected session summary */}
              <div style={{ background: isFreeDemo ? 'rgba(0,255,135,.06)' : 'rgba(96,165,250,.06)', border: `1px solid ${isFreeDemo ? 'rgba(0,255,135,.2)' : 'rgba(96,165,250,.2)'}`, borderRadius:10, padding:'14px 20px', marginBottom:28, display:'flex', alignItems:'center', gap:12 }}>
                <BookOpen size={16} color={isFreeDemo ? '#00FF87' : '#60A5FA'} />
                <span style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:15, color:'#F0EFE7' }}>{selCourse?.title}</span>
                <span style={{ marginLeft:'auto', fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:16, color: isFreeDemo ? '#00FF87' : '#F0EFE7' }}>
                  {isFreeDemo ? 'Free' : `$${selCourse?.price_usd}`}
                </span>
              </div>

              <div className="booking-cal-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24 }}>

                {/* Calendar */}
                <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:12, padding:28 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                    <button onClick={() => setMonth(m => subMonths(m,1))} style={{ background:'rgba(255,255,255,.06)', border:'none', borderRadius:8, padding:'8px 12px', color:'#F0EFE7', cursor:'pointer' }}><ChevronLeft size={16} /></button>
                    <span style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:16 }}>{format(month,'MMMM yyyy')}</span>
                    <button onClick={() => setMonth(m => addMonths(m,1))} style={{ background:'rgba(255,255,255,.06)', border:'none', borderRadius:8, padding:'8px 12px', color:'#F0EFE7', cursor:'pointer' }}><ChevronRight size={16} /></button>
                  </div>
                  <CalendarGrid month={month} onSelect={d => { setSelDate(d); setSelTime(null) }} selected={selDate} />
                  <p style={{ fontSize:11, color:'rgba(240,239,231,.3)', marginTop:16, fontFamily:'DM Sans, sans-serif', textAlign:'center' }}>Weekdays only · Slots update live</p>
                </div>

                {/* Time slots */}
                <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:12, padding:28 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:24 }}>
                    <Clock size={16} color="#00FF87" />
                    <span style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:16 }}>
                      {selDate ? format(selDate,'EEEE, MMM d') : 'Select a date first'}
                    </span>
                    {slotsLoading && <div style={{ width:14, height:14, borderRadius:'50%', border:'2px solid #00FF87', borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }} />}
                  </div>

                  {!selDate ? (
                    <div style={{ display:'grid', placeItems:'center', height:200, color:'rgba(240,239,231,.25)', fontFamily:'DM Sans, sans-serif', fontSize:14, textAlign:'center' }}>← Pick a date to see<br />live available slots</div>
                  ) : (
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                      {TIME_SLOTS.map(t => {
                        const taken = bookedSlots.includes(t)
                        const isSel = selTime === t
                        return (
                          <motion.button
                            key={t}
                            disabled={taken}
                            whileHover={!taken ? { scale:1.04 } : {}}
                            whileTap={!taken ? { scale:.97 } : {}}
                            onClick={() => !taken && setSelTime(t)}
                            style={{
                              background: isSel ? 'linear-gradient(135deg,#00FF87,#00D4AA)' : taken ? 'rgba(248,113,113,.07)' : 'rgba(255,255,255,.05)',
                              border: isSel ? 'none' : taken ? '1px solid rgba(248,113,113,.2)' : '1px solid rgba(255,255,255,.1)',
                              borderRadius:8, padding:'13px 0',
                              color: isSel ? '#050A12' : taken ? 'rgba(248,113,113,.5)' : '#F0EFE7',
                              cursor: taken ? 'not-allowed' : 'pointer',
                              fontFamily:'Syne, sans-serif', fontWeight: isSel ? 700 : 500, fontSize:14, transition:'all .15s',
                              textDecoration: taken ? 'line-through' : 'none',
                              textDecorationColor: 'rgba(248,113,113,.6)',
                              textDecorationThickness: 2,
                            }}
                          >
                            {t}
                            {taken && <div style={{ fontSize:9, color:'rgba(248,113,113,.45)', marginTop:2, textDecoration:'none' }}>Taken</div>}
                          </motion.button>
                        )
                      })}
                    </div>
                  )}

                  <motion.button
                    animate={{ opacity: selDate && selTime ? 1 : 0.35 }}
                    onClick={() => selDate && selTime && setStep(3)}
                    disabled={!selDate || !selTime}
                    style={{ width:'100%', marginTop:24, background:'linear-gradient(135deg,#00FF87,#00D4AA)', color:'#050A12', border:'none', borderRadius:8, padding:'14px', fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:15, cursor: selDate && selTime ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
                  >
                    Continue <ArrowRight size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Confirm ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-24 }} transition={{ duration:.5 }}>
              <div className="booking-confirm" style={{ maxWidth:520, margin:'0 auto', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:12, padding:40 }}>
                <button onClick={() => setStep(2)} style={{ background:'none', border:'none', color:'rgba(240,239,231,.45)', cursor:'pointer', display:'flex', alignItems:'center', gap:6, marginBottom:28, fontSize:14, fontFamily:'DM Sans, sans-serif' }}><ChevronLeft size={16} /> Back</button>

                <h2 style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:24, marginBottom:28 }}>
                  {isFreeDemo ? 'Confirm Your Free Session' : 'Confirm & Pay'}
                </h2>

                {/* Summary */}
                <div style={{ background: isFreeDemo ? 'rgba(0,255,135,.06)' : 'rgba(96,165,250,.06)', border:`1px solid ${isFreeDemo ? 'rgba(0,255,135,.2)' : 'rgba(96,165,250,.2)'}`, borderRadius:10, padding:20, marginBottom:24 }}>
                  {[
                    { label:'Session', value: selCourse?.title },
                    { label:'Date',    value: selDate && format(selDate,'EEEE, MMMM d, yyyy') },
                    { label:'Time',    value: selTime ? `${selTime} (UK time)` : '' },
                    { label:'Price',   value: isFreeDemo ? 'Free' : `$${selCourse?.price_usd}` },
                  ].map(row => (
                    <div key={row.label} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                      <span style={{ color:'rgba(240,239,231,.5)', fontFamily:'DM Sans, sans-serif', fontSize:14 }}>{row.label}</span>
                      <span style={{ fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:14, color: row.label === 'Price' && isFreeDemo ? '#00FF87' : '#F0EFE7' }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Kid info */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:'block', fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:12, letterSpacing:'0.08em', color:'rgba(240,239,231,.6)', marginBottom:8, textTransform:'uppercase' }}>Child's Name</label>
                  <input value={kidName} onChange={e => setKidName(e.target.value)} placeholder="e.g. Emma" style={{ width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:'12px 16px', color:'#F0EFE7', fontFamily:'DM Sans, sans-serif', fontSize:15, outline:'none', boxSizing:'border-box' }} onFocus={e => e.target.style.borderColor='rgba(0,255,135,.5)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,.1)'} />
                </div>

                <div style={{ marginBottom:16 }}>
                  <label style={{ display:'block', fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:12, letterSpacing:'0.08em', color:'rgba(240,239,231,.6)', marginBottom:8, textTransform:'uppercase' }}>Child's Age</label>
                  <input type="number" min={5} max={17} value={kidAge} onChange={e => setKidAge(e.target.value)} placeholder="e.g. 10" style={{ width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:'12px 16px', color:'#F0EFE7', fontFamily:'DM Sans, sans-serif', fontSize:15, outline:'none', boxSizing:'border-box' }} onFocus={e => e.target.style.borderColor='rgba(0,255,135,.5)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,.1)'} />
                </div>

                <div style={{ marginBottom:28 }}>
                  <label style={{ display:'block', fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:12, letterSpacing:'0.08em', color:'rgba(240,239,231,.6)', marginBottom:8, textTransform:'uppercase' }}>Notes (Optional)</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Experience level, questions, anything we should know..." rows={3} style={{ width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:'12px 16px', color:'#F0EFE7', fontFamily:'DM Sans, sans-serif', fontSize:15, resize:'vertical', outline:'none', boxSizing:'border-box' }} onFocus={e => e.target.style.borderColor='rgba(0,255,135,.5)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,.1)'} />
                </div>

                {!user && (
                  <div style={{ background:'rgba(251,191,36,.08)', border:'1px solid rgba(251,191,36,.3)', borderRadius:10, padding:16, marginBottom:20 }}>
                    <p style={{ color:'#fbbf24', fontSize:14, fontFamily:'DM Sans, sans-serif' }}>⚠️ You need to log in to confirm your booking.</p>
                    <button onClick={() => setPage('login')} style={{ marginTop:10, background:'rgba(251,191,36,.15)', border:'1px solid rgba(251,191,36,.3)', borderRadius:6, padding:'8px 16px', color:'#fbbf24', cursor:'pointer', fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:13 }}>Sign In / Sign Up</button>
                  </div>
                )}

                <button
                  onClick={handleConfirm}
                  disabled={loading || !user}
                  style={{ width:'100%', background:'linear-gradient(135deg,#00FF87,#00D4AA)', color:'#050A12', border:'none', borderRadius:8, padding:'16px', fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:16, cursor: !user || loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, opacity: !user ? 0.5 : 1 }}
                >
                  {loading
                    ? (isFreeDemo ? 'Confirming...' : 'Redirecting to payment...')
                    : (isFreeDemo ? <><CheckCircle size={18} /> Confirm Free Session</> : <>Proceed to Payment · ${selCourse?.price_usd}</>)
                  }
                </button>

                {!isFreeDemo && (
                  <p style={{ textAlign:'center', marginTop:14, fontSize:12, color:'rgba(240,239,231,.3)', fontFamily:'DM Sans, sans-serif' }}>
                    Secured by Stripe · Your slot is held for 30 min
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: Success (free demo only) ── */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }} transition={{ duration:.6 }}>
              <div style={{ maxWidth:500, margin:'0 auto', textAlign:'center' }}>
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:200, delay:.2 }} style={{ width:88, height:88, borderRadius:'50%', background:'rgba(0,255,135,.12)', border:'1px solid rgba(0,255,135,.3)', display:'grid', placeItems:'center', margin:'0 auto 32px' }}>
                  <CheckCircle size={44} color="#00FF87" />
                </motion.div>
                <h1 style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:40, marginBottom:16 }}>You're Booked!</h1>
                <p style={{ color:'rgba(240,239,231,.6)', fontFamily:'DM Sans, sans-serif', fontSize:17, lineHeight:1.75, marginBottom:32 }}>
                  Your free demo is set for <strong style={{ color:'#F0EFE7' }}>{selDate && format(selDate,'MMMM d')}</strong> at <strong style={{ color:'#F0EFE7' }}>{selTime}</strong>.<br />A confirmation email is on its way!
                </p>
                {booking?.zoom_link && (
                  <a href={booking.zoom_link} target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(37,99,235,.2)', border:'1px solid rgba(37,99,235,.4)', borderRadius:8, padding:'12px 24px', color:'#60A5FA', fontFamily:'Syne, sans-serif', fontWeight:600, textDecoration:'none', marginBottom:28 }}>
                    <Video size={18} /> Join Zoom Meeting
                  </a>
                )}
                <br />
                <button onClick={() => { setPage('dashboard'); window.scrollTo({ top:0 }) }} style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:'12px 28px', color:'#F0EFE7', cursor:'pointer', fontFamily:'Syne, sans-serif', fontWeight:600, fontSize:14 }}>
                  Go to Dashboard →
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
