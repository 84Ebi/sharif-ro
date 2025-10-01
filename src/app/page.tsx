'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { account } from '@/lib/appwrite'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get()
        router.push('/role')
      } catch {
        router.push('/auth')
      }
    }
    checkAuth()
  }, [router])

  return <div>Loading...</div>
}