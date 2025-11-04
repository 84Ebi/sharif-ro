'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Hook to force CSS reload on navigation
 * This ensures CSS is refreshed whenever the user navigates to a new page
 */
export function useCSSReload() {
  const pathname = usePathname()

  useEffect(() => {
    // Force CSS reload by manipulating stylesheets
    const reloadStyles = () => {
      try {
        // Get all stylesheet elements
        const stylesheets = document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
        
        stylesheets.forEach((stylesheet) => {
          // Skip external stylesheets (like Google Fonts)
          if (stylesheet.href.startsWith('http')) {
            return
          }
          
          // Force reload by adding timestamp
          const href = stylesheet.href
          const url = new URL(href)
          url.searchParams.set('_reload', Date.now().toString())
          
          // Only update if href has changed
          if (stylesheet.href !== url.href) {
            stylesheet.href = url.href
          }
        })

        // Also handle any inline styles that might be cached
        const styleElements = document.querySelectorAll('style[data-nextjs-css]')
        styleElements.forEach((styleElement) => {
          const newStyle = styleElement.cloneNode(true) as HTMLStyleElement
          styleElement.parentNode?.replaceChild(newStyle, styleElement)
        })
      } catch (error) {
        // Silently handle errors
        console.debug('CSS reload handled', error)
      }
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(reloadStyles, 50)

    return () => clearTimeout(timeoutId)
  }, [pathname])
}


