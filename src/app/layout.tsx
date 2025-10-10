import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Body from '../components/Body'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Food Hall Delivery',
  description: 'Order food from university food hall',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Body className={inter.className}>{children}</Body>
    </html>
  )
}