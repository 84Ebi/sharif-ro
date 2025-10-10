'use client'

export default function Body({ children, className }: { children: React.ReactNode, className: string }) {
  return <body className={className} suppressHydrationWarning={true}>{children}</body>
}