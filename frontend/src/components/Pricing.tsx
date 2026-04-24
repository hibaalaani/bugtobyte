import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Check, Zap, Star, Rocket, ArrowRight, Sparkles, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'

// ─────────────────────────────────────────────────────────────
// Structural plan data — each card has its own neon color
// ─────────────────────────────────────────────────────────────
const PLAN_STRUCTURE = [
  { id: 'starter',  icon: Zap,    price: 99.90,  perSession: '€9.99', color: '#00E5FF', colorRgb: '0,229,255',   bgLight: '#E8FFFE', featured: false },
  { id: 'explorer', icon: Star,   price: 219.99, perSession: '€9.13', color: '#FFD60A', colorRgb: '255,214,10',  bgLight: '#FFFBF0', featured: true  },
  { id: 'prodigy',  icon: Rocket, price: 349.99, perSession: '€9.21', color: '#FF4081', colorRgb: '255,64,129',  bgLight: '#FFF0F5', featured: false },
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
        background: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: open ? '1px solid rgba(255,214,10,0.35)' : '1px solid var(--border-color)',
        transition: 'border-color 0.25s',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
      >
        <span className="font-display font-semibold text-[15px] leading-snug transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>
          {q}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22 }}
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xl font-light"
          style={{
            background: open ? 'rgba(255,214,10,0.10)' : 'var(--bg-input)',
            color:      open ? '#FFD60A' : 'var(--text-muted)',
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
            <p className="px-6 pb-6 text-[14px] leading-[1.8] pt-4" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--divider)' }}>
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
  const { tr }    = useLanguage()
  const { isDark } = useTheme()

  return (
    <>
      {/* ╔══════════════════════════════════════════════════╗
          ║  PRICING                                        ║
          ╚══════════════════════════════════════════════════╝ */}
      <section
        id="pricing"
        className="relative py-28 overflow-hidden"
        style={{
          background: isDark
            ? 'linear-gradient(180deg,#0A0C1A 0%,#0D1030 50%,#0A0C1A 100%)'
            : 'linear-gradient(180deg, var(--bg-alt) 0%, var(--bg-main) 50%, var(--bg-alt) 100%)',
        }}
      >
        <div className="grid-bg absolute inset-0 pointer-events-none opacity-40" />

        {/* Subtle ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
          style={{ background:'radial-gradient(ellipse, rgba(255,214,10,0.06) 0%, transparent 70%)', filter:'blur(60px)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6">

          {/* Header */}
          <motion.div
            ref={headerRef}
            initial={{ y: 40, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-20"
          >
            <span className="tag"><Sparkles size={11} /> {tr.pricing.tag}</span>
            <h2 className="font-display font-extrabold text-4xl md:text-[52px] leading-[1.07] tracking-tight mb-5" style={{ color: 'var(--text-primary)' }}>
              {tr.pricing.title1}{' '}
              <span className="bg-clip-text text-transparent inline-block"
                style={{ backgroundImage: isDark ? 'linear-gradient(135deg,#FFD60A,#FFE040)' : 'linear-gradient(135deg,#92400E,#D97706)' }}>
                {tr.pricing.titleHighlight}
              </span>
              {' '}{tr.pricing.title2}
            </h2>
            <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {tr.pricing.subtitle}
            </p>
          </motion.div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-14">
            {PLAN_STRUCTURE.map((plan, i) => {
              const Icon   = plan.icon
              const c      = plan.color
              const rgb    = plan.colorRgb
              const tPlan  = tr.pricing.plans[i]

              return (
                <motion.div
                  key={plan.id}
                  initial={{ y: 60, opacity: 0 }}
                  animate={inView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.7, delay: i * 0.11, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="relative flex flex-col rounded-3xl overflow-hidden h-full"
                  style={{
                    background: 'var(--bg-card)',
                    backdropFilter: isDark ? 'blur(24px)' : 'none',
                    WebkitBackdropFilter: isDark ? 'blur(24px)' : 'none',
                    border: `1px solid rgba(${rgb},0.12)`,
                    boxShadow: isDark
                      ? `0 0 24px rgba(${rgb},0.08), 0 8px 32px rgba(0,0,0,0.30)`
                      : `0 0 20px rgba(${rgb},0.10), 0 4px 20px rgba(0,0,0,0.07)`,
                  }}
                >
                  {/* Top color accent bar */}
                  <div className="h-1 w-full" style={{ background: c, opacity: 0.85 }} />

                  <div className="p-7 flex flex-col flex-1">

                    {/* Badge row */}
                    {tPlan.badge && (
                      <div className="mb-3">
                        <span
                          className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase px-4 py-1.5 rounded-full font-display whitespace-nowrap select-none"
                          style={{
                            background: `rgba(${rgb},0.10)`,
                            color: c,
                            border: `1px solid rgba(${rgb},0.25)`,
                          }}
                        >
                          <Star size={9} fill="currentColor" /> {tPlan.badge}
                        </span>
                      </div>
                    )}

                    {/* Icon + name */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                        style={{ background: `rgba(${rgb},0.10)`, border: `1px solid rgba(${rgb},0.20)` }}>
                        <Icon size={20} style={{ color: c }} />
                      </div>
                      <div>
                        <div className="font-display font-bold text-[17px] leading-none" style={{ color: 'var(--text-primary)' }}>{tPlan.name}</div>
                        <div className="text-[12px] mt-0.5 leading-tight" style={{ color: 'var(--text-muted)' }}>{tPlan.tagline}</div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-5">
                      <div className="flex items-end gap-2">
                        <span className="font-display font-extrabold leading-none" style={{ fontSize: 44, color: 'var(--text-primary)' }}>
                          €{plan.price}
                        </span>
                        <div className="mb-1.5">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full font-display"
                            style={{ background: `rgba(${rgb},0.12)`, color: c }}>
                            {plan.perSession}{tr.pricing.perSession}
                          </span>
                        </div>
                      </div>
                      <div className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>{tPlan.sessions} · {tPlan.period}</div>
                    </div>

                    {/* Includes box */}
                    <div className="rounded-xl px-4 py-3 mb-5"
                      style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}>
                      <div className="text-[10px] font-bold tracking-widest uppercase mb-2 font-display" style={{ color: 'var(--text-muted)' }}>{tr.pricing.includes}</div>
                      {tPlan.includes.map(inc => (
                        <div key={inc} className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c }} />
                          {inc}
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <ul className="space-y-2.5 mb-7 flex-1">
                      {tPlan.features.map(f => (
                        <li key={f} className="flex items-start gap-2.5 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                          <Check size={14} className="mt-[2px] flex-shrink-0" style={{ color: c }} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <motion.button
                      onClick={() => { onSelectPlan?.(plan.id); setPage?.('booking') }}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-display font-bold text-[15px]"
                      style={{
                        background: `rgba(${rgb},0.15)`,
                        color: c,
                        border: `1.5px solid rgba(${rgb},0.35)`,
                      }}
                    >
                      {tPlan.cta} <ArrowRight size={15} strokeWidth={2.5} />
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
            className="text-center text-[14px]"
            style={{ color: 'var(--text-muted)' }}
          >
            {tr.pricing.trust}
          </motion.p>
        </div>
      </section>

      {/* ╔══════════════════════════════════════════════════╗
          ║  FAQ                                            ║
          ╚══════════════════════════════════════════════════╝ */}
      <section id="faq" className="relative py-28" style={{ background: 'var(--bg-main)' }}>
        <div className="grid-bg absolute inset-0 pointer-events-none opacity-25" />

        <div className="relative z-10 max-w-3xl mx-auto px-6">

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="tag">{tr.pricing.faqTag}</span>
            <h2 className="font-display font-extrabold text-4xl md:text-[48px] leading-[1.08] tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              {tr.pricing.faqTitle}
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              {tr.pricing.faqSubtitle}
            </p>
          </motion.div>

          <div className="space-y-3">
            {tr.pricing.faqs.map((item, i) => (
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
            <p className="mb-6 text-[15px]" style={{ color: 'var(--text-muted)' }}>{tr.pricing.stillQuestion}</p>
            <button
              onClick={() => setPage?.('contact')}
              className="btn btn-ghost inline-flex items-center gap-2"
            >
              <MessageCircle size={16} /> {tr.pricing.askUs}
            </button>
          </motion.div>

        </div>
      </section>
    </>
  )
}
