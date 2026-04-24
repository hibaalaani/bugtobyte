import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Puzzle, Code2, Bot, Star } from 'lucide-react'

// ── Cat SVG ────────────────────────────────────────────────────
function CatMarker({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
      {/* Left ear */}
      <polygon points="7,18 3,4 16,13" fill={color} />
      <polygon points="9,17 6,7 15,13" fill="#FFAEB0" />
      {/* Right ear */}
      <polygon points="41,18 45,4 32,13" fill={color} />
      <polygon points="39,17 42,7 33,13" fill="#FFAEB0" />
      {/* Head */}
      <circle cx="24" cy="26" r="16" fill={color} />
      {/* Left eye */}
      <ellipse cx="17" cy="23" rx="3" ry="3.5" fill="#1A1A2E" />
      <ellipse cx="18" cy="22" rx="1.2" ry="1.5" fill="white" />
      {/* Right eye */}
      <ellipse cx="31" cy="23" rx="3" ry="3.5" fill="#1A1A2E" />
      <ellipse cx="32" cy="22" rx="1.2" ry="1.5" fill="white" />
      {/* Nose */}
      <ellipse cx="24" cy="29" rx="2" ry="1.3" fill="#FF9BAD" />
      {/* Mouth */}
      <path d="M20.5,31 Q24,34.5 27.5,31" stroke="#1A1A2E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Left whiskers */}
      <line x1="3"  y1="28" x2="16" y2="29.5" stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" />
      <line x1="3"  y1="32" x2="16" y2="31"   stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" />
      {/* Right whiskers */}
      <line x1="32" y1="29.5" x2="45" y2="28" stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" />
      <line x1="32" y1="31"   x2="45" y2="32" stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

// ── Floating star burst on arrival ────────────────────────────
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
    id: 'scratch',
    label: 'Scratch Explorers',
    short: 'Scratch',
    ages: 'Ages 7–9',
    badge: 'Beginner',
    Icon: Puzzle,
    color: '#00FF87',
    glow: 'rgba(0,255,135,0.35)',
    bg: 'rgba(0,255,135,0.12)',
    border: 'rgba(0,255,135,0.35)',
    stars: 1,
    left: '14%',
  },
  {
    id: 'python',
    label: 'Python Pioneers',
    short: 'Python',
    ages: 'Ages 10–12',
    badge: 'Intermediate',
    Icon: Code2,
    color: '#60A5FA',
    glow: 'rgba(96,165,250,0.35)',
    bg: 'rgba(96,165,250,0.12)',
    border: 'rgba(96,165,250,0.35)',
    stars: 2,
    left: '50%',
  },
  {
    id: 'ai',
    label: 'AI Innovators',
    short: 'AI',
    ages: 'Ages 13+',
    badge: 'Advanced',
    Icon: Bot,
    color: '#C084FC',
    glow: 'rgba(192,132,252,0.35)',
    bg: 'rgba(192,132,252,0.12)',
    border: 'rgba(192,132,252,0.35)',
    stars: 3,
    left: '86%',
  },
]

// ── Main component ─────────────────────────────────────────────
export default function LearningJourneyMap({
  initialStage = 0,
}: {
  initialStage?: 0 | 1 | 2
}) {
  const [stage, setStage]         = useState<number>(initialStage)
  const [bursting, setBursting]   = useState(false)
  const [prevStage, setPrevStage] = useState<number>(initialStage)

  const moveCat = (s: 0 | 1 | 2) => {
    if (s === stage) return
    setPrevStage(stage)
    setStage(s)
    setBursting(false)
    setTimeout(() => setBursting(true), 850)
    setTimeout(() => setBursting(false), 1600)
  }

  const m = MILESTONES[stage]

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
          <div key={i}
            className="absolute rounded-full"
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
          Tap a milestone to move your cat
        </p>
      </div>

      {/* ── Map area ── */}
      <div className="relative mx-auto" style={{ height: 210 }}>

        {/* Ground strip */}
        <div className="absolute left-0 right-0 rounded-full overflow-hidden"
          style={{ top: 118, height: 6, background: 'rgba(255,255,255,0.05)' }}>
          {/* Progress fill */}
          <motion.div
            animate={{ width: stage === 0 ? '14%' : stage === 1 ? '50%' : '86%' }}
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
          initial={{ left: MILESTONES[initialStage].left }}
          animate={{ left: m.left }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="absolute"
          style={{ top: 60, transform: 'translateX(-50%)', width: 48, height: 48, zIndex: 20 }}>

          {/* Glow behind cat */}
          <motion.div
            animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full -z-10"
            style={{ background: m.glow, filter: 'blur(10px)', transform: 'scale(1.3)' }}
          />

          {/* Cat bounces on arrival */}
          <motion.div
            key={`cat-${stage}`}
            initial={{ y: -16, scale: 0.85, rotate: prevStage < stage ? -10 : 10 }}
            animate={{ y: 0, scale: 1, rotate: 0 }}
            transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}>
            <CatMarker color={m.color} />
          </motion.div>

          {/* Star burst on arrival */}
          {bursting && <Burst color={m.color} />}

          {/* Cat shadow */}
          <div className="mx-auto mt-1 rounded-full" style={{
            width: 28, height: 5,
            background: m.glow,
            filter: 'blur(5px)',
            opacity: 0.6,
          }} />
        </motion.div>

        {/* ── Milestone nodes ── */}
        {MILESTONES.map((ms, i) => (
          <button
            key={ms.id}
            onClick={() => moveCat(i as 0 | 1 | 2)}
            className="absolute flex flex-col items-center gap-0"
            style={{ left: ms.left, top: 90, transform: 'translateX(-50%)', cursor: 'pointer' }}
            title={`Move to ${ms.label}`}
          >
            {/* Node */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
              className="relative flex items-center justify-center rounded-2xl"
              style={{
                width: 52, height: 52,
                background: stage >= i ? ms.bg : 'rgba(255,255,255,0.04)',
                border: `2px solid ${stage >= i ? ms.border : 'rgba(255,255,255,0.09)'}`,
                boxShadow: stage === i ? `0 0 24px ${ms.glow}` : stage > i ? `0 0 12px ${ms.glow}` : 'none',
                transition: 'background 0.4s, border-color 0.4s, box-shadow 0.4s',
              }}>
              <ms.Icon
                size={22}
                style={{ color: stage >= i ? ms.color : 'rgba(255,255,255,0.18)', transition: 'color 0.4s' }}
              />
              {/* Completed tick */}
              {stage > i && (
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
                  style={{ background: '#00FF87', color: '#060E1E', boxShadow: '0 2px 8px rgba(0,255,135,0.5)' }}>
                  ✓
                </motion.div>
              )}
            </motion.div>

            {/* Stars */}
            <div className="flex gap-0.5 mt-2">
              {Array.from({ length: 3 }).map((_, si) => (
                <motion.div key={si}
                  animate={stage >= i && si < ms.stars ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ delay: 0.5 + si * 0.1, duration: 0.35 }}>
                  <Star
                    size={9}
                    fill={stage >= i && si < ms.stars ? '#FFD60A' : 'none'}
                    strokeWidth={stage >= i && si < ms.stars ? 0 : 1.5}
                    style={{ color: stage >= i && si < ms.stars ? '#FFD60A' : 'rgba(255,255,255,0.18)' }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Short label */}
            <span className="mt-1 font-bold text-[10px] tracking-wide leading-none"
              style={{
                color: stage >= i ? ms.color : 'rgba(255,255,255,0.22)',
                transition: 'color 0.4s',
              }}>
              {ms.short}
            </span>
          </button>
        ))}
      </div>

      {/* ── Active stage info card ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`info-${stage}`}
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
          {/* Icon */}
          <div className="flex items-center justify-center rounded-xl shrink-0"
            style={{ width: 42, height: 42, background: m.bg, border: `1.5px solid ${m.border}` }}>
            <m.Icon size={18} style={{ color: m.color }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-white leading-tight">{m.label}</div>
            <div className="text-[11px] mt-0.5 font-medium" style={{ color: m.color }}>
              {m.ages} · {m.badge}
            </div>
          </div>

          {/* Stars earned */}
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

          {/* Stage number badge */}
          <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black"
            style={{ background: m.color, color: '#060E1E', boxShadow: `0 0 14px ${m.glow}` }}>
            {`0${stage + 1}`}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Stage selector buttons ── */}
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {MILESTONES.map((ms, i) => (
          <motion.button
            key={ms.id}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => moveCat(i as 0 | 1 | 2)}
            className="py-2.5 rounded-xl text-[11px] font-bold tracking-wide leading-none transition-all duration-300"
            style={{
              background:  stage === i ? ms.color : 'rgba(255,255,255,0.04)',
              color:       stage === i ? '#060E1E' : 'rgba(255,255,255,0.38)',
              border:      `1.5px solid ${stage === i ? ms.color : 'rgba(255,255,255,0.07)'}`,
              boxShadow:   stage === i ? `0 4px 18px ${ms.glow}` : 'none',
            }}>
            {ms.short}
          </motion.button>
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div className="mt-5 flex items-center gap-3">
        <span className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: 'rgba(255,255,255,0.3)', minWidth: 48 }}>
          Progress
        </span>
        <div className="flex-1 rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            animate={{ width: `${((stage + 1) / 3) * 100}%` }}
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
          {Math.round(((stage + 1) / 3) * 100)}%
        </span>
      </div>
    </div>
  )
}
