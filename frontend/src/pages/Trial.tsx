
// ─── REPLACE THIS WITH YOUR REAL WHATSAPP NUMBER (digits only, no + or spaces) ───
const WA_NUMBER = '004917623168309'   // e.g. 4915712345678
// ─────────────────────────────────────────────────────────────────────────────────

const WA_TEXT = encodeURIComponent(
  'Hi BugToByte! 👋 I saw your ad and I want to book a FREE trial session for my child.'
)
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`

const styles: Record<string, React.CSSProperties> = {
  page:       { background: '#080c18', color: '#f1f5f9', fontFamily: '"Inter", "Segoe UI", Arial, sans-serif', minHeight: '100vh' },
  topBar:     { background: '#0f1629', borderBottom: '1px solid #1e293b', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 },
  logo:       { color: '#fbbf24', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' },
  waSmall:    { background: '#25d366', color: '#000', padding: '8px 16px', borderRadius: '50px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', whiteSpace: 'nowrap' as const },
  section:    { maxWidth: '680px', margin: '0 auto', padding: '0 20px' },
  hero:       { textAlign: 'center' as const, padding: '56px 20px 40px' },
  heroTag:    { display: 'inline-block', background: '#1e293b', color: '#fbbf24', padding: '6px 16px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: '20px' },
  h1:         { fontSize: 'clamp(2rem, 7vw, 3rem)', fontWeight: 900, lineHeight: 1.15, margin: '0 0 16px 0' },
  sub:        { color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.65, margin: '0 auto 32px', maxWidth: '540px' },
  ctaMain:    { display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#25d366', color: '#000', padding: '16px 32px', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 24px rgba(37,211,102,0.35)' },
  ctaBook:    { display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'transparent', color: '#fbbf24', padding: '14px 28px', borderRadius: '50px', fontSize: '1rem', fontWeight: 700, textDecoration: 'none', border: '2px solid #fbbf24', marginLeft: '12px' },
  divider:    { border: 'none', borderTop: '1px solid #1e293b', margin: '0' },
  sectionPad: { padding: '48px 20px' },
  h2:         { fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', textAlign: 'center' as const },
  h2sub:      { color: '#64748b', textAlign: 'center' as const, marginBottom: '32px', fontSize: '0.95rem' },
  grid3:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px' },
  card:       { background: '#0f1629', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', textAlign: 'center' as const },
  cardIcon:   { fontSize: '2.2rem', marginBottom: '12px' },
  cardTitle:  { fontWeight: 700, marginBottom: '8px', fontSize: '1rem' },
  cardBody:   { color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6 },
  sessionList:{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '16px' },
  sessionItem:{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#0f1629', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' },
  sessionEmoji:{ fontSize: '1.8rem', flexShrink: 0 },
  reqBox:     { background: '#0f1629', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px', textAlign: 'center' as const },
  reqItems:   { display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'center', gap: '12px', margin: '16px 0' },
  reqItem:    { background: '#1e293b', borderRadius: '8px', padding: '8px 16px', fontSize: '0.9rem' },
  warn:       { color: '#ef4444', fontSize: '0.85rem', marginTop: '12px' },
  testimonials:{ display: 'flex', flexDirection: 'column' as const, gap: '16px' },
  testimonial:{ background: '#0f1629', border: '1px solid #1e293b', borderRadius: '14px', padding: '22px' },
  tStars:     { color: '#fbbf24', fontSize: '1rem', marginBottom: '10px' },
  tText:      { color: '#cbd5e1', lineHeight: 1.65, fontSize: '0.95rem', marginBottom: '12px' },
  tAuthor:    { color: '#64748b', fontSize: '0.82rem', fontWeight: 600 },
  finalCta:   { background: 'linear-gradient(135deg, #0f1e3d 0%, #080c18 100%)', borderTop: '1px solid #1e293b', padding: '56px 20px', textAlign: 'center' as const },
  finalH2:    { fontSize: '1.75rem', fontWeight: 900, marginBottom: '12px' },
  finalSub:   { color: '#64748b', marginBottom: '32px' },
  footer:     { background: '#050810', borderTop: '1px solid #1e293b', padding: '24px 20px', textAlign: 'center' as const, color: '#475569', fontSize: '0.82rem' },
}

export default function Trial({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div style={styles.page}>

      {/* Sticky top bar */}
      <nav style={styles.topBar}>
        <span style={styles.logo}>BugToByte Academy</span>
        <a href={WA_URL} target="_blank" rel="noreferrer" style={styles.waSmall}>
          💬 WhatsApp Us
        </a>
      </nav>

      {/* Hero */}
      <div style={{ ...styles.section, ...{ textAlign: 'center' as const } }}>
        <div style={styles.hero}>
          <span style={styles.heroTag}>🎓 Free Trial — No Credit Card Needed</span>
          <h1 style={styles.h1}>
            Your Child's First Step<br />
            into <span style={{ color: '#fbbf24' }}>Coding & AI</span><br />
            Starts Here — For Free
          </h1>
          <p style={styles.sub}>
            A live, 45-minute online session for kids aged 7–14. They'll build a real game,
            meet their teacher, and get a personalised roadmap — completely free.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            <a href={WA_URL} target="_blank" rel="noreferrer" style={styles.ctaMain}>
              <span>💬</span> Claim Free Seat on WhatsApp
            </a>
            <button onClick={() => setPage('booking')} style={{ ...styles.ctaBook, cursor: 'pointer', background: 'transparent' } as React.CSSProperties}>
              📅 Book Online
            </button>
          </div>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* What is BugToByte */}
      <div style={{ ...styles.sectionPad }}>
        <div style={styles.section}>
          <h2 style={styles.h2}>What is BugToByte Academy?</h2>
          <p style={styles.h2sub}>A live online coding school built for kids in Germany and beyond</p>
          <div style={styles.grid3}>
            {[
              { icon: '👩‍🏫', title: 'Live Classes Only', body: 'No pre-recorded videos. Every session is live with a real teacher who knows your child.' },
              { icon: '👥', title: 'Tiny Class Sizes', body: 'Max 5–6 students per group so every child gets real attention and feedback.' },
              { icon: '🚀', title: 'From Scratch to AI', body: 'Three progressive courses: Scratch → Python → AI. Built for ages 7 to 14.' },
              { icon: '🌍', title: 'Online & Flexible', body: 'Classes from home, in English or German. No commute, no stress.' },
              { icon: '🎮', title: 'Project-Based', body: 'Kids build real games, apps, and AI models — not just theory.' },
              { icon: '🏫', title: 'Berlin-Based School', body: 'Founded in Berlin. Trusted by families across Germany and Europe.' },
            ].map(({ icon, title, body }) => (
              <div key={title} style={styles.card}>
                <div style={styles.cardIcon}>{icon}</div>
                <div style={styles.cardTitle}>{title}</div>
                <div style={styles.cardBody}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* What happens in the free session */}
      <div style={styles.sectionPad}>
        <div style={styles.section}>
          <h2 style={styles.h2}>What Happens in the Free 45-Minute Session?</h2>
          <p style={styles.h2sub}>Live, interactive, and designed to wow your child</p>
          <ul style={styles.sessionList}>
            {[
              { icon: '👋', title: 'Meet the Teacher', body: 'A warm intro, a quick check of your child\'s level, and a friendly face they\'ll look forward to seeing.' },
              { icon: '🎮', title: 'Build a Real Game', body: 'Your child will code their first moving character using Scratch — live, with guidance every step of the way.' },
              { icon: '📈', title: 'Get a Personal Roadmap', body: 'Based on their age and interests, we\'ll show you exactly how they can go from Scratch → Python → AI.' },
              { icon: '🎁', title: '100% Free — No Obligation', body: 'No credit card, no contracts. Just a great first experience with coding.' },
            ].map(({ icon, title, body }) => (
              <li key={title} style={styles.sessionItem}>
                <span style={styles.sessionEmoji}>{icon}</span>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '4px' }}>{title}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6 }}>{body}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* Our 3 Courses */}
      <div style={styles.sectionPad}>
        <div style={styles.section}>
          <h2 style={styles.h2}>Three Courses. One Journey.</h2>
          <p style={styles.h2sub}>Your child can start at any level</p>
          <div style={styles.grid3}>
            {[
              { icon: '🐱', color: '#4f46e5', title: 'Scratch Explorers', age: 'Ages 7–9', body: 'Block-based coding. Kids build games and animations with drag-and-drop blocks.' },
              { icon: '🐍', color: '#0ea5e9', title: 'Python Pioneers', age: 'Ages 10–12', body: 'Real text-based code. Build apps, solve puzzles, and understand how software works.' },
              { icon: '🤖', color: '#fbbf24', title: 'AI Innovators', age: 'Ages 13–14', body: 'Machine learning, AI models, and the skills that will matter in the future.' },
            ].map(({ icon, color, title, age, body }) => (
              <div key={title} style={{ ...styles.card, borderTop: `3px solid ${color}` }}>
                <div style={styles.cardIcon}>{icon}</div>
                <div style={{ ...styles.cardTitle, color }}>{title}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>{age}</div>
                <div style={styles.cardBody}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* Testimonials */}
      <div style={styles.sectionPad}>
        <div style={styles.section}>
          <h2 style={styles.h2}>What Parents Are Saying</h2>
          <p style={styles.h2sub}>Real families, real results</p>
          <div style={styles.testimonials}>
            {[
              { text: '"My daughter has been doing the Scratch course for 3 weeks now. She comes home from school and immediately wants to code. The teacher is patient and makes it fun!"', author: 'Sarah M. — Parent, Hamburg' },
              { text: '"The free trial was genuinely impressive. My son built a little game and was so proud. We signed up the same day."', author: 'Ahmed K. — Parent, Berlin' },
              { text: '"We tried another coding school but it was pre-recorded videos. BugToByte is different — it\'s a real class with a real teacher who responds to questions."', author: 'Lena B. — Parent, Munich' },
            ].map(({ text, author }) => (
              <div key={author} style={styles.testimonial}>
                <div style={styles.tStars}>★★★★★</div>
                <p style={styles.tText}>{text}</p>
                <div style={styles.tAuthor}>{author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* Requirements */}
      <div style={styles.sectionPad}>
        <div style={styles.section}>
          <div style={styles.reqBox}>
            <h2 style={{ ...styles.h2, marginBottom: '4px' }}>What Do You Need?</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0' }}>Just a few basics and you're ready to go</p>
            <div style={styles.reqItems}>
              <span style={styles.reqItem}>💻 Laptop or PC</span>
              <span style={styles.reqItem}>🌐 Stable Internet</span>
              <span style={styles.reqItem}>🎧 Headphones (recommended)</span>
              <span style={styles.reqItem}>😄 A curious child</span>
            </div>
            <p style={styles.warn}>⚠️ iPads and tablets are not compatible for our coding environment.</p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div style={styles.finalCta}>
        <div style={styles.section}>
          <h2 style={styles.finalH2}>Ready to Book the Free Trial?</h2>
          <p style={styles.finalSub}>Takes 30 seconds. No payment needed. Just pick a time and we'll handle the rest.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginBottom: '20px' }}>
            <a href={WA_URL} target="_blank" rel="noreferrer" style={{ ...styles.ctaMain, fontSize: '1.05rem' }}>
              💬 WhatsApp Us Now
            </a>
            <button onClick={() => setPage('booking')} style={{ ...styles.ctaBook, cursor: 'pointer', background: 'transparent' } as React.CSSProperties}>
              📅 Book a Slot Online
            </button>
          </div>
          <p style={{ color: '#475569', fontSize: '0.85rem' }}>
            Or email us at{' '}
            <a href="mailto:hello@bugtobyte.com" style={{ color: '#fbbf24', textDecoration: 'none' }}>
              hello@bugtobyte.com
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={{ margin: '0 0 6px' }}>
          © {new Date().getFullYear()} BugToByte Academy · Berlin, Germany · hello@bugtobyte.com
        </p>
        <p style={{ margin: 0 }}>
          <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.82rem', textDecoration: 'underline' }}>
            Back to main site
          </button>
          {' · '}
          <button onClick={() => setPage('terms')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.82rem', textDecoration: 'underline' }}>
            Terms & Conditions
          </button>
        </p>
      </footer>

    </div>
  )
}
