import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { TR, Lang } from '@/i18n/translations'

interface LangCtx {
  lang:    Lang
  setLang: (l: Lang) => void
  tr:      typeof TR['en']
  isRTL:   boolean
}

const LangContext = createContext<LangCtx>({
  lang: 'en', setLang: () => {}, tr: TR.en, isRTL: false,
})

// Map browser language codes → app language
function detectBrowserLang(): Lang | null {
  const bl = navigator.language?.toLowerCase() ?? ''
  if (bl.startsWith('de')) return 'de'
  if (bl.startsWith('ar')) return 'ar'
  return null
}

// Arabic-speaking countries (ISO 3166-1 alpha-2)
const ARABIC_COUNTRIES = new Set([
  'IQ','SA','EG','SY','JO','LB','KW','AE','QA','BH','OM','YE','LY','TN','MA','DZ','SD','PS','MR','SO','DJ','KM',
])

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    // 1. Respect explicit user choice stored in localStorage
    const saved = localStorage.getItem('btb-lang')
    if (saved === 'de' || saved === 'ar' || saved === 'en') return saved as Lang

    // 2. Use browser/OS language as instant fallback
    return detectBrowserLang() ?? 'en'
  })

  useEffect(() => {
    // 3. IP geolocation — only runs once if user never manually picked a language
    if (localStorage.getItem('btb-lang')) return          // user already chose — don't override
    if (localStorage.getItem('btb-geo-checked')) return   // already ran geolocation this session

    localStorage.setItem('btb-geo-checked', '1')

    fetch('https://ip-api.com/json/?fields=countryCode')
      .then(r => r.json())
      .then(({ countryCode }: { countryCode: string }) => {
        const code = countryCode?.toUpperCase()
        let detected: Lang = 'en'
        if (code === 'DE' || code === 'AT' || code === 'CH') detected = 'de'
        else if (ARABIC_COUNTRIES.has(code)) detected = 'ar'

        if (detected !== 'en') {
          // Only switch away from English if we got a confident match
          setLangState(detected)
        }
      })
      .catch(() => {/* silently ignore — stay with browser-detected lang */})
  }, [])


  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('btb-lang', l)
  }

  useEffect(() => {
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang

    // Load Cairo font for Arabic
    const existingLink = document.getElementById('arabic-font')
    if (lang === 'ar') {
      if (!existingLink) {
        const link = document.createElement('link')
        link.id   = 'arabic-font'
        link.rel  = 'stylesheet'
        link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap'
        document.head.appendChild(link)
      }
    }
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, setLang, tr: TR[lang] as typeof TR['en'], isRTL: lang === 'ar' }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLanguage = () => useContext(LangContext)
