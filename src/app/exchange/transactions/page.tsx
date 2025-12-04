'use client'

import { Suspense } from 'react'
import ExchangeContent from '@/components/ExchangeContent'

export default function ExchangeTransactionsPage() {
  return (
    <Suspense>
      <ExchangeContent initialTab="history" />
    </Suspense>
  )
}
