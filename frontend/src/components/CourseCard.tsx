import { useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Puzzle, Brain, Code2, Clock, Users,
  Star, ArrowRight, Zap, CheckCircle2, ChevronDown, Sparkles,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────
export interface CourseData {
  id:          string
  slug:        string
  title:       string
  subtitle:    string
  description: string
  ageGroup:    '7-9' | '10-12' | '13-14'
  tool:        'Scratch' | 'AI + Scratch' | 'Python' | 'Claude AI'
  sessions:    number
  sessionLen:  string
  maxStudents: number
  priceEUR:    number
  skills:      string[]
  curriculum:  string[]   // "Week N — Topic" strings
  badge?:         string
  color:          'mint' | 'teal' | 'coral' | 'violet'
  image:          string
  imagePosition?: string
  comingSoon?:    boolean
}

interface CourseCardProps {
  course:  CourseData
  index:   number
  onBook?: (course: CourseData) => void
}

const TOOL_ICON = { Scratch: Puzzle, 'AI + Scratch': Brain, Python: Code2, 'Claude AI': Sparkles }

export default function CourseCard({ course, index, onBook }: CourseCardProps) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  const { isDark } = useTheme()
  const c = {
    mint:   { text: isDark ? '#A8EDCB' : '#0E9B64', border: isDark ? 'rgba(168,237,203,0.28)' : 'rgba(30,184,122,0.35)',  bg: isDark ? 'rgba(168,237,203,0.08)' : 'rgba(168,237,203,0.12)', imgOverlay: 'rgba(30,184,122,0.55)'  },
    teal:   { text: isDark ? '#4ECDC4' : '#0D8A83', border: isDark ? 'rgba(78,205,196,0.28)'  : 'rgba(78,205,196,0.35)',  bg: isDark ? 'rgba(78,205,196,0.08)'  : 'rgba(78,205,196,0.12)',  imgOverlay: 'rgba(20,168,160,0.55)'  },
    coral:  { text: isDark ? '#FF8A8A' : '#C93030', border: isDark ? 'rgba(255,107,107,0.28)' : 'rgba(255,107,107,0.35)', bg: isDark ? 'rgba(255,107,107,0.08)' : 'rgba(255,107,107,0.12)', imgOverlay: 'rgba(232,64,64,0.55)'   },
    violet: { text: isDark ? '#D580FF' : '#7B00D4', border: isDark ? 'rgba(200,88,255,0.30)'  : 'rgba(123,0,212,0.28)',   bg: isDark ? 'rgba(200,88,255,0.08)'  : 'rgba(200,88,255,0.10)',  imgOverlay: 'rgba(123,0,212,0.55)'   },
  }[course.color]
  const Icon   = TOOL_ICON[course.tool] ?? Zap
  const [showCurriculum, setShowCurriculum] = useState(false)
  const { tr } = useLanguage()
  const SESSION_PRICE = 9.99
  const totalPrice = (course.sessions * SESSION_PRICE).toFixed(2)
  const courseIndex = parseInt(course.id) - 1
  const td = tr.courses.data[courseIndex] ?? { subtitle: course.subtitle, description: course.description, skills: course.skills, curriculum: course.curriculum }

  return (
    <motion.div
      ref={ref}
      initial={{ y: 64, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, boxShadow: '0 24px 64px rgba(0,0,0,0.22)', transition: { duration: 0.3 } }}
      className="group relative flex flex-col rounded-3xl overflow-hidden flex-1"
      style={{
        background: 'var(--bg-card)',
        backdropFilter: isDark ? 'blur(22px)' : 'none',
        WebkitBackdropFilter: isDark ? 'blur(22px)' : 'none',
        border: isDark ? '1px solid rgba(255,255,255,0.09)' : `2px solid ${c.border}`,
        boxShadow: isDark ? 'var(--shadow-card)' : `0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)`,
      }}
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden" style={{ height: 210 }}>
        {course.image ? (
          <>
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c.text}33 0%, ${c.text}11 100%)` }} />
            <img src={course.image} alt={course.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: 'center center' }}
            />
          </>
        ) : (
          /* No photo — animated gradient as intentional visual */
          <>
            <motion.div className="absolute inset-0"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              style={{ background: `linear-gradient(135deg, ${c.text}55, ${c.text}18, ${c.text}66, ${c.text}22, ${c.text}55)`, backgroundSize: '300% 300%' }}
            />
            {/* Floating AI orb */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="flex items-center justify-center w-20 h-20 rounded-full"
                style={{ background: `radial-gradient(circle, ${c.text}55 0%, transparent 70%)`, border: `2px solid ${c.text}66` }}>
                <Sparkles size={36} style={{ color: c.text }} />
              </motion.div>
            </div>
          </>
        )}
        {/* Scrim: dark at bottom for readability */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, transparent 40%, rgba(0,0,0,0.45) 100%)' }} />

        {/* Top accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: c.text }} />

        {/* Age badge — top left */}
        <span className="absolute top-3 left-3 text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full font-display text-white"
          style={{ background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
          Ages {course.ageGroup}
        </span>

        {/* Course badge — top right */}
        {course.badge && (
          <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full font-display"
            style={{ background: 'rgba(255,214,10,0.96)', color: '#0A0C1A' }}>
            <Star size={9} fill="currentColor" /> {course.badge}
          </span>
        )}

        {/* Icon — bottom left, inside image */}
        <motion.div
          whileHover={{ rotate: 8, scale: 1.1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}
          className="absolute bottom-3 left-4 flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.93)', boxShadow: `0 2px 12px ${c.text}44`, border: `1.5px solid ${c.border}` }}>
          <Icon size={18} style={{ color: c.text }} />
        </motion.div>
      </div>

      {/* Title */}
      <div className="px-5 pt-4 pb-2">
        <h3 className="font-display font-bold text-xl leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>{course.title}</h3>
        <p className="text-[13px] font-semibold" style={{ color: c.text }}>{td.subtitle}</p>
      </div>

      {/* Description */}
      <div className="px-5 pb-4">
        <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{td.description}</p>
      </div>

      {/* Skills */}
      <div className="px-6 pb-4">
        <div className="text-[10px] font-bold tracking-widest uppercase mb-3 font-display" style={{ color: 'var(--text-muted)' }}>{tr.courses.whatTheyLearn}</div>
        <ul className="space-y-1.5">
          {td.skills.map(skill => (
            <li key={skill} className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={13} style={{ color: c.text, flexShrink: 0 }} /> {skill}
            </li>
          ))}
        </ul>
      </div>

      {/* Curriculum toggle */}
      <div className="px-6 pb-4">
        <button
          onClick={() => setShowCurriculum(s => !s)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] font-semibold font-display transition-colors duration-200"
          style={{
            background: showCurriculum ? c.bg : (isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC'),
            border: `1px solid ${showCurriculum ? c.border : (isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0')}`,
            color: showCurriculum ? c.text : 'var(--text-secondary)',
          }}
        >
          <span>{tr.courses.weekByCurriculum}</span>
          <motion.div animate={{ rotate: showCurriculum ? 180 : 0 }} transition={{ duration: 0.22 }}>
            <ChevronDown size={15} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {showCurriculum && (
            <motion.div
              key="curriculum"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-2 rounded-xl overflow-hidden"
                style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC', border: `1px solid ${c.border}` }}>
                {td.curriculum.map((item, i) => (
                  <div key={i}
                    className="flex items-start gap-3 px-4 py-2.5 text-[12.5px]"
                    style={{ borderBottom: i < course.curriculum.length - 1 ? '1px solid var(--border-color)' : 'none' }}
                  >
                    <span className="font-bold font-display shrink-0 w-14 text-[11px] pt-0.5"
                      style={{ color: c.text }}>
                      Week {i + 1}
                    </span>
                    <span className="leading-snug" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Meta */}
      <div className="mx-6 mb-5 grid grid-cols-3 gap-2 rounded-2xl p-3"
        style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#F1F5F9', border: '1px solid var(--border-color)' }}>
        {[
          { I: Clock, val: `${course.sessions} ${tr.courses.sessions}`, sub: course.sessionLen },
          { I: Users, val: `${tr.courses.maxLabel} ${course.maxStudents}`, sub: tr.courses.perClass },
          { I: Icon,  val: course.tool, sub: tr.courses.platform },
        ].map(({ I: MI, val, sub }) => (
          <div key={val} className="flex flex-col items-center text-center gap-0.5">
            <MI size={13} style={{ color: 'var(--text-muted)', marginBottom: 2 }} />
            <span className="text-[12px] font-bold font-display leading-none" style={{ color: 'var(--text-primary)' }}>{val}</span>
            <span className="text-[10px] leading-none" style={{ color: 'var(--text-muted)' }}>{sub}</span>
          </div>
        ))}
      </div>

      <div className="mx-6 h-px mb-5" style={{ background: 'var(--border-color)' }} />

      {/* Footer */}
      <div className="px-6 pb-6 mt-auto flex items-center justify-between gap-3">
          <div>
            <span className="font-display font-extrabold text-2xl" style={{ color: 'var(--text-primary)' }}>€{totalPrice}</span>
            <span className="text-[12px] ml-1" style={{ color: 'var(--text-muted)' }}>{tr.courses.perCourse}</span>
            <div className="text-[11px] mt-0.5" style={{ color: c.text }}>
              €{SESSION_PRICE} {tr.courses.perSession}
            </div>
          </div>
          <motion.button onClick={() => onBook?.(course)}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-display font-bold text-[14px]"
            style={{ background: 'linear-gradient(135deg,#FFD60A,#FFE040)', color: '#0A0C1A', boxShadow: '0 0 28px rgba(255,214,10,0.40)' }}>
            {tr.courses.bookNow} <ArrowRight size={14} strokeWidth={2.5} />
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
    ageGroup:'7-9', tool:'Scratch', sessions:8, sessionLen:'45 min', maxStudents:6, priceEUR:160,
    skills:['Sequences & logic','Loops and conditionals','Events & animation','Creative project design','Computational thinking'],
    curriculum:[
      'Welcome to Scratch — sprites, stage & your first animation',
      'Motion & Events — making characters move with keyboard & mouse',
      'Loops — repeating actions to create patterns & effects',
      'Looks & Sound — costumes, backdrops, music and sound effects',
      'Conditionals — teaching your game to make decisions',
      'Variables — keeping score and tracking progress',
      'Interactive Game Project — build your own complete game',
      'Demo Day — present and share your creation with the class',
    ],
    badge:'Best First Step', color:'mint',
    image:'/scratch-one.png', imagePosition:'35% 35%',
  },
  {
    id:'2', slug:'ai-fundamentals',
    title:'AI Fundamentals', subtitle:'Machine Learning Made Fun',
    description:"Students uncover how AI really works by training real machine-learning models and deploying them inside Scratch. Text recognition, image classification, sound detection — they build it all from scratch.",
    ageGroup:'10-12', tool:'AI + Scratch', sessions:8, sessionLen:'60 min', maxStudents:5, priceEUR:160,
    skills:['How AI learns from data','Training & testing models','Image & text recognition','Ethics of AI','Real-world AI applications'],
    curriculum:[
      'What Is AI? — how machines learn from examples (not rules)',
      'Collecting Training Data — what makes a good dataset',
      'Image Recognition — train a model to identify objects & faces',
      'Text & Sentiment — teaching AI to understand language',
      'Sound Classification — recognising audio patterns & commands',
      'AI + Scratch — adding your trained model to a live project',
      'AI Ethics — bias, fairness and responsible design',
      'AI Showcase — present your intelligent creation to the class',
    ],
    badge:'Most Popular', color:'teal',
    image:'/AI-kids.png', imagePosition:'65% 40%',
  },
  {
    id:'3', slug:'python-lab',
    title:'Python Lab', subtitle:'Real Code, Real Projects',
    description:"Teens graduate from blocks to professional Python — the language used at Google, NASA, and Netflix. They build functional apps, data projects, and games using the same tools real developers use every day.",
    ageGroup:'13-14', tool:'Python', sessions:10, sessionLen:'60 min', maxStudents:5, priceEUR:200,
    skills:['Variables, loops & functions','Object-oriented programming','Data structures & APIs','Debugging techniques','Independent capstone project'],
    curriculum:[
      'Hello Python — variables, print() and taking user input',
      'Control Flow — if/elif/else and comparison operators',
      'Loops — for and while, iterating over lists',
      'Functions — writing clean, reusable code',
      'Lists & Dictionaries — organising and accessing data',
      'File Handling — reading & writing real files',
      'Object-Oriented Python — classes, objects & methods',
      'APIs & Web Data — fetching live data from the internet',
      'Mini Game Sprint — build something fun in one session',
      'Capstone Project — design, build & demo your own app',
    ],
    badge:'Advanced Track', color:'coral',
    image:'/teenage-py.png', imagePosition:'60% 30%',
  },
  {
    id:'4', slug:'claude-ai-for-kids',
    title:'Claude AI for Kids', subtitle:'Prompt Engineering & AI Literacy',
    description:"Kids learn to talk to AI like a pro — writing precise prompts, building their own chatbots, and understanding how tools like Claude actually work. The most future-ready skill they can learn right now.",
    ageGroup:'10-12', tool:'Claude AI', sessions:8, sessionLen:'60 min', maxStudents:5, priceEUR:0,
    skills:[
      'Prompt engineering fundamentals',
      'Build a custom chatbot with a persona',
      'AI ethics & responsible use',
      'Using AI as a learning & creativity tool',
      'Critical thinking — when to trust AI',
    ],
    curriculum:[
      'What is Claude? — how large language models think vs humans',
      'The Art of Asking — vague vs specific prompts, the 3 elements of a great prompt',
      'Claude as a Story Partner — co-write a story, direct characters & plot',
      'Claude as a Study Buddy — summarise, quiz, explain. How to verify AI answers',
      'Build Your Own Chatbot — system prompts, giving Claude a persona & rules',
      'AI Ethics & Safety — bias, privacy, fake content, what AI should never do',
      'Solve a Real Problem — pick a real-world challenge, design an AI-powered solution',
      'Demo Day — present your chatbot & AI project to the class and parents',
    ],
    badge:'New', color:'violet',
    image:'',
  },
]
