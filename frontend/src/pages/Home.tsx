import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Play, ChevronDown,
  MonitorPlay, Users, Trophy, BookOpen,
  ShieldCheck, CalendarCheck, Star,
  Puzzle, BrainCircuit, Code2,
  Wifi, Clock, Globe,
  Quote,
} from 'lucide-react'
import CourseCard, { COURSES } from '@/components/CourseCard'
import Pricing from '@/components/Pricing'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '', from = 'bottom' }: {
  children: React.ReactNode; delay?: number; className?: string; from?: 'bottom' | 'left' | 'right'
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  const variants = {
    bottom: { hidden: { y: 48, opacity: 0 }, show: { y: 0, opacity: 1 } },
    left:   { hidden: { x: -60, opacity: 0 }, show: { x: 0, opacity: 1 } },
    right:  { hidden: { x: 60, opacity: 0 },  show: { x: 0, opacity: 1 } },
  }
  const v = variants[from]
  return (
    <motion.div ref={ref} initial={v.hidden} animate={inView ? v.show : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  )
}

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref    = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    let current = 0
    const step = to / 55
    const id   = setInterval(() => {
      current += step
      if (current >= to) { setVal(to); clearInterval(id) }
      else setVal(Math.floor(current))
    }, 18)
    return () => clearInterval(id)
  }, [inView, to])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

const WHY_US_ICONS = [MonitorPlay, Users, Trophy, BookOpen, ShieldCheck, CalendarCheck]
const PATHWAY_ICONS = [Puzzle, BrainCircuit, Code2]
const HOW_IT_WORKS_ICONS = [Globe, MonitorPlay, BookOpen, Trophy]

// Dark mode: pure neon  |  Light mode: deep/saturated (visible on white)
const WHY_US_COLORS_DARK  = ['#FFD60A', '#00E5FF', '#00E676', '#FF4081', '#C858FF', '#FF9F00']
const WHY_US_COLORS_LIGHT = ['#B45309', '#0070A8', '#06875A', '#C90050', '#7B00D4', '#C45800']
// Pathway: Neon Green (Scratch) · Electric Cyan (AI) · Electric Yellow (Python)
const PATHWAY_COLORS_DARK  = ['#00E676', '#00E5FF', '#FFD60A']
const PATHWAY_COLORS_LIGHT = ['#059669', '#0891B2', '#D97706']

const STATS_VALUES = [
  { value: 1200, suffix: '+' },
  { value: 98,   suffix: '%' },
  { value: 3,    suffix: ''  },
  { value: 4.9,  suffix: '★' },
]

const TESTIMONIALS = [
  { initials: 'SM', name: 'Sarah M.',  child: 'Liam, age 11',  text: "Liam finished the AI Fundamentals course and immediately started explaining machine learning to his grandparents. I couldn't believe the depth of what he understood in just 8 weeks.", stars: 5, color: '#00E5FF' },
  { initials: 'DK', name: 'David K.',  child: 'Priya, age 9',  text: "Priya was nervous before her first session. By week three she was helping other kids debug their Scratch projects. The instructors are genuinely brilliant with young learners.", stars: 5, color: '#00E676' },
  { initials: 'JT', name: 'Jess T.',   child: 'Noah, age 14',  text: "Noah completed the Python Lab and built a working to-do app for his school project. He's now asking me about university computer science courses. Worth every penny.", stars: 5, color: '#FFD60A' },
  { initials: 'AH', name: 'Amir H.',   child: 'Zara, age 10',  text: "The booking system is effortless and the real-time calendar is so convenient. Zara has never missed a session — the classes are the highlight of her week.", stars: 5, color: '#FF4081' },
]

const FLOATING_SNIPPETS = [
  { code: 'if curious:\n  keep_building()',      x: '7%',  y: '24%', delay: 0   },
  { code: 'train(model, data)\n# → 97% accuracy', x: '76%', y: '18%', delay: 0.5 },
  { code: '<sprite>\n  <move steps={10} />',       x: '80%', y: '60%', delay: 0.9 },
  { code: 'for idea in mind:\n  code(idea)',        x: '4%',  y: '68%', delay: 0.7 },
]

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────
export default function HomePage({ setPage }: { setPage: (p: string) => void }) {
  const { tr } = useLanguage()
  const { isDark } = useTheme()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY  = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOp = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const go = (p: string) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <div style={{ background: 'var(--bg-main)', color: 'var(--text-primary)', overflowX: 'hidden' }}>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6"
        style={{ paddingTop: 120, paddingBottom: 80, background: isDark ? 'linear-gradient(160deg, #0A0C1A 0%, #0F1224 50%, #0A0C1A 100%)' : 'linear-gradient(145deg, #E0F0FF 0%, #EDE9FE 30%, #FFF8D6 65%, #FFF0F7 100%)' }}>
        <div className="grid-bg absolute inset-0 pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.75, 0.5] }} transition={{ duration: 9, repeat: Infinity }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[540px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(255,214,10,0.22) 0%, transparent 68%)', filter: 'blur(50px)' }} />

        {FLOATING_SNIPPETS.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, -14, 0] }}
            transition={{ opacity: { delay: s.delay + 0.8, duration: 0.6 }, y: { duration: 5 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: s.delay } }}
            className="absolute hidden lg:block rounded-xl px-4 py-3 font-mono text-[11px] leading-relaxed pointer-events-none"
            style={{ left: s.x, top: s.y, background: 'var(--snippet-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--snippet-border)', color: 'var(--snippet-color)', whiteSpace: 'pre', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            {s.code}
          </motion.div>
        ))}

        <motion.div style={{ y: heroY, opacity: heroOp }} className="relative z-10 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex justify-center mb-8">
              <span className="tag inline-flex items-center gap-2"><Wifi size={11} />{tr.hero.badge}</span>
            </div>
            <h1 className="font-display font-extrabold leading-[1.04] tracking-tight mb-7" style={{ fontSize: 'clamp(42px, 7vw, 90px)', color: 'var(--text-primary)' }}>
              {tr.hero.titleLine1}{' '}<br />
              <span className="bg-clip-text text-transparent inline-block"
                style={{ backgroundImage: isDark ? 'linear-gradient(135deg, #FFD60A 0%, #FFE040 50%, #FFD60A 100%)' : 'linear-gradient(135deg, #92400E 0%, #D97706 45%, #B45309 100%)' }}>
                {tr.hero.titleLine2}
              </span>
            </h1>
            <p className="mx-auto mb-10 leading-relaxed" style={{ fontSize: 'clamp(16px, 2.2vw, 20px)', maxWidth: 560, color: 'var(--text-secondary)' }}>
              {tr.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button onClick={() => go('booking')} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} className="btn btn-primary text-[16px] px-8 py-[15px]">
                {tr.hero.cta1} <ArrowRight size={17} strokeWidth={2.5} />
              </motion.button>
              <motion.button onClick={() => go('about')} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="btn btn-ghost text-[16px] px-8 py-[15px]">
                <Play size={15} /> {tr.hero.cta2}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] font-display font-bold tracking-[0.15em] uppercase text-slate-600">{tr.hero.scrollLabel}</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
            <ChevronDown size={15} className="text-slate-600" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══ STATS ═════════════════════════════════════════════ */}
      <div style={{ borderTop: '1px solid var(--divider)', borderBottom: '1px solid var(--divider)', background: 'var(--bg-stats)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS_VALUES.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="text-center">
                <div className="font-display font-extrabold mb-1" style={{ fontSize: 'clamp(32px,4vw,46px)', color: isDark ? '#FFD60A' : '#B45309', lineHeight: 1 }}>
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-slate-500 text-[13px] tracking-wide">{tr.stats[i]}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ══ LEARNING PATHWAY ══════════════════════════════════ */}
      <section className="py-28 px-6" style={{ background: isDark ? 'linear-gradient(180deg, var(--bg-main) 0%, var(--bg-alt) 100%)' : 'var(--bg-alt)' }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-20">
            <span className="tag">{tr.pathway.tag}</span>
            <h2 className="font-display font-extrabold text-4xl md:text-[52px] text-gray-900 leading-[1.08] tracking-tight mb-5">
              {tr.pathway.title}
            </h2>
            <p className="text-slate-600 text-lg max-w-lg mx-auto leading-relaxed">{tr.pathway.subtitle}</p>
          </Reveal>

          <div className="relative">
            <div className="hidden md:block absolute top-12 left-[calc(16.66%-1px)] right-[calc(16.66%-1px)] h-px"
              style={{ background: `linear-gradient(90deg, ${isDark ? PATHWAY_COLORS_DARK[0] : PATHWAY_COLORS_LIGHT[0]}66, ${isDark ? PATHWAY_COLORS_DARK[1] : PATHWAY_COLORS_LIGHT[1]}66, ${isDark ? PATHWAY_COLORS_DARK[2] : PATHWAY_COLORS_LIGHT[2]}66)` }} />
            <div className="grid md:grid-cols-3 gap-8">
              {tr.pathway.steps.map((step, i) => {
                const Icon  = PATHWAY_ICONS[i]
                const color = isDark ? PATHWAY_COLORS_DARK[i] : PATHWAY_COLORS_LIGHT[i]
                const stage = `0${i + 1}`
                const title = COURSES[i].title
                return (
                  <Reveal key={i} delay={i * 0.14}>
                    <motion.div
                      whileHover={{ y: -6, transition: { duration: 0.25 } }}
                      className="relative text-center p-8 rounded-3xl h-full flex flex-col"
                      style={{
                        background: isDark ? 'var(--bg-card)' : '#FFFFFF',
                        backdropFilter: isDark ? 'blur(20px)' : 'none',
                        WebkitBackdropFilter: isDark ? 'blur(20px)' : 'none',
                        border: `1px solid ${color}55`,
                        boxShadow: `0 0 18px ${color}50, 0 0 48px ${color}25, 0 4px 16px rgba(0,0,0,0.07)`,
                      }}>
                      <div className="font-display font-extrabold text-[64px] leading-none mb-2"
                        style={{ color: `${color}40` }}>{stage}</div>

                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 mx-auto"
                        style={{ background: `${color}18`, border: `1.5px solid ${color}60` }}>
                        <Icon size={26} style={{ color }} />
                      </div>

                      <div className="inline-block mb-3 text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full font-display"
                        style={{ background: `${color}18`, color, border: `1px solid ${color}55` }}>
                        {step.ages}
                      </div>

                      <h3 className="font-display font-bold text-xl mb-3 leading-tight" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                      <p className="text-[14px] leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>

                      <button onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                        className="mt-5 text-[13px] font-display font-bold flex items-center gap-1.5 mx-auto transition-colors duration-150"
                        style={{ color }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.7' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
                        {tr.pathway.seeCourse} <ArrowRight size={13} />
                      </button>
                    </motion.div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══ COURSES ═══════════════════════════════════════════ */}
      <section id="courses" className="py-28 px-6" style={{ background: 'var(--bg-main)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <Reveal from="left">
              <span className="tag">{tr.courses.tag}</span>
              <h2 className="font-display font-extrabold text-4xl md:text-[52px] text-gray-900 leading-[1.08] tracking-tight">
                {tr.courses.title.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
              </h2>
            </Reveal>
            <Reveal from="right" className="md:max-w-xs">
              <p className="text-slate-600 text-[15px] leading-relaxed">{tr.courses.subtitle}</p>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COURSES.map((course, i) => (
              <div key={course.id} className="flex flex-col">
                <CourseCard course={course} index={i} onBook={() => go('booking')} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY CHOOSE US ═════════════════════════════════════ */}
      <section id="why-us" className="py-28 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, var(--bg-alt) 0%, var(--bg-main) 100%)' }}>
        <div className="grid-bg absolute inset-0 pointer-events-none opacity-20" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <Reveal className="text-center mb-20">
            <span className="tag">{tr.whyUs.tag}</span>
            <h2 className="font-display font-extrabold text-4xl md:text-[52px] text-gray-900 leading-[1.08] tracking-tight mb-5">{tr.whyUs.title}</h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto leading-relaxed">{tr.whyUs.subtitle}</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tr.whyUs.items.map((item, i) => {
              const Icon  = WHY_US_ICONS[i]
              const color = isDark ? WHY_US_COLORS_DARK[i] : WHY_US_COLORS_LIGHT[i]
              return (
                <Reveal key={i} delay={i * 0.09}>
                  <motion.div whileHover={{ y: -6, transition: { duration: 0.25 } }} className="group p-7 rounded-3xl h-full"
                    style={{ background: 'var(--bg-card)', backdropFilter: isDark ? 'blur(20px)' : 'none', border: '1px solid var(--border-color)', boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.25)' : '0 8px 32px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.07)', transition: 'border-color 0.3s' }}
                    onHoverStart={e => (e.target as HTMLElement).style.borderColor = `${color}50`}
                    onHoverEnd={e => (e.target as HTMLElement).style.borderColor = 'var(--border-color)'}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                      style={{ background: isDark ? `${color}18` : `${color}15`, border: `2px solid ${color}${isDark ? '30' : '45'}` }}>
                      <Icon size={22} style={{ color }} />
                    </div>
                    <h3 className="font-display font-bold text-[17px] mb-3 leading-tight" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                    <p className="text-[14px] leading-[1.75]" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                  </motion.div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════ */}
      <section className="py-28 px-6" style={{ background: 'var(--bg-main)' }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-20">
            <span className="tag">{tr.howItWorks.tag}</span>
            <h2 className="font-display font-extrabold text-4xl md:text-[50px] text-gray-900 leading-[1.08] tracking-tight">
              {tr.howItWorks.title}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {tr.howItWorks.steps.map((step, i) => {
              const Icon = HOW_IT_WORKS_ICONS[i]
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-center">
                    <div className="font-display font-extrabold text-[56px] leading-none mb-2"
                      style={{ color: isDark ? 'rgba(0,229,255,0.18)' : 'rgba(0,113,170,0.18)' }}>
                      {`0${i + 1}`}
                    </div>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 -mt-4"
                      style={{ background: isDark ? 'rgba(0,229,255,0.10)' : 'rgba(0,113,170,0.09)', border: isDark ? '2px solid rgba(0,229,255,0.30)' : '2px solid rgba(0,113,170,0.28)' }}>
                      <Icon size={22} style={{ color: isDark ? '#00E5FF' : '#0070A8' }} />
                    </div>
                    <h3 className="font-display font-bold text-[16px] mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                    <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--bg-alt) 0%, var(--bg-main) 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <span className="tag">{tr.testimonials.tag}</span>
            <h2 className="font-display font-extrabold text-4xl md:text-[50px] text-gray-900 leading-[1.08] tracking-tight">
              {tr.testimonials.title}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -5, transition: { duration: 0.25 } }} className="p-8 rounded-3xl h-full"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: isDark ? 'var(--shadow-card)' : '0 8px 32px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.07)' }}>
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.stars)].map((_, si) => <Star key={si} size={14} fill="#FFD60A" style={{ color: '#FFD60A' }} />)}
                  </div>
                  <Quote size={20} className="mb-3" style={{ color: isDark ? 'rgba(0,229,255,0.35)' : 'rgba(0,113,170,0.35)' }} />
                  <p className="text-slate-600 text-[15px] leading-[1.8] mb-7 italic">{t.text}</p>
                  <div className="flex items-center gap-3 pt-5" style={{ borderTop: '1px solid var(--divider)' }}>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-display font-extrabold text-[13px] flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${t.color}30, ${t.color}15)`, color: t.color, border: `1px solid ${t.color}30` }}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-display font-bold text-[14px] text-gray-900 leading-none">{t.name}</div>
                      <div className="text-slate-500 text-[12px] mt-0.5">{tr.testimonials.parentOf} {t.child}</div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING + FAQ ═════════════════════════════════════ */}
      <Pricing setPage={setPage} onSelectPlan={() => go('booking')} />

      {/* ══ FINAL CTA ═════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ background: 'var(--bg-main)' }}>
        <div className="grid-bg absolute inset-0 pointer-events-none opacity-30" />
        <motion.div animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(255,214,10,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <Reveal className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="tag"><Clock size={11} /> {tr.cta.tag}</span>
          <h2 className="font-display font-extrabold text-4xl md:text-[60px] text-gray-900 leading-[1.06] tracking-tight mb-6">
            {tr.cta.title1}<br />
            <span className="bg-clip-text text-transparent inline-block"
              style={{ backgroundImage: isDark ? 'linear-gradient(135deg,#FFD60A,#FFE040)' : 'linear-gradient(135deg,#92400E,#D97706)' }}>
              {tr.cta.title2}
            </span>
          </h2>
          <p className="text-slate-600 text-lg mb-10 leading-relaxed max-w-lg mx-auto">{tr.cta.subtitle}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button onClick={() => go('booking')} whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }} className="btn btn-primary text-[16px] px-10 py-[16px]">
              {tr.cta.btn1} <ArrowRight size={18} strokeWidth={2.5} />
            </motion.button>
            <motion.button onClick={() => go('contact')} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className="btn btn-ghost text-[16px] px-10 py-[16px]">
              {tr.cta.btn2}
            </motion.button>
          </div>
        </Reveal>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid var(--divider)', background: 'var(--bg-alt)' }}>
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="mb-3" style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 900, fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1 }}>
                <span style={{ color:'var(--text-primary)', WebkitTextStroke:'1.5px #FFD60A', paintOrder:'stroke fill' }}>Bug</span><span style={{ color:'#FFD60A', WebkitTextStroke:`1.5px ${isDark ? '#0A0C1A' : '#1A1F3A'}`, paintOrder:'stroke fill' }}>To</span><span style={{ color:'var(--text-primary)', WebkitTextStroke:'1.5px #00E5FF', paintOrder:'stroke fill' }}>Byte</span>
              </div>
              <p className="text-slate-500 text-[14px] leading-relaxed max-w-xs">{tr.footer.desc}</p>
              <div className="flex gap-3 mt-5">
                <a href="mailto:hello@bugtobyte.com" className="text-slate-500 text-[13px] hover:text-brand-yellow transition-colors">
                  hello@bugtobyte.com
                </a>
              </div>
            </div>
            <div>
              <div className="font-display font-bold text-[13px] tracking-widest uppercase text-slate-500 mb-4">{tr.footer.coursesLabel}</div>
              <ul className="space-y-2">
                {['Scratch Creators (7–9)', 'AI Fundamentals (10–12)', 'Python Lab (13–14)'].map(l => (
                  <li key={l}>
                    <button onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-slate-600 text-[14px] hover:text-brand-yellow transition-colors duration-150">{l}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-display font-bold text-[13px] tracking-widest uppercase text-slate-500 mb-4">{tr.footer.companyLabel}</div>
              <ul className="space-y-2">
                {[
                  { label: tr.footer.about,   page: 'about',   anchor: undefined },
                  { label: tr.footer.contact,  page: 'contact', anchor: undefined },
                  { label: tr.footer.pricing,  page: 'home',    anchor: 'pricing' },
                  { label: tr.footer.faq,      page: 'home',    anchor: 'faq' },
                ].map(({ label, page, anchor }) => (
                  <li key={label}>
                    <button onClick={() => { go(page); if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 300) }}
                      className="text-slate-600 text-[14px] hover:text-brand-yellow transition-colors duration-150">{label}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid var(--divider)' }}>
            <p className="text-slate-600 text-[13px]">© {new Date().getFullYear()} BugToByte Academy. {tr.footer.rights}</p>
            <button onClick={() => setPage('login')} className="text-slate-600 text-[12px] hover:text-slate-500 transition-colors">{tr.footer.staffLogin}</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
