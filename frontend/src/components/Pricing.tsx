import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Check, Zap, Star, Rocket, ArrowRight, Sparkles, MessageCircle } from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Plan data
// ─────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'starter', name: 'Starter', icon: Zap,
    tagline: 'One course. One child. Perfect first step.',
    price: 149, period: 'per course', highlight: false, ctaLabel: 'Get Started',
    includes: ['Choose any 1 course'],
    features: [
      '8–10 live sessions (60–90 min)',
      'Max 5–6 students per class',
      'Scratch, AI or Python — you pick',
      'End-of-course project showcase',
      'Digital certificate of completion',
      'Email support for parents',
    ],
  },
  {
    id: 'explorer', name: 'Explorer', icon: Star,
    tagline: 'Two courses. Bigger skills. Better value.',
    price: 279, period: 'for 2 courses', highlight: true, badge: 'Best Value', ctaLabel: 'Enrol Now',
    includes: ['Any 2 courses of your choice'],
    features: [
      'Everything in Starter',
      'Access to any 2 courses',
      'Priority booking for all sessions',
      'Parent progress dashboard',
      'Private messaging with instructor',
      'Save £49 vs individual pricing',
    ],
  },
  {
    id: 'prodigy', name: 'Prodigy', icon: Rocket,
    tagline: 'All three courses + private mentoring.',
    price: 449, period: 'all 3 courses', highlight: false, badge: 'Full Journey', ctaLabel: 'Join Prodigy',
    includes: ['Scratch Creators', 'AI Fundamentals', 'Python Lab'],
    features: [
      'Everything in Explorer',
      'All 3 courses unlocked',
      'Monthly 1-to-1 mentoring session',
      'Early access to new courses',
      'Dedicated WhatsApp support',
      'Save £79 vs individual pricing',
    ],
  },
]

// ─────────────────────────────────────────────────────────────
// FAQ data (real parent questions)
// ─────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'What age is best to start coding?',
    a: "We welcome children from age 7. Our Scratch Creators course is designed specifically for 7–9 year olds with zero experience — no typing, no frustration. The earlier they start, the more natural it feels. That said, there's never a wrong age to begin, and our Python Lab has taken 14-year-olds from zero to building real apps in just 10 weeks.",
  },
  {
    q: 'Does my child need any prior coding experience?',
    a: 'Not at all. Every course starts from the very beginning for its exact age group. Scratch Creators assumes no prior knowledge whatsoever. Even our Python Lab eases students in gradually — we never throw anyone in the deep end.',
  },
  {
    q: 'How are classes delivered?',
    a: "All sessions are live online via Zoom. Your child joins a small group (max 5–6 students), works alongside peers, and gets real-time support from their instructor. It's genuinely interactive — students share screens, build projects together, and show off their work at the end of every session.",
  },
  {
    q: 'What equipment does my child need?',
    a: 'A laptop or desktop computer (Windows or Mac), a stable internet connection, and a working webcam. Scratch runs entirely in the browser — no downloads needed. Python requires a free VS Code installation, which we help set up together in session one.',
  },
  {
    q: 'What happens if my child misses a session?',
    a: 'Life happens. All sessions are recorded and shared with enrolled families within 24 hours. If your child needs to miss a class, email us in advance and we\'ll arrange a free catch-up slot with the instructor.',
  },
  {
    q: 'Can my child join mid-term?',
    a: "We recommend starting from the beginning of a course since each session builds on the last. However, if a spot opens mid-course and your child has relevant experience, we'll assess their level and place them accordingly — at no extra charge.",
  },
  {
    q: 'Is there a certificate at the end?',
    a: 'Yes! Every student who completes a course receives a personalised digital certificate detailing the skills they gained and the projects they built. Many families print these out — the kids love them.',
  },
  {
    q: 'What is your refund policy?',
    a: "We offer a full refund within 48 hours of your first session if you're not completely satisfied — no questions asked. After that, we'll work with you to resolve any concerns. A happy, learning child is our only priority.",
  },
]

// ─────────────────────────────────────────────────────────────
// FAQ Accordion item
// ─────────────────────────────────────────────────────────────
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ y: 28, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.55, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl overflow-hidden"
      style={{
        background:   'rgba(45,48,71,0.42)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: open ? '1px solid rgba(255,203,119,0.32)' : '1px solid rgba(255,255,255,0.07)',
        transition: 'border-color 0.25s',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
      >
        <span className="font-display font-semibold text-[15px] leading-snug text-white group-hover:text-brand-yellow transition-colors duration-200">
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22 }}
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xl font-light"
          style={{
            background: open ? 'rgba(255,203,119,0.12)' : 'rgba(255,255,255,0.05)',
            color:      open ? '#FFCB77' : '#6B7280',
          }}
        >
          +
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="ans"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-[14px] leading-[1.8] text-slate-400 border-t border-white/[0.05] pt-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────
interface PricingProps {
  onSelectPlan?: (planId: string) => void
  setPage?:      (p: string) => void
}

export default function Pricing({ onSelectPlan, setPage }: PricingProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const inView    = useInView(headerRef, { once: true, margin: '-80px 0px' })

  return (
    <>
      {/* ╔══════════════════════════════════════════════════╗
          ║  PRICING                                        ║
          ╚══════════════════════════════════════════════════╝ */}
      <section
        id="pricing"
        className="relative py-28 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg,#0F1120 0%,#161929 50%,#0F1120 100%)',
        }}
      >
        <div className="grid-bg absolute inset-0 pointer-events-none opacity-40" />

        {/* Yellow glow */}
        <motion.div
          animate={{ opacity:[0.15, 0.35, 0.15], scale:[1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[380px] pointer-events-none"
          style={{ background:'radial-gradient(ellipse, rgba(255,203,119,0.1) 0%, transparent 70%)', filter:'blur(50px)' }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6">

          {/* Header */}
          <motion.div
            ref={headerRef}
            initial={{ y: 40, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-20"
          >
            <span className="tag"><Sparkles size={11} /> Transparent Pricing</span>
            <h2 className="font-display font-extrabold text-4xl md:text-[52px] text-white leading-[1.07] tracking-tight mb-5">
              Invest in Their Future,{' '}
              <span style={{ background:'linear-gradient(135deg,#FFCB77,#FFD99A)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                Not a Fortune
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
              No subscriptions, no surprises. Pay once per course and watch your child flourish.
            </p>
          </motion.div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-14">
            {PLANS.map((plan, i) => {
              const Icon = plan.icon
              const hi   = plan.highlight

              return (
                <motion.div
                  key={plan.id}
                  initial={{ y: 60, opacity: 0, scale: 1 }}
                  animate={inView ? { y: 0, opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.11, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.25 } }}
                  className="relative flex flex-col rounded-3xl overflow-hidden h-full"
                  style={{
                    background:     hi
                      ? 'linear-gradient(160deg,rgba(65,68,100,0.85) 0%,rgba(45,48,71,0.75) 100%)'
                      : 'linear-gradient(160deg,rgba(23,25,45,0.95) 0%,rgba(18,20,36,0.95) 100%)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border:         hi ? '1px solid rgba(255,203,119,0.38)' : '1px solid rgba(255,255,255,0.08)',
                    boxShadow:      hi ? '0 0 64px rgba(255,203,119,0.15), 0 20px 60px rgba(0,0,0,0.45)' : '0 8px 32px rgba(0,0,0,0.3)',
                  }}
                >
                  <div className="p-7 flex flex-col flex-1">

                    {/* Inner badge row */}
                    {plan.badge && (
                      <div className="mb-3">
                        <span
                          className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase px-4 py-1.5 rounded-full font-display whitespace-nowrap select-none"
                          style={{
                            background: 'rgba(255,203,119,0.18)',
                            color: '#FFCB77',
                            border: '1px solid rgba(255,203,119,0.55)',
                          }}
                        >
                          <Star size={9} fill="currentColor" /> {plan.badge}
                        </span>
                      </div>
                    )}

                    {/* Icon + name */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                        style={{ background: hi ? 'rgba(255,203,119,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${hi ? 'rgba(255,203,119,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
                        <Icon size={20} style={{ color: hi ? '#FFCB77' : '#606784' }} />
                      </div>
                      <div>
                        <div className="font-display font-bold text-[17px] text-white leading-none">{plan.name}</div>
                        <div className="text-[12px] text-slate-500 mt-0.5 leading-tight">{plan.tagline}</div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-5">
                      <div className="flex items-end gap-1">
                        <span className="font-display font-extrabold leading-none"
                          style={{ fontSize: 44, color: hi ? '#FFCB77' : 'white' }}>
                          £{plan.price}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[13px] mt-1">{plan.period}</div>
                    </div>

                    {/* Includes box */}
                    <div className="rounded-xl px-4 py-3 mb-5"
                      style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
                      <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2 font-display">Includes</div>
                      {plan.includes.map(c => (
                        <div key={c} className="flex items-center gap-2 text-[13px] text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: hi ? '#FFCB77' : '#4ECDC4' }} />
                          {c}
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <ul className="space-y-2.5 mb-7 flex-1">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-2.5 text-[13px] text-slate-400">
                          <Check size={14} className="mt-[2px] flex-shrink-0" style={{ color: hi ? '#FFCB77' : '#4ECDC4' }} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <motion.button
                      onClick={() => { onSelectPlan?.(plan.id); setPage?.('booking') }}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-display font-bold text-[15px]"
                      style={hi
                        ? { background:'linear-gradient(135deg,#FFCB77,#FFD99A)', color:'#1E2138', boxShadow:'0 0 32px rgba(255,203,119,0.32)' }
                        : { background:'rgba(255,255,255,0.07)', color:'white', border:'1px solid rgba(255,255,255,0.12)' }
                      }
                    >
                      {plan.ctaLabel} <ArrowRight size={15} strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Trust strip */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center text-slate-500 text-[14px]"
          >
            🔒 Secure checkout &nbsp;·&nbsp; ✅ Full refund within 48 hrs of first session &nbsp;·&nbsp; 🌍 All sessions live via Zoom
          </motion.p>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════╗
          ║  FAQ                                            ║
          ╚══════════════════════════════════════════════════╝ */}
      <section id="faq" className="relative py-28" style={{ background:'#0F1120' }}>
        <div className="grid-bg absolute inset-0 pointer-events-none opacity-25" />

        <div className="relative z-10 max-w-3xl mx-auto px-6">

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="tag">Parent FAQs</span>
            <h2 className="font-display font-extrabold text-4xl md:text-[48px] text-white leading-[1.08] tracking-tight mb-4">
              Questions Answered
            </h2>
            <p className="text-slate-400 text-lg">
              Everything parents ask before enrolling. Still unsure? We're one message away.
            </p>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((item, i) => (
              <FAQItem key={item.q} q={item.q} a={item.a} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mt-14"
          >
            <p className="text-slate-500 mb-6 text-[15px]">Still have a question? We reply within a few hours.</p>
            <button
              onClick={() => setPage?.('contact')}
              className="btn btn-ghost inline-flex items-center gap-2"
            >
              <MessageCircle size={16} /> Ask Us Anything
            </button>
          </motion.div>

        </div>
      </section>
    </>
  )
}
