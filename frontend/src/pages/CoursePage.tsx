import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Clock, Users, CheckCircle2,
  BookOpen, ArrowRight, Zap, Puzzle, Brain, Code2,
} from 'lucide-react'
import { COURSES, CourseData } from '@/components/CourseCard'
import { useTheme } from '@/contexts/ThemeContext'
import { useLanguage } from '@/contexts/LanguageContext'

const TOOL_ICON = { Scratch: Puzzle, 'AI Tools': Brain, Python: Code2 }


const COLOR_MAP: Record<string, { text: string; glow: string; border: string; bg: string }> = {
  mint:   { text: '#A8EDCB', glow: 'rgba(168,237,203,0.25)', border: 'rgba(168,237,203,0.25)', bg: 'rgba(168,237,203,0.08)' },
  teal:   { text: '#4ECDC4', glow: 'rgba(78,205,196,0.25)',  border: 'rgba(78,205,196,0.25)',  bg: 'rgba(78,205,196,0.08)'  },
  coral:  { text: '#FF8A8A', glow: 'rgba(255,107,107,0.25)', border: 'rgba(255,107,107,0.25)', bg: 'rgba(255,107,107,0.08)' },
  violet: { text: '#D580FF', glow: 'rgba(200,88,255,0.25)',  border: 'rgba(200,88,255,0.25)',  bg: 'rgba(200,88,255,0.08)'  },
}

export default function CoursePage({ setPage }: { setPage: (p: string) => void }) {
  const { isDark } = useTheme()
  const { tr } = useLanguage()
  const t = tr.coursePage

  const course: CourseData | null = useMemo(() => {
    const slug = sessionStorage.getItem('selectedCourse')
    return COURSES.find(c => c.slug === slug) ?? COURSES[0]
  }, [])

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => setPage('home')} style={{ color: '#fbbf24' }}>← Back to courses</button>
      </div>
    )
  }

  const c = COLOR_MAP[course.color]
  const Icon = TOOL_ICON[course.tool] ?? Zap
  const SESSION_PRICE = 9.99
  const totalPrice = (course.sessions * SESSION_PRICE).toFixed(2)
  const levelLabel = { Beginner: t.levelBeginner, Intermediate: t.levelIntermediate, Advanced: t.levelAdvanced }

  const go = (p: string) => { setPage(p); window.scrollTo({ top: 0 }) }

  const handleBook = () => {
    sessionStorage.setItem('preselectedCourse', course.slug)
    go('booking')
  }

  const bg    = isDark ? '#050A12' : '#F8FAFC'
  const card  = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff'
  const border = isDark ? 'rgba(255,255,255,0.07)' : '#E2E8F0'
  const txtPri = isDark ? '#F0EFE7' : '#1A1F3A'
  const txtSec = isDark ? 'rgba(240,239,231,0.6)' : '#475569'
  const txtMut = isDark ? 'rgba(240,239,231,0.35)' : '#94A3B8'

  return (
    <div style={{ background: bg, color: txtPri, minHeight: '100vh', fontFamily: '"Inter", "IBM Plex Sans", sans-serif', paddingTop: 80 }}>

      {/* ── Back bar ── */}
      <div style={{ borderBottom: `1px solid ${border}`, background: isDark ? 'rgba(255,255,255,0.02)' : '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '14px 24px' }}>
          <button
            onClick={() => go('home')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: txtSec, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
          >
            <ArrowLeft size={16} /> {t.back}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ borderRadius: 24, overflow: 'hidden', marginTop: 32, marginBottom: 32, border: `1px solid ${c.border}`, boxShadow: `0 0 60px ${c.glow}` }}
        >
          {/* Image / gradient hero */}
          <div style={{ position: 'relative', height: 280 }}>
            {course.image ? (
              <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${c.text}44, ${c.text}11)` }} />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: c.text }} />

            {/* Badges */}
            <span style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', color: '#fff', padding: '5px 14px', borderRadius: 50, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
              {tr.common.ages} {course.ageGroup}
            </span>
            <span style={{ position: 'absolute', top: 16, right: 16, background: c.bg, border: `1px solid ${c.border}`, color: c.text, padding: '5px 14px', borderRadius: 50, fontSize: 12, fontWeight: 700 }}>
              {levelLabel[course.level]}
            </span>

            {/* Title over image */}
            <div style={{ position: 'absolute', bottom: 24, left: 28, right: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 10, padding: 8, display: 'flex' }}>
                  <Icon size={18} style={{ color: c.text }} />
                </div>
                <span style={{ color: c.text, fontWeight: 700, fontSize: 13 }}>{course.tool}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.2 }}>{course.title}</h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', margin: '6px 0 0', fontSize: 15 }}>{course.subtitle}</p>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', background: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9', borderTop: `1px solid ${border}` }}>
            {[
              { Icon: Clock, label: `${course.sessions} ${t.sessionsLabel}`, sub: course.sessionLen },
              { Icon: Users, label: `Max ${course.maxStudents} ${t.studentsLabel}`, sub: t.perClass },
              { Icon: Icon,  label: course.tool, sub: t.platformSub },
            ].map(({ Icon: I, label, sub }, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 8px', borderRight: i < 2 ? `1px solid ${border}` : 'none' }}>
                <I size={16} style={{ color: c.text, marginBottom: 6 }} />
                <span style={{ fontWeight: 700, fontSize: 14, color: txtPri }}>{label}</span>
                <span style={{ fontSize: 11, color: txtMut, marginTop: 2 }}>{sub}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 24, alignItems: 'start' }}>

          {/* LEFT column */}
          <div>

            {/* About */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.45 }}
              style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={18} style={{ color: c.text }} /> {t.about}
              </h2>
              <p style={{ color: txtSec, lineHeight: 1.75, fontSize: 15, margin: 0 }}>{course.description}</p>
            </motion.div>

            {/* What they learn */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.45 }}
              style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>
                {t.whatLearn}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {course.skills.map(skill => (
                  <div key={skill} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <CheckCircle2 size={17} style={{ color: c.text, flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: txtSec, fontSize: 15, lineHeight: 1.5 }}>{skill}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Week-by-week curriculum */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }}
              style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 28, marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>{t.curriculum}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {course.curriculum.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '12px 16px', borderRadius: 10, background: i % 2 === 0 ? (isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC') : 'transparent' }}>
                    <span style={{ fontWeight: 800, fontSize: 11, color: c.text, minWidth: 52, paddingTop: 2, letterSpacing: 0.5 }}>
                      {t.week} {i + 1}
                    </span>
                    <span style={{ color: txtSec, fontSize: 14, lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Who it's for */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.45 }}
              style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 28 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>{t.whoFor}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: t.ageGroupLabel, value: `${course.ageGroup} ${t.yearsOld}` },
                  { label: t.levelLabel, value: course.level },
                  { label: t.classSizeLabel, value: `Max ${course.maxStudents} ${t.studentsLabel}` },
                  { label: t.sessionLenLabel, value: course.sessionLen },
                  { label: t.totalSessionsLabel, value: `${course.sessions} ${t.sessionsLabel}` },
                  { label: t.platformLabel, value: course.tool },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#F1F5F9', borderRadius: 10, padding: '12px 16px' }}>
                    <div style={{ fontSize: 11, color: txtMut, fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: txtPri }}>{value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* RIGHT — sticky booking card */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.45 }}
            style={{ position: 'sticky', top: 100 }}
          >
            <div style={{ background: card, border: `1px solid ${c.border}`, borderRadius: 20, padding: 24, boxShadow: `0 8px 40px ${c.glow}` }}>

              {/* Price */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: txtMut, fontWeight: 600, marginBottom: 4 }}>{t.fullPrice}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: txtPri }}>€{totalPrice}</span>
                  <span style={{ fontSize: 13, color: txtMut }}>{t.perCourse}</span>
                </div>
                <div style={{ fontSize: 13, color: c.text, marginTop: 4, fontWeight: 600 }}>
                  €{SESSION_PRICE} {t.perSession} · {course.sessions} {t.sessionsTotal}
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${border}`, marginBottom: 20 }} />

              {/* What's included */}
              <div style={{ marginBottom: 20 }}>
                {[
                  `${course.sessions} ${t.liveMin} ${course.sessionLen} ${t.sessionsLabel}`,
                  `Max ${course.maxStudents} ${t.studentsPerClass}`,
                  t.realTeacher,
                  t.certificate,
                  t.recordings,
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: txtSec }}>
                    <CheckCircle2 size={14} style={{ color: c.text, flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>

              {/* Book button */}
              <motion.button
                onClick={handleBook}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{ width: '100%', padding: '14px 20px', borderRadius: 14, border: 'none', cursor: 'pointer', background: `linear-gradient(135deg, ${c.text}, ${c.text}BB)`, color: '#000', fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 6px 28px ${c.glow}`, marginBottom: 12 }}
              >
                {t.bookCourse} <ArrowRight size={16} strokeWidth={2.5} />
              </motion.button>

              {/* Free trial CTA */}
              <button
                onClick={() => go('trial')}
                style={{ width: '100%', padding: '12px 20px', borderRadius: 14, border: `1.5px solid ${border}`, cursor: 'pointer', background: 'transparent', color: txtSec, fontWeight: 600, fontSize: 14 }}
              >
                {t.tryFree}
              </button>

              <p style={{ textAlign: 'center', fontSize: 12, color: txtMut, marginTop: 14, lineHeight: 1.5 }}>
                {t.noCommit}
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
