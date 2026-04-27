
const WA_NUMBER = '4917623168309'
const WA_TEXT = encodeURIComponent(
  'مرحباً BugToByte! 👋 رأيت إعلانكم وأريد حجز جلسة تجريبية مجانية لطفلي.'
)
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`

const s: Record<string, React.CSSProperties> = {
  page:        { background: '#080c18', color: '#f1f5f9', fontFamily: '"Cairo", "Segoe UI", Arial, sans-serif', minHeight: '100vh', direction: 'rtl' },
  topBar:      { background: '#0f1629', borderBottom: '1px solid #1e293b', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 },
  logo:        { color: '#fbbf24', fontWeight: 800, fontSize: '1.25rem' },
  waSmall:     { background: '#25d366', color: '#000', padding: '8px 16px', borderRadius: '50px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', whiteSpace: 'nowrap' as const },
  section:     { maxWidth: '680px', margin: '0 auto', padding: '0 20px' },
  hero:        { textAlign: 'center' as const, padding: '56px 20px 40px' },
  heroTag:     { display: 'inline-block', background: '#1e293b', color: '#fbbf24', padding: '6px 16px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '20px' },
  h1:          { fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', fontWeight: 900, lineHeight: 1.3, margin: '0 0 16px 0' },
  sub:         { color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.8, margin: '0 auto 32px', maxWidth: '540px' },
  ctaMain:     { display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#25d366', color: '#000', padding: '16px 32px', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 24px rgba(37,211,102,0.35)' },
  ctaBook:     { display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'transparent', color: '#fbbf24', padding: '14px 28px', borderRadius: '50px', fontSize: '1rem', fontWeight: 700, textDecoration: 'none', border: '2px solid #fbbf24' },
  divider:     { border: 'none', borderTop: '1px solid #1e293b', margin: '0' },
  sectionPad:  { padding: '48px 20px' },
  h2:          { fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', textAlign: 'center' as const },
  h2sub:       { color: '#64748b', textAlign: 'center' as const, marginBottom: '32px', fontSize: '0.95rem' },
  grid3:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px' },
  card:        { background: '#0f1629', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', textAlign: 'center' as const },
  cardIcon:    { fontSize: '2.2rem', marginBottom: '12px' },
  cardTitle:   { fontWeight: 700, marginBottom: '8px', fontSize: '1rem' },
  cardBody:    { color: '#64748b', fontSize: '0.88rem', lineHeight: 1.8 },
  sessionList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '16px' },
  sessionItem: { display: 'flex', gap: '16px', alignItems: 'flex-start', background: '#0f1629', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' },
  sessionEmoji:{ fontSize: '1.8rem', flexShrink: 0 },
  reqBox:      { background: '#0f1629', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px', textAlign: 'center' as const },
  reqItems:    { display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'center', gap: '12px', margin: '16px 0' },
  reqItem:     { background: '#1e293b', borderRadius: '8px', padding: '8px 16px', fontSize: '0.9rem' },
  warn:        { color: '#ef4444', fontSize: '0.85rem', marginTop: '12px' },
  testimonials:{ display: 'flex', flexDirection: 'column' as const, gap: '16px' },
  testimonial: { background: '#0f1629', border: '1px solid #1e293b', borderRadius: '14px', padding: '22px' },
  tStars:      { color: '#fbbf24', fontSize: '1rem', marginBottom: '10px' },
  tText:       { color: '#cbd5e1', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '12px' },
  tAuthor:     { color: '#64748b', fontSize: '0.82rem', fontWeight: 600 },
  finalCta:    { background: 'linear-gradient(135deg, #0f1e3d 0%, #080c18 100%)', borderTop: '1px solid #1e293b', padding: '56px 20px', textAlign: 'center' as const },
  finalH2:     { fontSize: '1.75rem', fontWeight: 900, marginBottom: '12px' },
  finalSub:    { color: '#64748b', marginBottom: '32px' },
  footer:      { background: '#050810', borderTop: '1px solid #1e293b', padding: '24px 20px', textAlign: 'center' as const, color: '#475569', fontSize: '0.82rem' },
}

export default function TrialAr({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div style={s.page}>

      {/* شريط علوي */}
      <nav style={s.topBar}>
        <span style={s.logo}>أكاديمية BugToByte</span>
        <a href={WA_URL} target="_blank" rel="noreferrer" style={s.waSmall}>
          💬 واتساب
        </a>
      </nav>

      {/* البطل */}
      <div style={{ ...s.section, textAlign: 'center' as const }}>
        <div style={s.hero}>
          <span style={s.heroTag}>🎓 تجربة مجانية — بدون بطاقة ائتمان</span>
          <h1 style={s.h1}>
            أول خطوة لطفلك<br />
            في عالم <span style={{ color: '#fbbf24' }}>البرمجة والذكاء الاصطناعي</span><br />
            تبدأ هنا — مجاناً
          </h1>
          <p style={s.sub}>
            جلسة مباشرة مدتها 45 دقيقة للأطفال من عمر 7 إلى 14 سنة.
            سيبنون لعبة حقيقية، يلتقون بمعلمهم، ويحصلون على خارطة طريق شخصية — مجاناً تماماً.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            <a href={WA_URL} target="_blank" rel="noreferrer" style={s.ctaMain}>
              <span>💬</span> احجز مقعدك المجاني عبر واتساب
            </a>
            <button onClick={() => setPage('booking')} style={{ ...s.ctaBook, cursor: 'pointer', background: 'transparent' } as React.CSSProperties}>
              📅 احجز عبر الإنترنت
            </button>
          </div>
        </div>
      </div>

      <hr style={s.divider} />

      {/* ما هي الأكاديمية */}
      <div style={s.sectionPad}>
        <div style={s.section}>
          <h2 style={s.h2}>ما هي أكاديمية BugToByte؟</h2>
          <p style={s.h2sub}>مدرسة برمجة مباشرة عبر الإنترنت للأطفال في ألمانيا والعراق وخارجهما</p>
          <div style={s.grid3}>
            {[
              { icon: '👩‍🏫', title: 'حصص مباشرة فقط', body: 'لا فيديوهات مسجلة. كل جلسة مباشرة مع معلم حقيقي يعرف طفلك.' },
              { icon: '👥', title: 'مجموعات صغيرة جداً', body: 'بحد أقصى 5-6 طلاب لكل مجموعة حتى يحصل كل طفل على اهتمام حقيقي.' },
              { icon: '🚀', title: 'من سكراتش إلى الذكاء الاصطناعي', body: 'ثلاثة مستويات متتالية: سكراتش ← بايثون ← ذكاء اصطناعي. للأعمار 7-14.' },
              { icon: '🌍', title: 'عبر الإنترنت ومرن', body: 'دروس من المنزل، باللغة العربية أو الإنجليزية. بدون تنقل أو ضغط.' },
              { icon: '🎮', title: 'تعلم بالمشاريع', body: 'الأطفال يبنون ألعاباً وتطبيقات ونماذج ذكاء اصطناعي — وليس مجرد نظريات.' },
              { icon: '🏫', title: 'مدرسة مقرها برلين', body: 'أُسِّست في برلين. موثوقة من عائلات في ألمانيا والعراق وأوروبا.' },
            ].map(({ icon, title, body }) => (
              <div key={title} style={s.card}>
                <div style={s.cardIcon}>{icon}</div>
                <div style={s.cardTitle}>{title}</div>
                <div style={s.cardBody}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr style={s.divider} />

      {/* ماذا يحدث في الجلسة */}
      <div style={s.sectionPad}>
        <div style={s.section}>
          <h2 style={s.h2}>ماذا يحدث في الجلسة المجانية 45 دقيقة؟</h2>
          <p style={s.h2sub}>مباشرة وتفاعلية ومصممة لإبهار طفلك</p>
          <ul style={s.sessionList}>
            {[
              { icon: '👋', title: 'لقاء المعلم', body: 'تعارف دافئ، مراجعة سريعة لمستوى طفلك، ووجه ودود سيتطلع إلى رؤيته مجدداً.' },
              { icon: '🎮', title: 'بناء لعبة حقيقية', body: 'سيبرمج طفلك أول شخصية متحركة باستخدام سكراتش — مباشرةً، مع توجيه في كل خطوة.' },
              { icon: '📈', title: 'خارطة طريق شخصية', body: 'بناءً على عمره واهتماماته، سنريك بالضبط كيف يمكنه الانتقال من سكراتش ← بايثون ← ذكاء اصطناعي.' },
              { icon: '🎁', title: '100% مجاني — بدون التزام', body: 'لا بطاقة ائتمان، لا عقود. فقط تجربة أولى رائعة مع عالم البرمجة.' },
            ].map(({ icon, title, body }) => (
              <li key={title} style={s.sessionItem}>
                <span style={s.sessionEmoji}>{icon}</span>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '4px' }}>{title}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.8 }}>{body}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr style={s.divider} />

      {/* المستويات الثلاثة */}
      <div style={s.sectionPad}>
        <div style={s.section}>
          <h2 style={s.h2}>ثلاثة مستويات. رحلة واحدة.</h2>
          <p style={s.h2sub}>يمكن لطفلك البدء من أي مستوى</p>
          <div style={s.grid3}>
            {[
              { icon: '🐱', color: '#4f46e5', title: 'مستكشفو سكراتش', age: 'عمر 7-9 سنوات', body: 'برمجة بالكتل المرئية. يبنون ألعاباً وتحريكات بالسحب والإفلات.' },
              { icon: '🐍', color: '#0ea5e9', title: 'رواد بايثون', age: 'عمر 10-12 سنة', body: 'كود نصي حقيقي. يبنون تطبيقات ويحلون مسائل ويفهمون كيف يعمل البرنامج.' },
              { icon: '🤖', color: '#fbbf24', title: 'مبتكرو الذكاء الاصطناعي', age: 'عمر 13-14 سنة', body: 'تعلم الآلة، نماذج الذكاء الاصطناعي، والمهارات التي ستُحدث فرقاً في المستقبل.' },
            ].map(({ icon, color, title, age, body }) => (
              <div key={title} style={{ ...s.card, borderTop: `3px solid ${color}` }}>
                <div style={s.cardIcon}>{icon}</div>
                <div style={{ ...s.cardTitle, color }}>{title}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>{age}</div>
                <div style={s.cardBody}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr style={s.divider} />

      {/* آراء الآباء */}
      <div style={s.sectionPad}>
        <div style={s.section}>
          <h2 style={s.h2}>ماذا يقول الآباء؟</h2>
          <p style={s.h2sub}>عائلات حقيقية، نتائج حقيقية</p>
          <div style={s.testimonials}>
            {[
              { text: '"ابنتي تتابع دورة سكراتش منذ 3 أسابيع. تعود من المدرسة وتريد فوراً أن تبرمج. المعلمة صبورة وتجعل الأمر ممتعاً جداً!"', author: 'سارة م. — أم، هامبورغ' },
              { text: '"الجلسة المجانية كانت رائعة فعلاً. بنى ابني لعبة صغيرة وكان فخوراً جداً بنفسه. سجّلنا في نفس اليوم."', author: 'أحمد ك. — أب، برلين' },
              { text: '"جربنا مدرسة برمجة أخرى لكنها كانت فيديوهات مسجلة. BugToByte مختلفة — حصة حقيقية مع معلم حقيقي يرد على الأسئلة."', author: 'أم علي — أم، بغداد' },
            ].map(({ text, author }) => (
              <div key={author} style={s.testimonial}>
                <div style={s.tStars}>★★★★★</div>
                <p style={s.tText}>{text}</p>
                <div style={s.tAuthor}>{author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr style={s.divider} />

      {/* المتطلبات */}
      <div style={s.sectionPad}>
        <div style={s.section}>
          <div style={s.reqBox}>
            <h2 style={{ ...s.h2, marginBottom: '4px' }}>ماذا تحتاج؟</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0' }}>فقط بعض الأساسيات وأنت جاهز</p>
            <div style={s.reqItems}>
              <span style={s.reqItem}>💻 لابتوب أو كمبيوتر</span>
              <span style={s.reqItem}>🌐 إنترنت مستقر</span>
              <span style={s.reqItem}>🎧 سماعات (موصى بها)</span>
              <span style={s.reqItem}>😄 طفل فضولي</span>
            </div>
            <p style={s.warn}>⚠️ الأجهزة اللوحية والـ iPad غير متوافقة مع بيئة البرمجة لدينا.</p>
          </div>
        </div>
      </div>

      {/* CTA نهائي */}
      <div style={s.finalCta}>
        <div style={s.section}>
          <h2 style={s.finalH2}>هل أنت مستعد لحجز التجربة المجانية؟</h2>
          <p style={s.finalSub}>30 ثانية فقط. لا دفع مطلوب. فقط اختر موعداً وسنتولى الباقي.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginBottom: '20px' }}>
            <a href={WA_URL} target="_blank" rel="noreferrer" style={{ ...s.ctaMain, fontSize: '1.05rem' }}>
              💬 راسلنا على واتساب الآن
            </a>
            <button onClick={() => setPage('booking')} style={{ ...s.ctaBook, cursor: 'pointer', background: 'transparent' } as React.CSSProperties}>
              📅 احجز موعداً عبر الإنترنت
            </button>
          </div>
          <p style={{ color: '#475569', fontSize: '0.85rem' }}>
            أو راسلنا على البريد الإلكتروني{' '}
            <a href="mailto:hello@bugtobyte.com" style={{ color: '#fbbf24', textDecoration: 'none' }}>
              hello@bugtobyte.com
            </a>
          </p>
        </div>
      </div>

      {/* تذييل */}
      <footer style={s.footer}>
        <p style={{ margin: '0 0 6px' }}>
          © {new Date().getFullYear()} أكاديمية BugToByte · برلين، ألمانيا · hello@bugtobyte.com
        </p>
        <p style={{ margin: 0 }}>
          <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.82rem', textDecoration: 'underline' }}>
            العودة إلى الموقع الرئيسي
          </button>
          {' · '}
          <button onClick={() => setPage('terms')} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.82rem', textDecoration: 'underline' }}>
            الشروط والأحكام
          </button>
        </p>
      </footer>

    </div>
  )
}
