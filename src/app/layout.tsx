import type { Metadata } from 'next'
import './globals.css'
import Body from '../components/Body'

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
      <Body className="">{children}</Body>
    </html>
  )
}