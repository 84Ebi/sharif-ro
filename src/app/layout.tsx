import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import ClientWrapper from './ClientWrapper'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import NotificationContainer from '@/components/Notification'
import IOSInstallPrompt from '@/components/IOSInstallPrompt'

export const metadata: Metadata = {
  title: 'SharifRo - Food Hall Delivery',
  description: 'Order food from university food hall',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SharifRo',
  },
  icons: {
    apple: '/icons/icon-512.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SharifRo" />
        <link rel="apple-touch-icon" href="/icons/icon-512.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap"
        />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <NotificationProvider>
            <AuthProvider>
              <IOSInstallPrompt>
                <ClientWrapper>
                  {children}
                </ClientWrapper>
              </IOSInstallPrompt>
            </AuthProvider>
            <NotificationContainer />
          </NotificationProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}