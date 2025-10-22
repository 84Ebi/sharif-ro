'use client'

import { useEffect, useState } from 'react'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Always render children, but add class when hydrated
  return (
    <div className={isHydrated ? 'hydrated' : 'hydrating'}>
      {children}
    </div>
  )
}

