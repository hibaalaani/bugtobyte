import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'

export default function Footer({ setPage }: { setPage: (p: string) => void }) {
  const { tr } = useLanguage()
  const { isDark } = useTheme()

  const go = (p: string) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <footer className="site-footer" style={{ borderTop: '1px solid var(--divider)', background: 'var(--bg-alt)' }}>
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="mb-3" style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 900, fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1 }}>
              <span style={{ color:'var(--text-primary)', WebkitTextStroke:'1.5px #FFD60A', paintOrder:'stroke fill' }}>Bug</span><span style={{ color:'#FFD60A', WebkitTextStroke:`1.5px ${isDark ? '#0A0C1A' : '#1A1F3A'}`, paintOrder:'stroke fill' }}>To</span><span style={{ color:'var(--text-primary)', WebkitTextStroke:'1.5px #00E5FF', paintOrder:'stroke fill' }}>Byte</span>
            </div>
            <p className="text-slate-500 text-[14px] leading-relaxed max-w-xs">{tr.footer.desc}</p>
            <div className="flex gap-3 mt-5">
              <a href="mailto:hello@bugtobyte.com" className="text-slate-500 text-[13px] hover:text-brand-yellow transition-colors">
                hello@bugtobyte.com
              </a>
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-[13px] tracking-widest uppercase text-slate-500 mb-4">{tr.footer.coursesLabel}</div>
            <ul className="space-y-2">
              {['Scratch Explorers (7–9)', 'Python Pioneers (10–12)', 'AI Innovators (13+)'].map(l => (
                <li key={l}>
                  <button onClick={() => { go('home'); setTimeout(() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }), 300) }}
                    className="text-slate-600 text-[14px] hover:text-brand-yellow transition-colors duration-150">{l}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-display font-bold text-[13px] tracking-widest uppercase text-slate-500 mb-4">{tr.footer.companyLabel}</div>
            <ul className="space-y-2">
              {[
                { label: tr.footer.about,   page: 'about',   anchor: undefined },
                { label: tr.footer.contact,  page: 'contact', anchor: undefined },
                { label: tr.footer.pricing,  page: 'home',    anchor: 'pricing' },
                { label: tr.footer.faq,      page: 'home',    anchor: 'faq' },
              ].map(({ label, page, anchor }) => (
                <li key={label}>
                  <button onClick={() => { go(page); if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 300) }}
                    className="text-slate-600 text-[14px] hover:text-brand-yellow transition-colors duration-150">{label}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid var(--divider)' }}>
          <p className="text-slate-600 text-[13px]">© {new Date().getFullYear()} BugToByte Academy. {tr.footer.rights}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => go('terms')} className="text-slate-600 text-[12px] hover:text-brand-yellow transition-colors">Terms & Conditions</button>
            <button onClick={() => go('privacy')} className="text-slate-600 text-[12px] hover:text-brand-yellow transition-colors">{tr.footer.privacy}</button>
            <button onClick={() => go('impressum')} className="text-slate-600 text-[12px] hover:text-brand-yellow transition-colors">{tr.footer.impressum}</button>
            <button onClick={() => setPage('login')} className="text-slate-600 text-[12px] hover:text-slate-500 transition-colors">{tr.footer.staffLogin}</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
