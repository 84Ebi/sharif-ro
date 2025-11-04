'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('adminAuth') === 'true'
    
    if (isAdminLoggedIn) {
      router.push('/admin/verifications')
    } else {
      router.push('/admin/login')
    }
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to right, #0d47a1, #bbdefb)'
    }}>
      <div style={{ color: 'white', fontSize: '1.2rem' }}>
        Redirecting...
      </div>
    </div>
  )
}

