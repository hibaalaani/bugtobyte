import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Lang } from '@/i18n/translations'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'ar', label: 'AR' },
]

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  const { isDark } = useTheme()

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 2, padding: '3px',
      borderRadius: 8,
      background: 'var(--bg-input)',
      border: '1px solid var(--border-color)',
    }}>
      {LANGS.map(({ code, label }) => {
        const active = lang === code
        return (
          <button
            key={code}
            onClick={() => setLang(code)}
            title={code === 'en' ? 'English' : code === 'de' ? 'Deutsch' : 'العربية'}
            style={{
              padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
              fontFamily: 'IBM Plex Sans, sans-serif', fontWeight: 700, fontSize: 11,
              letterSpacing: '0.05em',
              background: active ? (isDark ? 'rgba(255,214,10,0.15)' : 'rgba(232,150,10,0.13)') : 'transparent',
              color: active ? (isDark ? '#FFD60A' : '#B45309') : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
