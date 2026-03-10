import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Puzzle, Brain, Code2, Clock, Users,
  Star, ArrowRight, Zap, CheckCircle2,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────
export interface CourseData {
  id:          string
  slug:        string
  title:       string
  subtitle:    string
  description: string
  ageGroup:    '7-9' | '10-12' | '13-14'
  tool:        'Scratch' | 'AI + Scratch' | 'Python'
  sessions:    number
  sessionLen:  string
  maxStudents: number
  priceGBP:    number
  skills:      string[]
  badge?:      string
  color:       'mint' | 'teal' | 'coral'
}

interface CourseCardProps {
  course:  CourseData
  index:   number
  onBook?: (course: CourseData) => void
}

const COLOR = {
  mint:  { bg:'rgba(168,237,203,0.08)', border:'rgba(168,237,203,0.22)', text:'#A8EDCB', glow:'rgba(168,237,203,0.15)', pill:'rgba(168,237,203,0.12)' },
  teal:  { bg:'rgba(78,205,196,0.08)',  border:'rgba(78,205,196,0.22)',  text:'#4ECDC4', glow:'rgba(78,205,196,0.15)',  pill:'rgba(78,205,196,0.12)'  },
  coral: { bg:'rgba(255,107,107,0.08)', border:'rgba(255,107,107,0.22)', text:'#FF8A8A', glow:'rgba(255,107,107,0.15)', pill:'rgba(255,107,107,0.12)' },
}

const TOOL_ICON = { Scratch: Puzzle, 'AI + Scratch': Brain, Python: Code2 }

export default function CourseCard({ course, index, onBook }: CourseCardProps) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  const c      = COLOR[course.color]
  const Icon   = TOOL_ICON[course.tool] ?? Zap

  return (
    <motion.div
      ref={ref}
      initial={{ y: 64, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative flex flex-col rounded-3xl overflow-hidden"
      style={{
        background:'rgba(45,48,71,0.45)', backdropFilter:'blur(22px)',
        WebkitBackdropFilter:'blur(22px)',
        border:'1px solid rgba(255,255,255,0.09)',
        boxShadow:'0 8px 32px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.07)',
      }}
    >
      {/* Hover border glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
        style={{ boxShadow:`inset 0 0 0 1px ${c.border}` }} />

      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background:`linear-gradient(90deg, ${c.text}, transparent)` }} />

      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-6 pb-4">
        <motion.div whileHover={{ rotate:8, scale:1.1 }} transition={{ type:'spring', stiffness:300, damping:14 }}
          className="flex items-center justify-center w-12 h-12 rounded-2xl"
          style={{ background:c.bg, border:`1px solid ${c.border}` }}>
          <Icon size={22} style={{ color:c.text }} />
        </motion.div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full font-display"
            style={{ background:c.pill, color:c.text, border:`1px solid ${c.border}` }}>
            Ages {course.ageGroup}
          </span>
          {course.badge && (
            <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full font-display"
              style={{ background:'rgba(255,203,119,0.1)', color:'#FFCB77', border:'1px solid rgba(255,203,119,0.25)' }}>
              <Star size={9} fill="currentColor" /> {course.badge}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="px-6 pb-3">
        <h3 className="font-display font-bold text-xl text-white leading-tight mb-1">{course.title}</h3>
        <p className="text-[13px] font-semibold" style={{ color:c.text }}>{course.subtitle}</p>
      </div>

      {/* Description */}
      <div className="px-6 pb-5">
        <p className="text-[14px] leading-relaxed text-slate-400">{course.description}</p>
      </div>

      {/* Skills */}
      <div className="px-6 pb-5">
        <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-3 font-display">What they'll learn</div>
        <ul className="space-y-1.5">
          {course.skills.map(skill => (
            <li key={skill} className="flex items-center gap-2 text-[13px] text-slate-400">
              <CheckCircle2 size={13} style={{ color:c.text, flexShrink:0 }} /> {skill}
            </li>
          ))}
        </ul>
      </div>

      {/* Meta */}
      <div className="mx-6 mb-5 grid grid-cols-3 gap-2 rounded-2xl p-3"
        style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
        {[
          { I:Clock,  val:`${course.sessions} sessions`, sub:course.sessionLen },
          { I:Users,  val:`Max ${course.maxStudents}`,   sub:'per class'       },
          { I:Icon,   val:course.tool,                   sub:'platform'        },
        ].map(({ I:MI, val, sub }) => (
          <div key={val} className="flex flex-col items-center text-center gap-0.5">
            <MI size={13} className="text-slate-500 mb-0.5" />
            <span className="text-[12px] font-bold font-display text-white leading-none">{val}</span>
            <span className="text-[10px] text-slate-600 leading-none">{sub}</span>
          </div>
        ))}
      </div>

      <div className="mx-6 h-px bg-white/[0.06] mb-5" />

      {/* Footer */}
      <div className="px-6 pb-6 mt-auto flex items-center justify-between gap-3">
        <div>
          <span className="font-display font-extrabold text-2xl text-white">£{course.priceGBP}</span>
          <span className="text-slate-500 text-[12px] ml-1">/ course</span>
        </div>
        <motion.button onClick={() => onBook?.(course)}
          whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-display font-bold text-[14px]"
          style={{ background:'linear-gradient(135deg,#FFCB77,#FFD99A)', color:'#1E2138', boxShadow:'0 0 28px rgba(255,203,119,0.3)' }}>
          Book Now <ArrowRight size={14} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  )
}

// ── Real BugToByte course data ─────────────────────────────────
export const COURSES: CourseData[] = [
  {
    id:'1', slug:'scratch-creators',
    title:'Scratch Creators', subtitle:'Block Coding for Beginners',
    description:"Young learners dive into MIT's Scratch environment to design animated stories, interactive games, and creative simulations. No typing required — just drag, drop, and discover the joy of making things move.",
    ageGroup:'7-9', tool:'Scratch', sessions:8, sessionLen:'60 min', maxStudents:6, priceGBP:149,
    skills:['Sequences & logic','Loops and conditionals','Events & animation','Creative project design','Computational thinking'],
    badge:'Best First Step', color:'mint',
  },
  {
    id:'2', slug:'ai-fundamentals',
    title:'AI Fundamentals', subtitle:'Machine Learning Made Fun',
    description:"Students uncover how AI really works by training real machine-learning models and deploying them inside Scratch. Text recognition, image classification, sound detection — they build it all from scratch.",
    ageGroup:'10-12', tool:'AI + Scratch', sessions:8, sessionLen:'75 min', maxStudents:5, priceGBP:179,
    skills:['How AI learns from data','Training & testing models','Image & text recognition','Ethics of AI','Real-world AI applications'],
    badge:'Most Popular', color:'teal',
  },
  {
    id:'3', slug:'python-lab',
    title:'Python Lab', subtitle:'Real Code, Real Projects',
    description:"Teens graduate from blocks to professional Python — the language used at Google, NASA, and Netflix. They build functional apps, data projects, and games using the same tools real developers use every day.",
    ageGroup:'13-14', tool:'Python', sessions:10, sessionLen:'90 min', maxStudents:5, priceGBP:199,
    skills:['Variables, loops & functions','Object-oriented programming','Data structures & APIs','Debugging techniques','Independent capstone project'],
    badge:'Advanced Track', color:'coral',
  },
]
