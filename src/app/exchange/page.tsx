'use client'

import { Suspense } from 'react'
import ExchangeContent from '@/components/ExchangeContent'

export default function ExchangePage() {
  return (
    <Suspense>
      <ExchangeContent />
    </Suspense>
  )
}
