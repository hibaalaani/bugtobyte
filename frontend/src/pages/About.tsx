import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Zap, Globe, GraduationCap, Award, Users, ArrowRight } from 'lucide-react'

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  return (
    <motion.div ref={ref} initial={{ y: 48, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const VALUES = [
  { icon: Shield, title: 'Safe & Supportive',  desc: 'Small groups (max 6), encouraging instructors, and a judgement-free zone where making mistakes is part of learning.' },
  { icon: Zap,    title: 'Project-Based',       desc: 'Every session ends with something built. Kids leave with real Scratch games, AI models, or Python apps they\'re proud of.' },
  { icon: Globe,  title: 'Future-Ready Skills', desc: 'We teach AI literacy, computational thinking, and real coding — skills employers and universities will demand for decades.' },
]

const TEAM = [
  { name: 'Hiba Al-Aani', role: 'Founder & Lead Instructor', bio: 'Passionate educator and technologist based in Berlin. Created BugToByte to give every child access to high-quality, live coding education — regardless of background.', initials: 'HA', color: '#00FF87' },
]

export default function AboutPage({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div style={{ background: '#050A12', color: '#F0EFE7', paddingTop: 80 }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="about-hero" style={{ position:'relative', padding:'100px 32px 80px', textAlign:'center', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(0,255,135,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,135,.04) 1px,transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none' }} />
        <motion.div animate={{ opacity:[.2,.4,.2], scale:[1,1.1,1] }} transition={{ duration:8, repeat:Infinity }} style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:400, background:'radial-gradient(ellipse,rgba(0,255,135,.08) 0%,transparent 70%)', pointerEvents:'none', filter:'blur(40px)' }} />

        <div style={{ maxWidth:760, margin:'0 auto', position:'relative', zIndex:1 }}>
          <Reveal>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(0,255,135,.08)', border:'1px solid rgba(0,255,135,.2)', borderRadius:4, padding:'6px 16px', marginBottom:28, fontFamily:'IBM Plex Sans, sans-serif', fontWeight:600, fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'#00FF87' }}>
              Our Mission
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:800, fontSize:'clamp(38px,6vw,72px)', lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:28 }}>
              Turning Curiosity Into{' '}
              <span style={{ background:'linear-gradient(135deg,#00FF87,#60A5FA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Superpowers</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontSize:'clamp(16px,2vw,19px)', color:'rgba(240,239,231,.6)', lineHeight:1.8, fontFamily:'IBM Plex Sans, sans-serif' }}>
              We believe every child is a born problem-solver. Our mission is to give them the language of the future — AI &amp; code — so they can build the world they imagine.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────── */}
      <section className="about-section" style={{ maxWidth:1100, margin:'0 auto', padding:'80px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:24 }}>
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.12}>
              <motion.div whileHover={{ y:-6 }} transition={{ duration:.3 }} style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:12, padding:36, height:'100%' }}>
                <div style={{ width:52, height:52, borderRadius:10, background:'rgba(0,255,135,.1)', border:'1px solid rgba(0,255,135,.2)', display:'grid', placeItems:'center', marginBottom:24 }}>
                  <v.icon size={24} color="#00FF87" />
                </div>
                <h3 style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:700, fontSize:20, marginBottom:14, color:'#F0EFE7' }}>{v.title}</h3>
                <p style={{ color:'rgba(240,239,231,.55)', lineHeight:1.8, fontSize:15, fontFamily:'IBM Plex Sans, sans-serif' }}>{v.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────────── */}
      <section style={{ borderTop:'1px solid rgba(255,255,255,.06)', borderBottom:'1px solid rgba(255,255,255,.06)', background:'rgba(255,255,255,.015)' }}>
        <div className="story-grid" style={{ maxWidth:1100, margin:'0 auto', padding:'100px 32px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:80, alignItems:'center' }}>
          <Reveal>
            <div style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:600, fontSize:12, letterSpacing:'0.15em', textTransform:'uppercase', color:'#00FF87', marginBottom:20 }}>Our Story</div>
            <h2 style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:800, fontSize:'clamp(28px,4vw,44px)', lineHeight:1.15, letterSpacing:'-0.02em', marginBottom:28 }}>
              Born from a Simple Question
            </h2>
            <p style={{ color:'rgba(240,239,231,.6)', lineHeight:1.85, fontSize:16, fontFamily:'IBM Plex Sans, sans-serif', marginBottom:20 }}>
              BugToByte was born in Berlin with a simple conviction: every child deserves to understand the technology shaping their world — not just use it. We saw a gap between expensive private tutors and impersonal video courses, and built something better.
            </p>
            <p style={{ color:'rgba(240,239,231,.6)', lineHeight:1.85, fontSize:16, fontFamily:'IBM Plex Sans, sans-serif', marginBottom:32 }}>
              Small live groups, expert instructors, and real projects — so kids don't just learn to code, they learn to think, create, and build with confidence.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              {[
                { icon: Award,  label: 'Based in',      value: 'Berlin' },
                { icon: Users,  label: 'Class size',    value: 'Max 6'  },
                { icon: Globe,  label: 'Languages',     value: 'EN·DE·AR' },
                { icon: GraduationCap, label: 'Courses', value: '3'     },
              ].map(s => (
                <div key={s.label} style={{ padding:'16px 20px', background:'rgba(0,255,135,.05)', border:'1px solid rgba(0,255,135,.15)', borderRadius:10 }}>
                  <s.icon size={18} color="#00FF87" style={{ marginBottom:8 }} />
                  <div style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:800, fontSize:24, color:'#F0EFE7' }}>{s.value}</div>
                  <div style={{ fontSize:12, color:'rgba(240,239,231,.45)', fontFamily:'IBM Plex Sans, sans-serif', marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ position:'relative' }}>
              <div style={{ aspectRatio:'1', borderRadius:16, background:'linear-gradient(135deg,rgba(0,255,135,.1),rgba(99,102,241,.08))', border:'1px solid rgba(0,255,135,.12)', display:'grid', placeItems:'center' }}>
                <motion.div animate={{ rotate:[0, 360] }} transition={{ duration:40, repeat:Infinity, ease:'linear' }} style={{ position:'absolute', width:'80%', height:'80%', borderRadius:'50%', border:'1px dashed rgba(0,255,135,.15)' }} />
                <motion.div animate={{ rotate:[360, 0] }} transition={{ duration:25, repeat:Infinity, ease:'linear' }} style={{ position:'absolute', width:'60%', height:'60%', borderRadius:'50%', border:'1px dashed rgba(96,165,250,.15)' }} />
                <div style={{ textAlign:'center', zIndex:1 }}>
                  <div style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:800, fontSize:80, color:'rgba(0,255,135,.2)', lineHeight:1 }}>B2B</div>
                  <div style={{ fontFamily:'IBM Plex Sans, sans-serif', fontSize:14, color:'rgba(240,239,231,.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:8 }}>Academy</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────── */}
      <section className="about-section" style={{ maxWidth:1100, margin:'0 auto', padding:'100px 32px' }}>
        <Reveal>
          <div style={{ textAlign:'center', marginBottom:72 }}>
            <div style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:600, fontSize:12, letterSpacing:'0.15em', textTransform:'uppercase', color:'#00FF87', marginBottom:16 }}>The Team</div>
            <h2 style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:800, fontSize:'clamp(30px,4vw,48px)', lineHeight:1.1, letterSpacing:'-0.02em' }}>The Minds Behind the Magic</h2>
          </div>
        </Reveal>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:24 }}>
          {TEAM.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.12}>
              <motion.div whileHover={{ y:-6 }} transition={{ duration:.3 }} style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:12, padding:36 }}>
                <div style={{ width:72, height:72, borderRadius:12, background:`linear-gradient(135deg,${member.color}33,${member.color}11)`, border:`1px solid ${member.color}33`, display:'grid', placeItems:'center', marginBottom:24, fontFamily:'IBM Plex Sans, sans-serif', fontWeight:800, fontSize:22, color:member.color }}>
                  {member.initials}
                </div>
                <h3 style={{ fontFamily:'IBM Plex Sans, sans-serif', fontWeight:700, fontSize:19, marginBottom:6, color:'#F0EFE7' }}>{member.name}</h3>
                <div style={{ fontSize:12, color:'#00FF87', fontFamily:'IBM Plex Sans, sans-serif', fontWeight:600, letterSpacing:'0.05em', marginBottom:16 }}>{member.role}</div>
                <p style={{ color:'rgba(240,239,231,.55)', fontSize:14, lineHeight:1.8, fontFamily:'IBM Plex Sans, sans-serif' }}>{member.bio}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Reveal>
        <div style={{ maxWidth:1100, margin:'0 auto 100px', padding:'0 32px', textAlign:'center' }}>
          <button onClick={() => { setPage('booking'); window.scrollTo({ top:0 }); }} style={{ background:'linear-gradient(135deg,#00FF87,#00D4AA)', color:'#050A12', border:'none', borderRadius:4, padding:'16px 36px', fontFamily:'IBM Plex Sans, sans-serif', fontWeight:700, fontSize:16, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:10 }}>
            Book Your Free Demo <ArrowRight size={18} />
          </button>
        </div>
      </Reveal>

    </div>
  )
}
