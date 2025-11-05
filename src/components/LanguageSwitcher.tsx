'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { locale, toggleLocale } = useLanguage()
  const isFa = locale === 'fa'
  return (
    <button onClick={toggleLocale} aria-label="Switch language">
      {isFa ? 'English' : 'فارسی'}
    </button>
  )
}


