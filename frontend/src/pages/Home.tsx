import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Play, ChevronDown,
  MonitorPlay, Users, Trophy, BookOpen,
  ShieldCheck, CalendarCheck, Star,
  Puzzle, Brain, Code2,
  Wifi, Clock, Globe,
  Quote,
} from 'lucide-react'
import CourseCard, { COURSES } from '@/components/CourseCard'
import Pricing from '@/components/Pricing'

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function Reveal({
  children, delay = 0, className = '', from = 'bottom',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  from?: 'bottom' | 'left' | 'right'
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
    <motion.div
      ref={ref}
      initial={v.hidden}
      animate={inView ? v.show : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
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
    const step  = to / 55
    const id    = setInterval(() => {
      current += step
      if (current >= to) { setVal(to); clearInterval(id) }
      else setVal(Math.floor(current))
    }, 18)
    return () => clearInterval(id)
  }, [inView, to])

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

// ─────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────
const STATS = [
  { value: 1200, suffix: '+', label: 'Students Taught'   },
  { value: 98,   suffix: '%', label: 'Parent Satisfaction'},
  { value: 3,    suffix: '',  label: 'Expert Instructors' },
  { value: 4.9,  suffix: '★', label: 'Average Rating'    },
]

const WHY_US = [
  {
    icon:  MonitorPlay,
    title: 'Live & Interactive',
    desc:  "Real-time Zoom sessions where your child asks questions, shares their screen, and builds alongside peers — not a pre-recorded video they'll skip.",
    color: '#FFCB77',
  },
  {
    icon:  Users,
    title: 'Tiny Class Sizes',
    desc:  'We cap every class at 5–6 students. Every child gets seen, supported, and celebrated — never lost in a crowd.',
    color: '#4ECDC4',
  },
  {
    icon:  Trophy,
    title: 'Real Projects, Not Theory',
    desc:  'Every session ends with something built and working. Kids take home games, AI models, and apps they\'re genuinely proud to show their friends.',
    color: '#A8EDCB',
  },
  {
    icon:  BookOpen,
    title: 'Curriculum That Grows',
    desc:  'From Scratch at age 7 to Python at 14, our courses form a deliberate pathway — each stage perfectly prepares students for the next.',
    color: '#FFD99A',
  },
  {
    icon:  ShieldCheck,
    title: 'Safe, Vetted Instructors',
    desc:  'All our instructors hold enhanced DBS checks, have real-world industry experience, and are trained in teaching young learners online.',
    color: '#FF8A8A',
  },
  {
    icon:  CalendarCheck,
    title: 'Flexible Scheduling',
    desc:  'Evening and weekend slots across multiple time zones. Book via our live calendar — slots update in real-time, so no double-booking ever.',
    color: '#B39DDB',
  },
]

const LEARNING_PATH = [
  {
    stage: '01',
    icon:  Puzzle,
    title: 'Scratch Creators',
    ages:  'Ages 7–9',
    desc:  'Build animations, stories, and games with drag-and-drop blocks. Zero experience needed. Pure creative fun.',
    color: '#A8EDCB',
  },
  {
    stage: '02',
    icon:  Brain,
    title: 'AI Fundamentals',
    ages:  'Ages 10–12',
    desc:  'Train real AI models, explore machine learning, and understand how the technology shaping our world actually works.',
    color: '#4ECDC4',
  },
  {
    stage: '03',
    icon:  Code2,
    title: 'Python Lab',
    ages:  'Ages 13–14',
    desc:  "Graduate to professional text-based code. Build real apps and data projects using the language of Google, Netflix, and NASA.",
    color: '#FF8A8A',
  },
]

const TESTIMONIALS = [
  {
    initials: 'SM', name: 'Sarah M.', child: 'Liam, age 11',
    text:  "Liam finished the AI Fundamentals course and immediately started explaining machine learning to his grandparents. I couldn't believe the depth of what he understood in just 8 weeks.",
    stars: 5, color: '#4ECDC4',
  },
  {
    initials: 'DK', name: 'David K.', child: 'Priya, age 9',
    text:  "Priya was nervous before her first session. By week three she was helping other kids in the class debug their Scratch projects. The instructors are genuinely brilliant with young learners.",
    stars: 5, color: '#A8EDCB',
  },
  {
    initials: 'JT', name: 'Jess T.', child: 'Noah, age 14',
    text:  "Noah completed the Python Lab and built a working to-do app for his school project. He's now asking me about university computer science courses. Worth every penny.",
    stars: 5, color: '#FFCB77',
  },
  {
    initials: 'AH', name: 'Amir H.', child: 'Zara, age 10',
    text:  "The booking system is effortless and the real-time calendar is so convenient. Zara has never missed a session — the classes are the highlight of her week.",
    stars: 5, color: '#FF8A8A',
  },
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
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY  = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOp = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  const go = (p: string) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <div style={{ background: '#0F1120', color: '#E4E6F0', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6"
        style={{ paddingTop: 120, paddingBottom: 80 }}
      >
        {/* Grid background */}
        <div className="grid-bg absolute inset-0 pointer-events-none" />

        {/* Radial glow behind headline */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[540px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(255,203,119,0.13) 0%, transparent 68%)', filter: 'blur(50px)' }}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 11, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-64 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(78,205,196,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />

        {/* Floating code snippets */}
        {FLOATING_SNIPPETS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -14, 0] }}
            transition={{
              opacity: { delay: s.delay + 0.8, duration: 0.6 },
              y: { duration: 5 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: s.delay },
            }}
            className="absolute hidden lg:block rounded-xl px-4 py-3 font-mono text-[11px] leading-relaxed pointer-events-none"
            style={{
              left: s.x, top: s.y,
              background:     'rgba(30,33,56,0.82)',
              backdropFilter: 'blur(12px)',
              border:         '1px solid rgba(255,203,119,0.14)',
              color:          'rgba(255,203,119,0.75)',
              whiteSpace:     'pre',
            }}
          >
            {s.code}
          </motion.div>
        ))}

        {/* Hero content */}
        <motion.div style={{ y: heroY, opacity: heroOp }} className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Live badge */}
            <div className="flex justify-center mb-8">
              <span className="tag inline-flex items-center gap-2">
                <Wifi size={11} />
                Live Classes · Ages 7–14 · Limited Spots
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold leading-[1.04] tracking-tight mb-7"
              style={{ fontSize: 'clamp(42px, 7vw, 90px)' }}>
              Where Kids Go From{' '}
              <br />
              <span style={{
                background:             'linear-gradient(135deg, #FFCB77 0%, #FFD99A 40%, #FFCB77 100%)',
                WebkitBackgroundClip:   'text',
                WebkitTextFillColor:    'transparent',
                backgroundSize:         '200% auto',
              }}>
                Bug to Byte
              </span>
            </h1>

            {/* Sub */}
            <p className="text-slate-400 mx-auto mb-10 leading-relaxed"
              style={{ fontSize: 'clamp(16px, 2.2vw, 20px)', maxWidth: 560 }}>
              Live, expert-led classes in{' '}
              <span className="text-brand-mint font-semibold">Scratch</span>,{' '}
              <span className="text-brand-teal font-semibold">AI Fundamentals</span> &amp;{' '}
              <span className="text-brand-coral font-semibold">Python</span>{' '}
              for curious kids aged 7–14.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                onClick={() => go('booking')}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary text-[16px] px-8 py-[15px]"
              >
                Book Free Demo <ArrowRight size={17} strokeWidth={2.5} />
              </motion.button>
              <motion.button
                onClick={() => go('about')}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-ghost text-[16px] px-8 py-[15px]"
              >
                <Play size={15} /> How It Works
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-display font-bold tracking-[0.15em] uppercase text-slate-600">Explore</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
            <ChevronDown size={15} className="text-slate-600" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════════ */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(30,33,56,0.5)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="text-center">
                <div className="font-display font-extrabold mb-1"
                  style={{ fontSize: 'clamp(32px,4vw,46px)', color: '#FFCB77', lineHeight: 1 }}>
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-slate-500 text-[13px] tracking-wide">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          LEARNING PATHWAY (Age Groups)
      ══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6" style={{ background: 'linear-gradient(180deg, #0F1120 0%, #141728 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-20">
            <span className="tag">Learning Pathway</span>
            <h2 className="font-display font-extrabold text-4xl md:text-[52px] text-white leading-[1.08] tracking-tight mb-5">
              A Course for Every Age
            </h2>
            <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
              Each programme is built precisely for its age group — from first-time coders to future software engineers.
            </p>
          </Reveal>

          {/* Pathway steps */}
          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-[calc(16.66%-1px)] right-[calc(16.66%-1px)] h-px"
              style={{ background: 'linear-gradient(90deg, #A8EDCB44, #4ECDC444, #FF8A8A44)' }} />

            <div className="grid md:grid-cols-3 gap-8">
              {LEARNING_PATH.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.14}>
                  <motion.div
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className="relative text-center p-8 rounded-3xl"
                    style={{
                      background: 'rgba(45,48,71,0.4)', backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: `1px solid ${step.color}28`,
                      boxShadow: `0 0 0 1px ${step.color}14, 0 8px 32px rgba(0,0,0,0.3)`,
                    }}
                  >
                    {/* Stage number */}
                    <div className="font-display font-extrabold text-[64px] leading-none mb-2"
                      style={{ color: `${step.color}20` }}>
                      {step.stage}
                    </div>

                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 -mt-6"
                      style={{ background: `${step.color}14`, border: `1px solid ${step.color}30` }}>
                      <step.icon size={26} style={{ color: step.color }} />
                    </div>

                    {/* Ages pill */}
                    <div className="inline-block mb-3 text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full font-display"
                      style={{ background: `${step.color}12`, color: step.color, border: `1px solid ${step.color}25` }}>
                      {step.ages}
                    </div>

                    <h3 className="font-display font-bold text-xl text-white mb-3 leading-tight">{step.title}</h3>
                    <p className="text-slate-400 text-[14px] leading-relaxed">{step.desc}</p>

                    <button
                      onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                      className="mt-5 text-[13px] font-display font-bold flex items-center gap-1.5 mx-auto transition-colors duration-150"
                      style={{ color: step.color }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                      See Course <ArrowRight size={13} />
                    </button>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          COURSES
      ══════════════════════════════════════════════════════ */}
      <section id="courses" className="py-28 px-6" style={{ background: '#0F1120' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <Reveal from="left">
              <span className="tag">Our Courses</span>
              <h2 className="font-display font-extrabold text-4xl md:text-[52px] text-white leading-[1.08] tracking-tight">
                Built for Young<br />Minds to Thrive
              </h2>
            </Reveal>
            <Reveal from="right" className="md:max-w-xs">
              <p className="text-slate-400 text-[15px] leading-relaxed">
                Project-based, live instruction with expert teachers who genuinely care about every student.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.map((course, i) => (
              <CourseCard
                key={course.id}
                course={course}
                index={i}
                onBook={() => go('booking')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════════════════════ */}
      <section
        id="why-us"
        className="py-28 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #141728 0%, #0F1120 100%)' }}
      >
        <div className="grid-bg absolute inset-0 pointer-events-none opacity-40" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <Reveal className="text-center mb-20">
            <span className="tag">Why Choose Us</span>
            <h2 className="font-display font-extrabold text-4xl md:text-[52px] text-white leading-[1.08] tracking-tight mb-5">
              The BugToByte Difference
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
              Lots of platforms claim to teach kids coding. Here's why families keep coming back to us.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_US.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.09}>
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="group p-7 rounded-3xl h-full"
                  style={{
                    background: 'rgba(45,48,71,0.42)', backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                    transition: 'border-color 0.3s',
                  }}
                  onHoverStart={e => (e.target as HTMLElement).style.borderColor = `${item.color}30`}
                  onHoverEnd={e => (e.target as HTMLElement).style.borderColor   = 'rgba(255,255,255,0.07)'}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `${item.color}14`, border: `1px solid ${item.color}28` }}>
                    <item.icon size={22} style={{ color: item.color }} />
                  </div>
                  <h3 className="font-display font-bold text-[17px] text-white mb-3 leading-tight">{item.title}</h3>
                  <p className="text-slate-400 text-[14px] leading-[1.75]">{item.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6" style={{ background: '#0F1120' }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-20">
            <span className="tag">The Process</span>
            <h2 className="font-display font-extrabold text-4xl md:text-[50px] text-white leading-[1.08] tracking-tight">
              Simple. Seamless.<br />Transformative.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n:'01', icon: Globe,         title:'Book a Free Demo',        desc:'Pick a date & time in our live calendar. No commitment, no card required.' },
              { n:'02', icon: MonitorPlay,   title:'Meet Your Instructor',    desc:'A 30-min intro where your child meets the team and tries real coding live.' },
              { n:'03', icon: BookOpen,      title:'Join Your Course',        desc:'Enrol in the right programme, join your small class, and start building week one.' },
              { n:'04', icon: Trophy,        title:'Showcase & Celebrate',    desc:'End-of-course Demo Day — kids present their finished projects to family and friends.' },
            ].map((step, i) => (
              <Reveal key={step.n} delay={i * 0.1}>
                <div className="text-center">
                  <div className="font-display font-extrabold text-[56px] leading-none mb-2"
                    style={{ color: 'rgba(255,203,119,0.12)' }}>
                    {step.n}
                  </div>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 -mt-4"
                    style={{ background:'rgba(255,203,119,0.1)', border:'1px solid rgba(255,203,119,0.2)' }}>
                    <step.icon size={22} style={{ color:'#FFCB77' }} />
                  </div>
                  <h3 className="font-display font-bold text-[16px] text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-[13px] leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section
        className="py-28 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#141728 0%,#0F1120 100%)' }}
      >
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <span className="tag">Parent Stories</span>
            <h2 className="font-display font-extrabold text-4xl md:text-[50px] text-white leading-[1.08] tracking-tight">
              Real Families,<br />Real Results
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -5, transition: { duration: 0.25 } }}
                  className="p-8 rounded-3xl h-full"
                  style={{
                    background: 'rgba(45,48,71,0.42)', backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.stars)].map((_, si) => (
                      <Star key={si} size={14} fill="#FFCB77" style={{ color:'#FFCB77' }} />
                    ))}
                  </div>

                  {/* Quote */}
                  <Quote size={20} className="mb-3" style={{ color:'rgba(255,203,119,0.3)' }} />
                  <p className="text-slate-300 text-[15px] leading-[1.8] mb-7 italic">
                    {t.text}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-5"
                    style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-display font-extrabold text-[13px] flex-shrink-0"
                      style={{ background:`linear-gradient(135deg, ${t.color}30, ${t.color}15)`, color:t.color, border:`1px solid ${t.color}30` }}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-display font-bold text-[14px] text-white leading-none">{t.name}</div>
                      <div className="text-slate-500 text-[12px] mt-0.5">Parent of {t.child}</div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PRICING + FAQ (imported components)
      ══════════════════════════════════════════════════════ */}
      <Pricing setPage={setPage} onSelectPlan={() => go('booking')} />

      {/* ══════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ background:'#0F1120' }}>
        <div className="grid-bg absolute inset-0 pointer-events-none opacity-30" />
        <motion.div
          animate={{ opacity:[0.2,0.4,0.2], scale:[1,1.15,1] }}
          transition={{ duration:8, repeat:Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
          style={{ background:'radial-gradient(ellipse, rgba(255,203,119,0.1) 0%, transparent 70%)', filter:'blur(50px)' }}
        />

        <Reveal className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="tag"><Clock size={11} /> Limited Spots Available</span>
          <h2 className="font-display font-extrabold text-4xl md:text-[60px] text-white leading-[1.06] tracking-tight mb-6">
            Their Future Starts
            <br />
            <span style={{ background:'linear-gradient(135deg,#FFCB77,#FFD99A)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              With One Click
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-lg mx-auto">
            Book a free 30-minute demo lesson today. No pressure, no commitment — just pure learning magic for your child.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              onClick={() => go('booking')}
              whileHover={{ scale:1.04, y:-3 }} whileTap={{ scale:0.97 }}
              className="btn btn-primary text-[16px] px-10 py-[16px]"
            >
              Reserve Free Demo <ArrowRight size={18} strokeWidth={2.5} />
            </motion.button>
            <motion.button
              onClick={() => go('contact')}
              whileHover={{ scale:1.03, y:-2 }} whileTap={{ scale:0.97 }}
              className="btn btn-ghost text-[16px] px-10 py-[16px]"
            >
              Ask a Question
            </motion.button>
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.06)', background:'rgba(14,17,32,0.9)' }}>
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="font-display font-extrabold text-2xl text-white mb-3">
                Bug<span style={{ color:'#FFCB77' }}>To</span>Byte
              </div>
              <p className="text-slate-500 text-[14px] leading-relaxed max-w-xs">
                Expert-led coding classes for curious kids aged 7–14. Scratch, AI &amp; Python — all live, all online.
              </p>
              <div className="flex gap-3 mt-5">
                {['hello@bugtobyte.com'].map(e => (
                  <a key={e} href={`mailto:${e}`} className="text-slate-500 text-[13px] hover:text-brand-yellow transition-colors">{e}</a>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div>
              <div className="font-display font-bold text-[13px] tracking-widest uppercase text-slate-500 mb-4">Courses</div>
              <ul className="space-y-2">
                {['Scratch Creators (7–9)', 'AI Fundamentals (10–12)', 'Python Lab (13–14)'].map(l => (
                  <li key={l}>
                    <button onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior:'smooth' })}
                      className="text-slate-400 text-[14px] hover:text-brand-yellow transition-colors duration-150">
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div>
              <div className="font-display font-bold text-[13px] tracking-widest uppercase text-slate-500 mb-4">Company</div>
              <ul className="space-y-2">
                {[
                  { label:'About',   page:'about'   },
                  { label:'Contact', page:'contact' },
                  { label:'Pricing', page:'home', anchor:'pricing' },
                  { label:'FAQ',     page:'home', anchor:'faq'     },
                ].map(({ label, page, anchor }) => (
                  <li key={label}>
                    <button
                      onClick={() => {
                        go(page)
                        if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior:'smooth' }), 300)
                      }}
                      className="text-slate-400 text-[14px] hover:text-brand-yellow transition-colors duration-150"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
            style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-slate-600 text-[13px]">© {new Date().getFullYear()} BugToByte Academy. All rights reserved.</p>
            <button
              onClick={() => setPage('login')}
              className="text-slate-600 text-[12px] hover:text-slate-500 transition-colors"
            >
              Staff Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
