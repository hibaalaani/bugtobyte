import { useRef, useState } from 'react'
import { getWaUrl } from '@/utils/whatsapp'
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

const SKILLS = ['Telecom Engineer', 'Python & AI', 'Career Mentor', 'Kids Educator', 'Berlin 🇩🇪']

const ABOUT_WA_MESSAGES: Record<string, string> = {
  en: "Hi Hiba! 👋 I saw your About page and would love to know more about BugToByte.",
  de: "Hallo Hiba! 👋 Ich habe deine Über-uns-Seite gesehen und möchte mehr über BugToByte erfahren.",
  ar: "مرحبًا هبى! 👋 رأيت صفحة من نحن وأود معرفة المزيد عن BugToByte.",
}

function TeamCard({ role, bio }: { role: string; bio: string }) {
  const [imgOk, setImgOk] = useState(true)
  const { lang } = useLanguage()
  const waUrl = getWaUrl(lang, ABOUT_WA_MESSAGES[lang])

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      style={{
        maxWidth: 780,
        margin: '0 auto',
        borderRadius: 24,
        padding: '2px',
        background: 'linear-gradient(135deg,rgba(0,255,135,.35),rgba(96,165,250,.2),rgba(167,139,250,.25))',
        boxShadow: '0 0 80px rgba(0,255,135,.07), 0 24px 64px rgba(0,0,0,.4)',
      }}
    >
      <div style={{
        borderRadius: 22,
        background: 'linear-gradient(135deg,rgba(5,10,18,.97),rgba(10,18,30,.97))',
        padding: 'clamp(28px,5vw,52px)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'clamp(28px,5vw,52px)',
        alignItems: 'center',
      }}>

        {/* ── Photo column ── */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>

          {/* Spinning gradient ring + photo */}
          <div style={{ position: 'relative', width: 168, height: 168 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: -3, borderRadius: '50%',
                background: 'conic-gradient(#00FF87 0%,#60A5FA 35%,#A78BFA 65%,#00FF87 100%)',
                filter: 'blur(1px)',
              }}
            />
            <div style={{
              position: 'absolute', inset: 3, borderRadius: '50%',
              background: '#050A12',
              overflow: 'hidden',
            }}>
              {imgOk ? (
                <img
                  src="/hiba-photo.jpg"
                  alt="Hiba Al-Aani"
                  onError={() => setImgOk(false)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'grid', placeItems: 'center',
                  background: 'linear-gradient(135deg,rgba(0,255,135,.15),rgba(96,165,250,.1))',
                  fontFamily: 'IBM Plex Sans,sans-serif', fontWeight: 800, fontSize: 48, color: '#00FF87',
                }}>HA</div>
              )}
            </div>
            {/* Verified dot */}
            <div style={{
              position: 'absolute', bottom: 6, right: 6,
              width: 30, height: 30, borderRadius: '50%',
              background: 'linear-gradient(135deg,#00FF87,#00D4AA)',
              border: '2.5px solid #050A12',
              display: 'grid', placeItems: 'center',
              fontSize: 13, fontWeight: 900, color: '#050A12',
              boxShadow: '0 2px 12px rgba(0,255,135,.5)',
              zIndex: 2,
            }}>✓</div>
          </div>

          {/* Contact buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="mailto:hello@bugtobyte.com"
              style={{ fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 10, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(240,239,231,.7)', fontFamily: 'IBM Plex Sans,sans-serif', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, transition: 'all .2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)')}
            >✉ Email</a>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 10, background: 'rgba(37,211,102,.1)', border: '1px solid rgba(37,211,102,.25)', color: '#25D366', fontFamily: 'IBM Plex Sans,sans-serif', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, transition: 'all .2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(37,211,102,.18)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(37,211,102,.1)')}
            >💬 WhatsApp</a>
          </div>
        </div>

        {/* ── Details column ── */}
        <div style={{ flex: '1', minWidth: 220 }}>

          {/* Name + role */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'IBM Plex Sans,sans-serif', fontWeight: 900, fontSize: 'clamp(22px,3vw,30px)', marginBottom: 4, color: '#F0EFE7', letterSpacing: '-0.02em' }}>
              Hiba Al-Aani
            </h3>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00FF87', fontFamily: 'IBM Plex Sans,sans-serif', marginBottom: 6 }}>
              {role}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(240,239,231,.35)', fontFamily: 'IBM Plex Sans,sans-serif', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00FF87', display: 'inline-block', boxShadow: '0 0 6px #00FF87' }} />
              Berlin, Germany · Available for new students
            </div>
          </div>

          {/* Bio */}
          <p style={{ color: 'rgba(240,239,231,.6)', fontSize: 14, lineHeight: 1.9, fontFamily: 'IBM Plex Sans,sans-serif', marginBottom: 24 }}>
            {bio}
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: 'linear-gradient(90deg,rgba(0,255,135,.2),transparent)', marginBottom: 20 }} />

          {/* Skill tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SKILLS.map(tag => (
              <span key={tag} style={{
                fontSize: 11, fontWeight: 700, padding: '5px 13px', borderRadius: 20,
                background: 'rgba(0,255,135,.07)', border: '1px solid rgba(0,255,135,.18)',
                color: 'rgba(0,255,135,.85)', fontFamily: 'IBM Plex Sans,sans-serif',
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>{tag}</span>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  )
}

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
                <div style={{ textAlign: 'center', zIndex: 1, padding: 24 }}>
                  {[
                    { label: '📡', text: 'Telecom Engineer' },
                    { label: '🔄', text: 'Career Mentor' },
                    { label: '🚀', text: 'Kids Educator' },
                  ].map(({ label, text }, i) => (
                    <motion.div
                      key={text}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 + 0.3 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 2 ? 16 : 0, background: 'rgba(0,255,135,.06)', border: '1px solid rgba(0,255,135,.12)', borderRadius: 10, padding: '10px 18px' }}
                    >
                      <span style={{ fontSize: 18 }}>{label}</span>
                      <span style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(240,239,231,.7)' }}>{text}</span>
                    </motion.div>
                  ))}
                  <div style={{ marginTop: 24, fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 900, fontSize: 36, color: 'rgba(0,255,135,.18)', letterSpacing: '-0.02em' }}>→ Kids</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────── */}
      <section className="about-section" style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 32px' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#00FF87', marginBottom: 16 }}>{a.teamTag}</div>
            <h2 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(30px,4vw,48px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{a.teamTitle}</h2>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <TeamCard role={a.teamRole} bio={a.teamBio} />
        </Reveal>
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
