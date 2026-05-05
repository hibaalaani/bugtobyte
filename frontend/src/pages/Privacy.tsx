import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowLeft, Shield } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

function Section({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })
  return (
    <motion.div
      ref={ref}
      initial={{ y: 32, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10"
    >
      <h2 className="font-display font-bold text-xl mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      <div className="text-[15px] leading-[1.85] space-y-3" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </motion.div>
  )
}

export default function PrivacyPage({ setPage }: { setPage: (p: string) => void }) {
  const { isDark } = useTheme()
  const EFFECTIVE_DATE = '1 May 2025'

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
                <Shield size={18} style={{ color: isDark ? '#FFD60A' : '#B45309' }} />
              </div>
              <span className="tag">Legal</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl md:text-[44px] leading-tight tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
              Privacy Policy
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Effective date: {EFFECTIVE_DATE} &nbsp;·&nbsp; BugToByte Academy
            </p>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 py-14">

        <Section title="1. Who We Are" delay={0.05}>
          <p>
            BugToByte Academy ("<strong>BugToByte</strong>", "we", "us", or "our") is an online coding school
            providing live, small-group classes for children aged 7–14. We are based in Berlin, Germany, and
            operate under German law and applicable European Union data-protection regulations.
          </p>
          <p>
            Our contact email is <strong>hello@bugtobyte.com</strong>. For data-protection enquiries please
            use the subject line "Data Protection".
          </p>
        </Section>

        <Section title="2. Our Commitment to Children's Privacy" delay={0.08}>
          <p>
            Protecting the privacy of children is especially important to us. Our services are directed at
            children under the age of 16, and we take additional care to comply with the EU General Data
            Protection Regulation (GDPR), the German Federal Data Protection Act (BDSG), and, where
            applicable, the Children's Online Privacy Protection Act (COPPA).
          </p>
          <p>
            <strong>We do not knowingly collect personal data directly from a child without verifiable
            parental or guardian consent.</strong> All accounts are created and managed by a parent or
            guardian (the "Account Holder"). If you believe we have inadvertently collected information from
            a child without appropriate consent, please contact us immediately so we can delete it.
          </p>
        </Section>

        <Section title="3. Data We Collect" delay={0.1}>
          <p>We collect data in the following categories:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account data</strong> — name, email address, and password (hashed) of the parent/guardian.</li>
            <li><strong>Child profile data</strong> — child's first name, age range, and skill level, provided by the parent during booking.</li>
            <li><strong>Booking data</strong> — selected sessions, dates, times, course, and optional notes entered by the parent.</li>
            <li><strong>Payment data</strong> — payment is processed by Stripe, Inc. We do not store full card details; we retain only a Stripe customer ID and transaction reference.</li>
            <li><strong>Communications</strong> — emails, contact-form submissions, or WhatsApp messages you send us.</li>
            <li><strong>Usage data</strong> — IP address, browser type, pages visited, session duration, collected via server logs and analytics tools. This data is anonymised or pseudonymised wherever possible.</li>
          </ul>
        </Section>

        <Section title="4. How We Use Your Data" delay={0.12}>
          <p>We process personal data for the following purposes and legal bases under GDPR Art. 6:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Service delivery</strong> (Art. 6(1)(b) — contract) — providing booked sessions, Zoom links, class recordings, and certificates.</li>
            <li><strong>Payment processing</strong> (Art. 6(1)(b) — contract) — processing your payment via Stripe and issuing receipts.</li>
            <li><strong>Legal compliance</strong> (Art. 6(1)(c)) — retaining invoices and payment records for tax and accounting obligations (10-year retention under German law).</li>
            <li><strong>Legitimate interests</strong> (Art. 6(1)(f)) — improving our service, preventing fraud, and maintaining security.</li>
            <li><strong>Consent</strong> (Art. 6(1)(a)) — sending marketing emails (e.g. newsletters, new course announcements). You may withdraw consent at any time.</li>
          </ul>
        </Section>

        <Section title="5. Sharing Your Data" delay={0.14}>
          <p>We do not sell your personal data. We share it only with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Stripe, Inc.</strong> — payment processing (USA, covered by Standard Contractual Clauses).</li>
            <li><strong>Supabase, Inc.</strong> — database and authentication hosting (EU region).</li>
            <li><strong>Zoom Video Communications, Inc.</strong> — live session delivery (USA, covered by Standard Contractual Clauses).</li>
            <li><strong>Email service providers</strong> — transactional emails only.</li>
          </ul>
          <p>
            All sub-processors are contractually required to implement appropriate technical and organisational
            measures to protect your data.
          </p>
        </Section>

        <Section title="6. Session Recordings" delay={0.16}>
          <p>
            Live sessions may be recorded for the sole purpose of providing catch-up access to enrolled
            students who miss a class. Recordings are stored securely and deleted 90 days after the course
            ends. Recordings are never shared publicly or used for marketing without explicit written consent.
          </p>
          <p>
            <strong>Parents are responsible for ensuring their child joins sessions from a private
            environment.</strong> If you do not wish your child's image to appear in recordings, please inform
            us and we can accommodate this request (e.g., camera-off participation).
          </p>
        </Section>

        <Section title="7. Data Retention" delay={0.18}>
          <p>We retain personal data only as long as necessary:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Account and booking data — for the duration of the account, plus 12 months after closure.</li>
            <li>Payment records — 10 years (German tax law obligation).</li>
            <li>Session recordings — 90 days after course end.</li>
            <li>Marketing consent records — until consent is withdrawn.</li>
          </ul>
        </Section>

        <Section title="8. Your Rights" delay={0.2}>
          <p>Under GDPR you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
            <li><strong>Rectification</strong> — correct inaccurate or incomplete data.</li>
            <li><strong>Erasure</strong> ("right to be forgotten") — request deletion of your data where no legal retention obligation applies.</li>
            <li><strong>Restriction</strong> — request we limit processing of your data.</li>
            <li><strong>Portability</strong> — receive your data in a structured, machine-readable format.</li>
            <li><strong>Object</strong> — object to processing based on legitimate interests or for direct marketing.</li>
            <li><strong>Withdraw consent</strong> — at any time, without affecting the lawfulness of prior processing.</li>
          </ul>
          <p>
            To exercise any of these rights, email us at <strong>hello@bugtobyte.com</strong> with the subject
            "Data Rights Request". We will respond within 30 days. You also have the right to lodge a complaint
            with the Berlin Commissioner for Data Protection and Freedom of Information (Berliner
            Beauftragte für Datenschutz und Informationsfreiheit).
          </p>
        </Section>

        <Section title="9. Cookies &amp; Tracking" delay={0.22}>
          <p>
            We use strictly necessary cookies (e.g. authentication session token) and, with your consent,
            analytics cookies to understand how visitors use our site. You can control cookies through your
            browser settings. Rejecting non-essential cookies will not affect your ability to use our service.
          </p>
        </Section>

        <Section title="10. Security" delay={0.24}>
          <p>
            We implement industry-standard security measures including HTTPS encryption in transit, hashed
            passwords, role-based database access controls, and regular security reviews. No system is
            completely secure; in the event of a data breach affecting your rights, we will notify you and
            the competent supervisory authority as required by GDPR.
          </p>
        </Section>

        <Section title="11. Changes to This Policy" delay={0.26}>
          <p>
            We may update this Privacy Policy from time to time. We will notify Account Holders of material
            changes by email at least 14 days before they take effect. Continued use of our services after
            that date constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="12. Contact" delay={0.28}>
          <p>
            For any questions about this policy or your personal data, please contact us:
          </p>
          <div className="rounded-2xl p-5 mt-3"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>BugToByte Academy</p>
            <p>Email: <a href="mailto:hello@bugtobyte.com" className="underline" style={{ color: isDark ? '#FFD60A' : '#B45309' }}>hello@bugtobyte.com</a></p>
            <p>Location: Berlin, Germany</p>
          </div>
        </Section>

      </div>
    </div>
  )
}
