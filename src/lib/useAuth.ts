'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { account } from './appwrite'

interface User {
  $id: string
  name: string
  email: string
  phone: string
  emailVerification: boolean
  prefs: Record<string, string | number | boolean>
}

export function useAuth(redirectTo: string = '/auth') {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await account.get()
        setUser(currentUser as User)
        setLoading(false)
      } catch (error) {
        console.error('Authentication check failed:', error)
        setUser(null)
        setLoading(false)
        router.push(redirectTo)
      }
    }

    checkAuth()
  }, [router, redirectTo])

  return { user, loading }
}
