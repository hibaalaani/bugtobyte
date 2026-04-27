import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Puzzle, Code2, Bot, Star } from 'lucide-react'

// ── Course totals (must match COURSES data) ───────────────────
const TOTALS = { scratch: 12, python: 16, ai: 10 } as const
const TOTAL_SESSIONS = TOTALS.scratch + TOTALS.python + TOTALS.ai // 38

// ── Cat SVG ────────────────────────────────────────────────────
function CatMarker({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
      <polygon points="7,18 3,4 16,13" fill={color} />
      <polygon points="9,17 6,7 15,13" fill="#FFAEB0" />
      <polygon points="41,18 45,4 32,13" fill={color} />
      <polygon points="39,17 42,7 33,13" fill="#FFAEB0" />
      <circle cx="24" cy="26" r="16" fill={color} />
      <ellipse cx="17" cy="23" rx="3" ry="3.5" fill="#1A1A2E" />
      <ellipse cx="18" cy="22" rx="1.2" ry="1.5" fill="white" />
      <ellipse cx="31" cy="23" rx="3" ry="3.5" fill="#1A1A2E" />
      <ellipse cx="32" cy="22" rx="1.2" ry="1.5" fill="white" />
      <ellipse cx="24" cy="29" rx="2" ry="1.3" fill="#FF9BAD" />
      <path d="M20.5,31 Q24,34.5 27.5,31" stroke="#1A1A2E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <line x1="3"  y1="28" x2="16" y2="29.5" stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" />
      <line x1="3"  y1="32" x2="16" y2="31"   stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" />
      <line x1="32" y1="29.5" x2="45" y2="28" stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" />
      <line x1="32" y1="31"   x2="45" y2="32" stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

// ── Star burst on milestone arrival ───────────────────────────
function Burst({ color }: { color: string }) {
  const items = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * 2 * Math.PI
    return { x: Math.cos(angle) * 36, y: Math.sin(angle) * 36 }
  })
  return (
    <AnimatePresence>
      {items.map((pos, i) => (
        <motion.div key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
          animate={{ x: pos.x, y: pos.y, opacity: 0, scale: 1.4 }}
          exit={{}}
          transition={{ duration: 0.7, delay: i * 0.05, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ zIndex: 10 }}>
          <Star size={10} fill={color} style={{ color }} />
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

// ── Milestones config ──────────────────────────────────────────
const MILESTONES = [
  {
    id: 'scratch', label: 'Scratch Explorers', short: 'Scratch', ages: 'Ages 7–9',
    badge: 'Beginner', Icon: Puzzle,
    color: '#00FF87', glow: 'rgba(0,255,135,0.35)',
    bg: 'rgba(0,255,135,0.12)', border: 'rgba(0,255,135,0.35)',
    stars: 1, left: '14%',
  },
  {
    id: 'python', label: 'Python Pioneers', short: 'Python', ages: 'Ages 10–12',
    badge: 'Intermediate', Icon: Code2,
    color: '#60A5FA', glow: 'rgba(96,165,250,0.35)',
    bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.35)',
    stars: 2, left: '50%',
  },
  {
    id: 'ai', label: 'AI Innovators', short: 'AI', ages: 'Ages 13+',
    badge: 'Advanced', Icon: Bot,
    color: '#C084FC', glow: 'rgba(192,132,252,0.35)',
    bg: 'rgba(192,132,252,0.12)', border: 'rgba(192,132,252,0.35)',
    stars: 3, left: '86%',
  },
]

// ── Compute cat's left% from per-course session counts ─────────
function computeCatLeft(scratch: number, python: number): string {
  const s = Math.min(scratch, TOTALS.scratch)
  const p = Math.min(python, TOTALS.python)

  if (s < TOTALS.scratch) {
    const pct = s / TOTALS.scratch
    return `${14 + pct * (50 - 14)}%`
  }
  if (p < TOTALS.python) {
    const pct = p / TOTALS.python
    return `${50 + pct * (86 - 50)}%`
  }
  return '86%'
}

// ── Main component ─────────────────────────────────────────────
export default function LearningJourneyMap({
  sessions = { scratch: 0, python: 0, ai: 0 },
}: {
  sessions?: { scratch: number; python: number; ai: number }
}) {
  const [bursting, setBursting] = useState(false)
  const mountedRef = useRef(false)

  const scratchDone = Math.min(sessions.scratch, TOTALS.scratch)
  const pythonDone  = Math.min(sessions.python,  TOTALS.python)
  const aiDone      = Math.min(sessions.ai,      TOTALS.ai)

  const catLeft = useMemo(
    () => computeCatLeft(scratchDone, pythonDone),
    [scratchDone, pythonDone],
  )

  const activeStage = scratchDone >= TOTALS.scratch && pythonDone >= TOTALS.python ? 2
                    : scratchDone >= TOTALS.scratch ? 1
                    : 0

  const totalDone   = scratchDone + pythonDone + aiDone
  const progressPct = Math.round((totalDone / TOTAL_SESSIONS) * 100)

  const currentProgress = {
    done:  [scratchDone, pythonDone, aiDone][activeStage],
    total: [TOTALS.scratch, TOTALS.python, TOTALS.ai][activeStage],
  }

  const m = MILESTONES[activeStage]

  // Burst when a course is completed (skip on first mount)
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    const isMilestone = totalDone === TOTALS.scratch
                     || totalDone === TOTALS.scratch + TOTALS.python
                     || totalDone === TOTAL_SESSIONS
    if (isMilestone) {
      setBursting(true)
      const t = setTimeout(() => setBursting(false), 1600)
      return () => clearTimeout(t)
    }
  }, [totalDone])

  return (
    <div className="relative rounded-3xl overflow-hidden select-none"
      style={{
        background: 'linear-gradient(135deg, #060E1E 0%, #0D1B36 60%, #060E1E 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
        padding: '28px 24px 24px',
      }}>

      {/* ── Starfield dots ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {[...Array(28)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width:  i % 3 === 0 ? 2 : 1,
              height: i % 3 === 0 ? 2 : 1,
              background: 'rgba(255,255,255,0.35)',
              top:  `${(i * 37 + 11) % 100}%`,
              left: `${(i * 53 + 7)  % 100}%`,
              opacity: 0.3 + (i % 4) * 0.12,
            }}
          />
        ))}
      </div>

      {/* ── Header ── */}
      <div className="relative text-center mb-7">
        <div className="inline-flex items-center gap-1.5 mb-2 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
          style={{ background: 'rgba(255,214,10,0.12)', color: '#FFD60A', border: '1px solid rgba(255,214,10,0.28)' }}>
          <Star size={9} fill="#FFD60A" style={{ color: '#FFD60A' }} />
          Learning Journey Map
        </div>
        <h3 className="font-bold text-white text-lg leading-tight tracking-tight">
          Adventure in Progress
        </h3>
        <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {totalDone} of {TOTAL_SESSIONS} sessions completed
        </p>
      </div>

      {/* ── Map area ── */}
      <div className="relative mx-auto" style={{ height: 210 }}>

        {/* Ground strip */}
        <div className="absolute left-0 right-0 rounded-full overflow-hidden"
          style={{ top: 118, height: 6, background: 'rgba(255,255,255,0.05)' }}>
          <motion.div
            animate={{ width: catLeft }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${MILESTONES[0].color}, ${m.color})`,
              borderRadius: 99,
            }}
          />
        </div>

        {/* Dotted path overlay */}
        <svg className="absolute inset-0 w-full pointer-events-none" style={{ top: 115, height: 12 }} aria-hidden>
          <line x1="5%" y1="6" x2="95%" y2="6"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="3"
            strokeDasharray="8,10"
            strokeLinecap="round"
          />
        </svg>

        {/* ── Cat marker ── */}
        <motion.div
          initial={{ left: catLeft }}
          animate={{ left: catLeft }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="absolute"
          style={{ top: 60, transform: 'translateX(-50%)', width: 48, height: 48, zIndex: 20 }}>

          <motion.div
            animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full -z-10"
            style={{ background: m.glow, filter: 'blur(10px)', transform: 'scale(1.3)' }}
          />

          <motion.div
            key={catLeft}
            initial={{ y: -16, scale: 0.85, rotate: -10 }}
            animate={{ y: 0, scale: 1, rotate: 0 }}
            transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}>
            <CatMarker color={m.color} />
          </motion.div>

          {bursting && <Burst color={m.color} />}

          <div className="mx-auto mt-1 rounded-full" style={{
            width: 28, height: 5,
            background: m.glow,
            filter: 'blur(5px)',
            opacity: 0.6,
          }} />
        </motion.div>

        {/* ── Milestone nodes ── */}
        {MILESTONES.map((ms, i) => {
          const isCompleted = activeStage > i
          const isCurrent   = activeStage === i
          const isUnlocked  = isCompleted || isCurrent

          return (
            <div key={ms.id}
              className="absolute flex flex-col items-center gap-0"
              style={{ left: ms.left, top: 90, transform: 'translateX(-50%)' }}>

              <div className="relative flex items-center justify-center rounded-2xl"
                style={{
                  width: 52, height: 52,
                  background: isUnlocked ? ms.bg : 'rgba(255,255,255,0.04)',
                  border: `2px solid ${isUnlocked ? ms.border : 'rgba(255,255,255,0.09)'}`,
                  boxShadow: isCurrent ? `0 0 24px ${ms.glow}` : isCompleted ? `0 0 12px ${ms.glow}` : 'none',
                  transition: 'background 0.4s, border-color 0.4s, box-shadow 0.4s',
                }}>
                <ms.Icon
                  size={22}
                  style={{ color: isUnlocked ? ms.color : 'rgba(255,255,255,0.18)', transition: 'color 0.4s' }}
                />
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
                    style={{ background: '#00FF87', color: '#060E1E', boxShadow: '0 2px 8px rgba(0,255,135,0.5)' }}>
                    ✓
                  </motion.div>
                )}
              </div>

              <div className="flex gap-0.5 mt-2">
                {Array.from({ length: 3 }).map((_, si) => (
                  <motion.div key={si}
                    animate={isUnlocked && si < ms.stars ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                    transition={{ delay: 0.5 + si * 0.1, duration: 0.35 }}>
                    <Star
                      size={9}
                      fill={isUnlocked && si < ms.stars ? '#FFD60A' : 'none'}
                      strokeWidth={isUnlocked && si < ms.stars ? 0 : 1.5}
                      style={{ color: isUnlocked && si < ms.stars ? '#FFD60A' : 'rgba(255,255,255,0.18)' }}
                    />
                  </motion.div>
                ))}
              </div>

              <span className="mt-1 font-bold text-[10px] tracking-wide leading-none"
                style={{ color: isUnlocked ? ms.color : 'rgba(255,255,255,0.22)', transition: 'color 0.4s' }}>
                {ms.short}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── Active stage info card ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`info-${activeStage}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="relative rounded-2xl flex items-center gap-4"
          style={{
            background: m.bg,
            border: `1px solid ${m.border}`,
            padding: '14px 16px',
            marginTop: 4,
          }}>
          <div className="flex items-center justify-center rounded-xl shrink-0"
            style={{ width: 42, height: 42, background: m.bg, border: `1.5px solid ${m.border}` }}>
            <m.Icon size={18} style={{ color: m.color }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-white leading-tight">{m.label}</div>
            <div className="text-[11px] mt-0.5 font-medium" style={{ color: m.color }}>
              {currentProgress.done} of {currentProgress.total} sessions · {m.badge}
            </div>
          </div>

          <div className="flex gap-1 shrink-0">
            {Array.from({ length: m.stars }).map((_, i) => (
              <motion.div key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 400 }}>
                <Star size={15} fill="#FFD60A" style={{ color: '#FFD60A' }} />
              </motion.div>
            ))}
          </div>

          <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black"
            style={{ background: m.color, color: '#060E1E', boxShadow: `0 0 14px ${m.glow}` }}>
            {`0${activeStage + 1}`}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Progress bar ── */}
      <div className="mt-5 flex items-center gap-3">
        <span className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: 'rgba(255,255,255,0.3)', minWidth: 48 }}>
          Progress
        </span>
        <div className="flex-1 rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: '100%',
              borderRadius: 99,
              background: `linear-gradient(90deg, ${MILESTONES[0].color}, ${m.color})`,
              boxShadow: `0 0 10px ${m.glow}`,
            }}
          />
        </div>
        <span className="text-[11px] font-bold tabular-nums"
          style={{ color: m.color, minWidth: 28, textAlign: 'right' }}>
          {progressPct}%
        </span>
      </div>
    </div>
  )
}
