import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowLeft, FileText } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-4" style={{ borderBottom: '1px solid var(--divider)' }}>
      <dt className="text-[11px] font-bold tracking-[0.14em] uppercase mb-1 font-display" style={{ color: 'var(--text-muted)' }}>{label}</dt>
      <dd className="text-[15px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>{children}</dd>
    </div>
  )
}

function Section({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })
  return (
    <motion.div
      ref={ref}
      initial={{ y: 28, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10"
    >
      <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      {children}
    </motion.div>
  )
}

export default function ImpressumPage({ setPage }: { setPage: (p: string) => void }) {
  const { isDark } = useTheme()

  return (
    <div style={{ background: 'var(--bg-main)', color: 'var(--text-primary)', paddingTop: 80, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--divider)', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
        <div className="max-w-3xl mx-auto px-6 py-10">
          <button
            onClick={() => setPage('home')}
            className="flex items-center gap-2 text-[13px] mb-6 transition-colors duration-150"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#FFD60A')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <ArrowLeft size={14} /> Back to Home
          </button>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: isDark ? 'rgba(255,214,10,0.12)' : 'rgba(180,83,9,0.10)', border: isDark ? '1px solid rgba(255,214,10,0.25)' : '1px solid rgba(180,83,9,0.20)' }}>
                <FileText size={18} style={{ color: isDark ? '#FFD60A' : '#B45309' }} />
              </div>
              <span className="tag">Legal · Pflichtangaben nach §5 TMG</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl md:text-[44px] leading-tight tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
              Impressum
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Angaben gemäß § 5 TMG (Telemediengesetz) und § 55 RStV
            </p>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 py-14">

        <Section title="Anbieter / Service Provider" delay={0.05}>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
            <dl>
              <div className="px-6">
                <InfoBlock label="Business Name / Unternehmensname">
                  [Business Name Placeholder]<br />
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>e.g. BugToByte Academy UG (haftungsbeschränkt)</span>
                </InfoBlock>
                <InfoBlock label="Address / Anschrift">
                  [Street &amp; House Number]<br />
                  [Postal Code] [City]<br />
                  Germany / Deutschland
                </InfoBlock>
                <InfoBlock label="Direct Contact Phone / Direktkontakt Telefon">
                  [+49 XXX XXXXXXX]<br />
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    Hinweis: Eine Telefonnummer ist gemäß § 5 TMG Pflicht und muss eine direkte Erreichbarkeit ohne Mehrkosten gewährleisten.
                  </span>
                </InfoBlock>
                <InfoBlock label="Email">
                  <a href="mailto:hello@bugtobyte.com" style={{ color: isDark ? '#FFD60A' : '#B45309' }} className="underline">
                    hello@bugtobyte.com
                  </a>
                </InfoBlock>
              </div>
            </dl>
          </div>
        </Section>

        <Section title="Vertreten durch / Represented by" delay={0.08}>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
            <dl>
              <div className="px-6">
                <InfoBlock label="Geschäftsführer / Managing Director">
                  [Full Name of Managing Director]
                </InfoBlock>
              </div>
            </dl>
          </div>
        </Section>

        <Section title="Registereintrag / Company Registration" delay={0.1}>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
            <dl>
              <div className="px-6">
                <InfoBlock label="Registergericht / Register Court">
                  [e.g. Amtsgericht Berlin-Charlottenburg]
                </InfoBlock>
                <InfoBlock label="Handelsregisternummer / Registration Number">
                  [e.g. HRB XXXXXXX]
                </InfoBlock>
                <InfoBlock label="Umsatzsteuer-ID (§ 27a UStG) / VAT ID">
                  [e.g. DE XXXXXXXXX]
                </InfoBlock>
              </div>
            </dl>
          </div>
          <p className="text-[13px] mt-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Wenn kein Handelsregistereintrag besteht (z. B. Kleingewerbe), entfällt diese Angabe.
            Umsatzsteuer-ID ist nur erforderlich, wenn steuerpflichtige Umsätze vorliegen.
          </p>
        </Section>

        <Section title="Inhaltlich verantwortlich / Responsible for Content" delay={0.12}>
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <p className="text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:<br />
              <strong style={{ color: 'var(--text-primary)' }}>[Full Name]</strong><br />
              [Street &amp; Number], [Postal Code] [City], Germany
            </p>
          </div>
        </Section>

        <Section title="Streitschlichtung / Dispute Resolution" delay={0.14}>
          <div className="text-[15px] leading-[1.85] space-y-3" style={{ color: 'var(--text-secondary)' }}>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <strong>https://ec.europa.eu/consumers/odr</strong>
            </p>
            <p>
              Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet,
              an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </Section>

        <Section title="Haftungsausschluss / Disclaimer" delay={0.16}>
          <div className="text-[15px] leading-[1.85] space-y-4" style={{ color: 'var(--text-secondary)' }}>
            <div>
              <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Haftung für Inhalte</p>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach
                den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter
                jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Haftung für Links</p>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter. Auf deren Inhalte haben wir keinen
                Einfluss und übernehmen daher keine Gewähr. Für die Inhalte der verlinkten Seiten ist stets
                der jeweilige Anbieter verantwortlich.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Urheberrecht / Copyright</p>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
                deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
                jeweiligen Autors bzw. Erstellers.
              </p>
            </div>
          </div>
        </Section>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="rounded-2xl p-5 text-[13px] leading-relaxed"
          style={{ background: isDark ? 'rgba(255,214,10,0.05)' : 'rgba(180,83,9,0.05)', border: isDark ? '1px solid rgba(255,214,10,0.15)' : '1px solid rgba(180,83,9,0.15)', color: 'var(--text-muted)' }}
        >
          <strong style={{ color: isDark ? '#FFD60A' : '#B45309' }}>Note for operator:</strong>{' '}
          Replace all placeholders in square brackets [&nbsp;] with your actual business details before going
          live. A German Impressum with a missing phone number or incorrect company data can result in costly
          cease-and-desist letters (Abmahnungen).
        </motion.div>

      </div>
    </div>
  )
}
