import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Zap, Globe, GraduationCap, Award, Users, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  return (
    <motion.div ref={ref} initial={{ y: 48, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const VALUE_ICONS = [Shield, Zap, Globe]
const STAT_ICONS  = [Award, Users, Globe, GraduationCap]
const STAT_VALUES = ['Berlin', 'Max 6', 'EN·DE·AR', '3']

export default function AboutPage({ setPage }: { setPage: (p: string) => void }) {
  const { tr } = useLanguage()
  const a = tr.about

  return (
    <div style={{ background: '#050A12', color: '#F0EFE7', paddingTop: 80 }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="about-hero" style={{ position: 'relative', padding: '100px 32px 80px', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,255,135,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,135,.04) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
        <motion.div animate={{ opacity: [.2, .4, .2], scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse,rgba(0,255,135,.08) 0%,transparent 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,255,135,.08)', border: '1px solid rgba(0,255,135,.2)', borderRadius: 4, padding: '6px 16px', marginBottom: 28, fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00FF87' }}>
              {a.missionTag}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(38px,6vw,72px)', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 28 }}>
              {a.missionTitle.split('Superpowers').length > 1 ? (
                <>{a.missionTitle.split('Superpowers')[0]}<span style={{ background: 'linear-gradient(135deg,#00FF87,#60A5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Superpowers</span></>
              ) : a.missionTitle}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontSize: 'clamp(16px,2vw,19px)', color: 'rgba(240,239,231,.6)', lineHeight: 1.8, fontFamily: 'IBM Plex Sans, sans-serif' }}>
              {a.missionSubtitle}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────── */}
      <section className="about-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24 }}>
          {a.values.map((v, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: .3 }} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: 36, height: '100%' }}>
                <div style={{ width: 52, height: 52, borderRadius: 10, background: 'rgba(0,255,135,.1)', border: '1px solid rgba(0,255,135,.2)', display: 'grid', placeItems: 'center', marginBottom: 24 }}>
                  {(() => { const Icon = VALUE_ICONS[i]; return <Icon size={24} color="#00FF87" /> })()}
                </div>
                <h3 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 14, color: '#F0EFE7' }}>{v.title}</h3>
                <p style={{ color: 'rgba(240,239,231,.55)', lineHeight: 1.8, fontSize: 15, fontFamily: 'IBM Plex Sans, sans-serif' }}>{v.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,.06)', borderBottom: '1px solid rgba(255,255,255,.06)', background: 'rgba(255,255,255,.015)' }}>
        <div className="story-grid" style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 80, alignItems: 'center' }}>
          <Reveal>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#00FF87', marginBottom: 20 }}>{a.storyTag}</div>
            <h2 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(28px,4vw,44px)', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 28 }}>
              {a.storyTitle}
            </h2>
            <p style={{ color: 'rgba(240,239,231,.6)', lineHeight: 1.85, fontSize: 16, fontFamily: 'IBM Plex Sans, sans-serif', marginBottom: 20 }}>{a.storyP1}</p>
            <p style={{ color: 'rgba(240,239,231,.6)', lineHeight: 1.85, fontSize: 16, fontFamily: 'IBM Plex Sans, sans-serif', marginBottom: 32 }}>{a.storyP2}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {a.statsLabels.map((label, i) => {
                const Icon = STAT_ICONS[i]
                return (
                  <div key={i} style={{ padding: '16px 20px', background: 'rgba(0,255,135,.05)', border: '1px solid rgba(0,255,135,.15)', borderRadius: 10 }}>
                    <Icon size={18} color="#00FF87" style={{ marginBottom: 8 }} />
                    <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 800, fontSize: 24, color: '#F0EFE7' }}>{STAT_VALUES[i]}</div>
                    <div style={{ fontSize: 12, color: 'rgba(240,239,231,.45)', fontFamily: 'IBM Plex Sans, sans-serif', marginTop: 2 }}>{label}</div>
                  </div>
                )
              })}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ position: 'relative' }}>
              <div style={{ aspectRatio: '1', borderRadius: 16, background: 'linear-gradient(135deg,rgba(0,255,135,.1),rgba(99,102,241,.08))', border: '1px solid rgba(0,255,135,.12)', display: 'grid', placeItems: 'center' }}>
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', width: '80%', height: '80%', borderRadius: '50%', border: '1px dashed rgba(0,255,135,.15)' }} />
                <motion.div animate={{ rotate: [360, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', width: '60%', height: '60%', borderRadius: '50%', border: '1px dashed rgba(96,165,250,.15)' }} />
                <div style={{ textAlign: 'center', zIndex: 1 }}>
                  <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 800, fontSize: 80, color: 'rgba(0,255,135,.2)', lineHeight: 1 }}>B2B</div>
                  <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 14, color: 'rgba(240,239,231,.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 8 }}>Academy</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────── */}
      <section className="about-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 32px' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#00FF87', marginBottom: 16 }}>{a.teamTag}</div>
            <h2 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(30px,4vw,48px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{a.teamTitle}</h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
          <Reveal delay={0}>
            <motion.div whileHover={{ y: -6 }} transition={{ duration: .3 }} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: 36 }}>
              <div style={{ width: 72, height: 72, borderRadius: 12, background: 'linear-gradient(135deg,#00FF8733,#00FF8711)', border: '1px solid #00FF8733', display: 'grid', placeItems: 'center', marginBottom: 24, fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 800, fontSize: 22, color: '#00FF87' }}>
                HA
              </div>
              <h3 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700, fontSize: 19, marginBottom: 6, color: '#F0EFE7' }}>Hiba Al-Aani</h3>
              <div style={{ fontSize: 12, color: '#00FF87', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 16 }}>{a.teamRole}</div>
              <p style={{ color: 'rgba(240,239,231,.55)', fontSize: 14, lineHeight: 1.8, fontFamily: 'IBM Plex Sans, sans-serif' }}>{a.teamBio}</p>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Reveal>
        <div style={{ maxWidth: 1100, margin: '0 auto 100px', padding: '0 32px', textAlign: 'center' }}>
          <button onClick={() => { setPage('booking'); window.scrollTo({ top: 0 }); }} style={{ background: 'linear-gradient(135deg,#00FF87,#00D4AA)', color: '#050A12', border: 'none', borderRadius: 4, padding: '16px 36px', fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            {a.bookDemo} <ArrowRight size={18} />
          </button>
        </div>
      </Reveal>

    </div>
  )
}
