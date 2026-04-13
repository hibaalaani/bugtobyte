import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-6% 0px' })
  return (
    <motion.div ref={ref} initial={{ y: 32, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

const SECTIONS = [
  {
    title: '1. Who We Are',
    body: `BugToByte Academy is an online coding school for children aged 7–14, operated by Hiba Al-Aani, based in Berlin, Germany.

Contact: hello@bugtobyte.com
Website: bugtobyte.com

These Terms and Conditions govern the contractual relationship between BugToByte Academy and the parent or legal guardian ("you") who books a course on behalf of a child.`,
  },
  {
    title: '2. Scope of Services',
    body: `BugToByte Academy provides live, small-group online coding classes for children aged 7–14. Current courses include:

• Scratch Creators (Ages 7–9) — 8 sessions, 45 min each
• AI Fundamentals (Ages 10–12) — 8 sessions, 60 min each
• Python Lab (Ages 13–14) — 10 sessions, 60 min each

Classes are delivered via video conferencing in groups of maximum 5–6 students, taught in English with support available in German and Arabic.`,
  },
  {
    title: '3. Who May Book — Parental Consent',
    body: `Only adults aged 18 or over may enter into a contract with BugToByte Academy. If you are booking on behalf of a child, you confirm that you are the child's parent or legal guardian.

The child is the beneficiary of the service; the parent or guardian is the contracting party and is responsible for all obligations under these Terms, including payment.

Under EU and German law (DSGVO Art. 8), children under 16 may not consent to the processing of their personal data. By booking, you provide consent on behalf of your child for the data processing described in Section 9.`,
  },
  {
    title: '4. Contract Formation',
    body: `A binding contract is formed when you complete the booking process and receive a written order confirmation from BugToByte Academy by email. Please check your spam folder if you do not receive a confirmation within 30 minutes.

You should retain the confirmation email as it contains important information about your right of withdrawal (see Section 6).`,
  },
  {
    title: '5. Fees & Payment',
    body: `All prices are stated in Euro (€) and include applicable VAT where required by law. Full payment is due at the time of booking to secure your child's place.

Current course prices:
• Starter Plan (1 course): €79.99
• Explorer Plan (2 courses): €149.99
• Prodigy Plan (all 3 courses): €239.99

Individual session price: €9.99/session

Payments are processed securely. BugToByte does not store your payment card details on its servers.`,
  },
  {
    title: '6. Right of Withdrawal (Widerrufsrecht)',
    body: `As a consumer in the European Union, you have a statutory right to withdraw from this contract within 14 days without giving any reason.

The withdrawal period begins on the date your booking is confirmed (contract conclusion).

To exercise your right of withdrawal, you must inform BugToByte Academy by an unambiguous written statement (e.g. email) before the 14-day period expires:

  BugToByte Academy
  Email: hello@bugtobyte.com

You may use the model withdrawal form below, but it is not obligatory.

─────────────────────────────────────
MODEL WITHDRAWAL FORM

To: BugToByte Academy, hello@bugtobyte.com

I hereby give notice that I withdraw from my contract for the following service:

Ordered on [date] / Confirmed on [date]:
Name of consumer(s):
Signature (only if submitted on paper):
Date:
─────────────────────────────────────

Effects of withdrawal:
If you withdraw from this contract, we will reimburse all payments received from you, including the costs of delivery (except for any supplementary costs arising if you chose a type of delivery other than the least expensive standard delivery offered by us). We will carry out such reimbursement using the same means of payment as you used for the initial transaction, unless you have expressly agreed otherwise. In any event, you will not incur any fees as a result of such reimbursement. Reimbursement will be made within 14 days of the day on which we receive notification of your withdrawal.

IMPORTANT — If you have requested that the service begin before the end of the withdrawal period:
If you have expressly requested that course sessions begin before the 14-day withdrawal period expires, you acknowledge that you will be required to pay a proportional amount (Wertersatz) for the sessions already delivered up to the point of withdrawal. This will be calculated as: (number of sessions attended ÷ total sessions in the course) × total course price. The remaining balance will be refunded within 14 days.

The right of withdrawal expires before the end of the 14-day period only if the service has been fully performed AND you expressly requested early commencement AND acknowledged the loss of the right of withdrawal at the time of booking.`,
  },
  {
    title: '7. Cancellation by BugToByte',
    body: `If BugToByte Academy cancels a scheduled session, you will be offered either:
(a) a free make-up session scheduled at a mutually agreed time, or
(b) a full pro-rated refund for the cancelled session(s).

If BugToByte is unable to continue delivering a course (e.g. due to force majeure or instructor unavailability), you will receive a full refund for all sessions not yet delivered, within 14 days.`,
  },
  {
    title: '8. Course Conduct & Attendance',
    body: `Students are expected to attend all scheduled sessions. If your child cannot attend due to illness or emergency, please notify us at least 2 hours in advance by email or WhatsApp.

We will make reasonable efforts to offer a make-up session, but this cannot be guaranteed for every absence.

Students must behave respectfully toward instructors and classmates. BugToByte reserves the right to remove a student from a course for persistent disruptive, abusive, or harmful behaviour. In such cases, a pro-rated refund for undelivered sessions will be issued, but no additional compensation will be paid.`,
  },
  {
    title: '9. Data Protection & Children\'s Privacy',
    body: `BugToByte Academy takes the protection of children's personal data extremely seriously and complies with the EU General Data Protection Regulation (DSGVO/GDPR).

What data we collect: First name, family name, email address of the parent/guardian, the child's first name and age group. We do not collect the child's email address, full date of birth, or home address unless strictly necessary.

How we use it: To deliver the service, send booking confirmations and session reminders, and respond to support requests. We do not use personal data for advertising and do not sell or share it with third parties, except processors strictly necessary to deliver the service (video conferencing, payment processing).

Data retention: Personal data is deleted within 2 years of the last active enrolment, unless legal retention obligations apply.

Your rights under GDPR: You have the right to access, correct, delete, restrict processing of, and port your personal data. You may also withdraw consent at any time. To exercise any of these rights, contact hello@bugtobyte.com. You also have the right to lodge a complaint with the Berlin data protection authority (Berliner Beauftragte für Datenschutz und Informationsfreiheit).

Sessions may be recorded for safeguarding and quality assurance purposes only. Recordings are stored securely and never published. Parents may request access to their child's session recordings by emailing hello@bugtobyte.com.`,
  },
  {
    title: '10. Technology Requirements',
    body: `Participation requires: a computer or tablet with a functioning camera and microphone, a stable internet connection, and access to the video conferencing platform specified in the booking confirmation.

BugToByte is not liable for technical difficulties on the student's side. It is the parent's responsibility to ensure the required equipment is available and working before the course begins.`,
  },
  {
    title: '11. Intellectual Property',
    body: `All course materials, lesson plans, code examples, and website content are the intellectual property of BugToByte Academy and protected by copyright. You may not reproduce, distribute, or create derivative works from our materials without prior written permission.

Work and projects created by students during courses remain the property of the student. BugToByte may only use student work for promotional purposes with the explicit written consent of the parent or guardian.`,
  },
  {
    title: '12. Limitation of Liability',
    body: `BugToByte Academy is liable without limitation for damage caused by intent or gross negligence, and for damage resulting from injury to life, body, or health.

For ordinary (slight) negligence, BugToByte is only liable if a material contractual obligation (Kardinalpflicht) has been breached, and in that case liability is limited to the foreseeable, contract-typical damage. BugToByte's total liability to you shall not exceed the total amount you paid for the course(s) in question.

Liability for indirect damage, loss of profit, or consequential loss is excluded to the extent permitted by German law.`,
  },
  {
    title: '13. Changes to These Terms',
    body: `BugToByte reserves the right to update these Terms and Conditions. Changes will be published on this page with an updated date. Registered users will be notified of material changes by email at least 30 days before they take effect. Continued use of our services after changes take effect constitutes acceptance of the revised terms.`,
  },
  {
    title: '14. Governing Law & Dispute Resolution',
    body: `These Terms are governed exclusively by the laws of the Federal Republic of Germany. The UN Convention on Contracts for the International Sale of Goods (CISG) does not apply.

If you are a consumer in the EU, you retain the benefit of any mandatory consumer protection provisions of your country of residence that cannot be excluded by contract.

Online dispute resolution: The European Commission provides an online dispute resolution (ODR) platform for consumers at https://ec.europa.eu/consumers/odr. BugToByte's email address for this purpose is hello@bugtobyte.com. We are not obliged to participate in dispute resolution proceedings before a consumer arbitration board, but we are willing to do so if required.

Place of jurisdiction for merchants (non-consumers): Berlin, Germany.`,
  },
  {
    title: '15. Contact',
    body: `BugToByte Academy
Email: hello@bugtobyte.com
Website: bugtobyte.com
Berlin, Germany

For questions about these Terms, data protection, or to exercise your right of withdrawal, please contact us at hello@bugtobyte.com. We aim to respond within 2 business days.`,
  },
]

export default function TermsPage({ setPage }: { setPage: (p: string) => void }) {
  const { isDark } = useTheme()

  return (
    <div style={{ background: 'var(--bg-main)', color: 'var(--text-primary)', paddingTop: 80, minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ padding: '72px 24px 56px', textAlign: 'center', borderBottom: '1px solid var(--border-color)', background: isDark ? 'linear-gradient(180deg,rgba(255,214,10,0.04) 0%,transparent 100%)' : 'linear-gradient(180deg,rgba(255,214,10,0.06) 0%,transparent 100%)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: isDark ? 'rgba(255,214,10,0.08)' : 'rgba(255,214,10,0.12)', border: '1px solid rgba(255,214,10,0.25)', borderRadius: 6, padding: '6px 16px', marginBottom: 24, fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: isDark ? '#FFD60A' : '#B45309' }}>
              Legal
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem,5vw,3rem)', lineHeight: 1.15, margin: '0 0 16px', color: 'var(--text-primary)' }}>
              Terms & Conditions
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 12px' }}>
              Please read these terms carefully before enrolling in any BugToByte Academy course.
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
              Last updated: March 2025 &nbsp;·&nbsp; Effective date: March 2025 &nbsp;·&nbsp; Governed by German law
            </p>
          </Reveal>
        </div>
      </section>

      {/* Content */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: '56px 24px 96px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {SECTIONS.map((s, i) => (
            <Reveal key={i} delay={Math.min(i * 0.03, 0.2)}>
              <div style={{ padding: '28px 32px', borderRadius: 16, background: 'var(--bg-card)', border: s.title.includes('Withdrawal') ? `1px solid ${isDark ? 'rgba(255,214,10,0.30)' : 'rgba(255,180,0,0.35)'}` : '1px solid var(--border-color)' }}>
                <h2 style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700, fontSize: 17, margin: '0 0 14px', color: 'var(--text-primary)' }}>
                  {s.title}
                </h2>
                {s.title.includes('Withdrawal') && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: isDark ? 'rgba(255,214,10,0.10)' : 'rgba(255,214,10,0.14)', border: '1px solid rgba(255,214,10,0.28)', borderRadius: 6, padding: '4px 12px', marginBottom: 14, fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase' as const, color: isDark ? '#FFD60A' : '#92400E', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                    ⚖ Required by EU / German law
                  </div>
                )}
                <div style={{ fontSize: 14.5, lineHeight: 1.85, color: 'var(--text-secondary)', whiteSpace: 'pre-line' as const }}>
                  {s.body}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ODR notice */}
        <Reveal delay={0.1}>
          <div style={{ marginTop: 40, padding: '20px 28px', borderRadius: 12, background: isDark ? 'rgba(78,205,196,0.07)' : 'rgba(8,145,178,0.06)', border: '1px solid rgba(78,205,196,0.20)', fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text-primary)' }}>EU Online Dispute Resolution:</strong> The European Commission provides an ODR platform at{' '}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: isDark ? '#4ECDC4' : '#0891B2', textDecoration: 'underline' }}>
              ec.europa.eu/consumers/odr
            </a>. Our contact email for ODR purposes is <strong>hello@bugtobyte.com</strong>.
          </div>
        </Reveal>

        {/* Back */}
        <Reveal delay={0.05}>
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <button
              onClick={() => setPage('home')}
              style={{ fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 600, fontSize: 15, color: isDark ? '#FFD60A' : '#B45309', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}
            >
              ← Back to Home
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
