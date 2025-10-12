'use client'

import { useEffect, useState } from 'react'
import { account } from './appwrite'

interface User {
  $id: string
  name: string
  email: string
  phone: string
  emailVerification: boolean
  prefs: Record<string, string | number | boolean>
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await account.get()
        setUser(currentUser as User)
      } catch (error) {
        console.error('Authentication check failed:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { user, loading }
}
