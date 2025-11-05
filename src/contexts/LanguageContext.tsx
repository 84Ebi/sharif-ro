'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type Locale = 'fa' | 'en'

type LanguageContextValue = {
  locale: Locale
  toggleLocale: () => void
  setLocale: (value: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const STORAGE_KEY = 'sharifro.locale'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fa')

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? (window.localStorage.getItem(STORAGE_KEY) as Locale | null) : null
      if (stored === 'fa' || stored === 'en') {
        setLocaleState(stored)
      } else {
        setLocaleState('fa')
      }
    } catch {
      setLocaleState('fa')
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const html = document.documentElement
    const isFa = locale === 'fa'
    html.setAttribute('lang', isFa ? 'fa' : 'en')
    html.setAttribute('dir', isFa ? 'rtl' : 'ltr')
    document.body.classList.toggle('rtl', isFa)
    document.body.classList.toggle('ltr', !isFa)
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {}
  }, [locale])

  const setLocale = useCallback((value: Locale) => {
    setLocaleState(value)
  }, [])

  const toggleLocale = useCallback(() => {
    setLocaleState(prev => (prev === 'fa' ? 'en' : 'fa'))
  }, [])

  const value = useMemo(() => ({ locale, toggleLocale, setLocale }), [locale, toggleLocale, setLocale])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}


