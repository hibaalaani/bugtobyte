import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ContactPage() {
  const { tr } = useLanguage()
  const c = tr.contact
  const [form, setForm]     = useState({ name:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState<'idle'|'loading'|'success'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.message.length < 10) { toast.error(c.errShort); return }
    setStatus('loading')
    const { error } = await supabase.from('contact_messages').insert(form)
    if (error) { toast.error(c.errFailed); setStatus('idle'); return }
    setStatus('success')
  }

  return (
    <div style={{ background:'#050A12', color:'#F0EFE7', minHeight:'100vh', paddingTop:80 }}>
      {/* Header */}
      <div className="contact-head" style={{ padding:'80px 32px 60px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <motion.div animate={{ opacity:[.1,.25,.1] }} transition={{ duration:6, repeat:Infinity }} style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:300, background:'radial-gradient(ellipse,rgba(0,255,135,.1) 0%,transparent 70%)', pointerEvents:'none', filter:'blur(40px)' }} />
        <div style={{ maxWidth:600, margin:'0 auto', position:'relative', zIndex:1 }}>
          <motion.div initial={{ y:32, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:.7 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(0,255,135,.08)', border:'1px solid rgba(0,255,135,.2)', borderRadius:4, padding:'6px 16px', marginBottom:24, fontFamily:'IBM Plex Sans, sans-serif', fontWeight:600, fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'#00FF87' }}>{c.badge}</div>
            <h1 style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:800, fontSize:'clamp(34px,5vw,60px)', lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:20 }}>
              {c.title1}<span style={{ background:'linear-gradient(135deg,#00FF87,#60A5FA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{c.titleHighlight}</span>
            </h1>
            <p style={{ color:'rgba(240,239,231,.55)', fontSize:18, fontFamily:'IBM Plex Sans, sans-serif', lineHeight:1.75 }}>{c.subtitle}</p>
          </motion.div>
        </div>
      </div>

      <div className="contact-body" style={{ maxWidth:1100, margin:'0 auto', padding:'0 32px 100px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:48, alignItems:'flex-start' }}>
        {/* Info */}
        <motion.div initial={{ x:-40, opacity:0 }} animate={{ x:0, opacity:1 }} transition={{ duration:.7, delay:.1 }}>
          {[
            { icon:Mail,   color:'#00FF87', label: c.emailLbl, value:'hello@bugtobyte.com'    },
            { icon:Phone,  color:'#60A5FA', label: c.whatsapp, value:'+49 (0) — via WhatsApp'  },
            { icon:MapPin, color:'#A78BFA', label: c.location, value:'Berlin, Germany 🇩🇪'      },
            { icon:Clock,  color:'#f59e0b', label: c.hours,    value:'Mon–Sat, 9am–8pm CET'    },
          ].map(({ icon:Icon, color, label, value }) => (
            <motion.div key={label} whileHover={{ x:4 }} style={{ display:'flex', gap:18, alignItems:'center', padding:'20px 0', borderBottom:'1px solid rgba(255,255,255,.05)' }}>
              <div style={{ width:48, height:48, borderRadius:10, background:`${color}14`, border:`1px solid ${color}28`, display:'grid', placeItems:'center', flexShrink:0 }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <div style={{ fontSize:11, fontFamily:'IBM Plex Sans, sans-serif', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(240,239,231,.4)', marginBottom:4 }}>{label}</div>
                <div style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:600, fontSize:16, color:'#F0EFE7' }}>{value}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div initial={{ x:40, opacity:0 }} animate={{ x:0, opacity:1 }} transition={{ duration:.7, delay:.2 }} style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:12, padding:40 }}>
          {status === 'success' ? (
            <div style={{ textAlign:'center', padding:'40px 0' }}>
              <CheckCircle size={56} color="#00FF87" style={{ marginBottom:24 }} />
              <h3 style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:700, fontSize:24, marginBottom:12 }}>{c.successTitle}</h3>
              <p style={{ color:'rgba(240,239,231,.55)', fontFamily:'IBM Plex Sans, sans-serif', lineHeight:1.75, marginBottom:28 }}>{c.successDesc}</p>
              <button onClick={() => { setStatus('idle'); setForm({ name:'', email:'', subject:'', message:'' }); }} style={{ background:'rgba(0,255,135,.1)', border:'1px solid rgba(0,255,135,.3)', borderRadius:6, padding:'10px 24px', color:'#00FF87', cursor:'pointer', fontFamily:'IBM Plex Sans, sans-serif', fontWeight:600 }}>{c.sendAnother}</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h2 style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:700, fontSize:22, marginBottom:28 }}>{c.formTitle}</h2>
              {[{ k:'name' as const, l: c.nameLbl, type:'text', ph: c.namePh }, { k:'email' as const, l: c.emailFieldLbl, type:'email', ph: c.emailPh }, { k:'subject' as const, l: c.subjectLbl, type:'text', ph: c.subjectPh }].map(f => (
                <div key={f.k} style={{ marginBottom:20 }}>
                  <label style={{ display:'block', fontFamily:'IBM Plex Sans, sans-serif', fontWeight:600, fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(240,239,231,.5)', marginBottom:8 }}>{f.l}</label>
                  <input type={f.type} value={form[f.k]} onChange={e => setForm(fm => ({ ...fm, [f.k]:e.target.value }))} placeholder={f.ph} required style={{ width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:'13px 16px', color:'#F0EFE7', fontFamily:'IBM Plex Sans, sans-serif', fontSize:15, outline:'none' }} onFocus={e => e.target.style.borderColor='rgba(0,255,135,.5)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,.1)'} />
                </div>
              ))}
              <div style={{ marginBottom:28 }}>
                <label style={{ display:'block', fontFamily:'IBM Plex Sans, sans-serif', fontWeight:600, fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(240,239,231,.5)', marginBottom:8 }}>{c.messageLbl}</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message:e.target.value }))} placeholder={c.messagePh} rows={5} required style={{ width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, padding:'13px 16px', color:'#F0EFE7', fontFamily:'IBM Plex Sans, sans-serif', fontSize:15, resize:'vertical', outline:'none' }} onFocus={e => e.target.style.borderColor='rgba(0,255,135,.5)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,.1)'} />
              </div>
              <button type="submit" disabled={status==='loading'} style={{ width:'100%', background:'linear-gradient(135deg,#00FF87,#00D4AA)', color:'#050A12', border:'none', borderRadius:8, padding:'15px', fontFamily:'IBM Plex Sans, sans-serif', fontWeight:700, fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                {status==='loading' ? c.sending : <><Send size={16} /> {c.send}</>}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
