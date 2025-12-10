'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function IOSInstallPrompt({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip if already on install page or auth page
    if (pathname?.includes('/ios-install') || pathname?.includes('/auth')) {
      return
    }

    // Check if device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream
    
    if (!isIOSDevice) {
      return
    }

    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as Navigator & { standalone?: boolean }).standalone === true

    // Check if user has dismissed the prompt before
    const hasSeenPrompt = localStorage.getItem('ios-install-prompt-seen')

    // Only redirect if iOS, NOT standalone, and hasn't seen prompt
    if (isIOSDevice && !isStandalone && !hasSeenPrompt) {
      // Mark as seen
      localStorage.setItem('ios-install-prompt-seen', 'true')
      // Redirect to install guide
      router.push('/ios-install')
    }
  }, [router, pathname])

  return <>{children}</>
}
