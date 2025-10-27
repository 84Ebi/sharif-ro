'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import styles from './details.module.css'

export default function DetailsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [studentCode, setStudentCode] = useState('')
  const [localLoading, setLocalLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { user, loading, updateName, updatePreferences } = useAuth()

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push('/auth')
      return
    }

    // Pre-fill form with user data
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setPhone(user.prefs?.phone || user.phone || '')
      setStudentCode(user.prefs?.studentCode || '')
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalLoading(true)
    setError('')
    
    try {
      // Update user name if changed
      if (name.trim() && name !== user?.name) {
        await updateName(name)
      }
      
      // Update user preferences
      await updatePreferences({
        studentCode,
        phone,
        profileComplete: true
      })
      
      // Redirect to role selection
      router.push('/role')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update details'
      setError(errorMessage)
    } finally {
      setLocalLoading(false)
    }
  }

  if (loading || !user) {
    return (
      <div className={styles.background}>
        <div className={styles.loginBox}>
          <h2>Loading...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.background}>
      <div className={styles.loginBox}>
        <h2>Complete Your Profile</h2>
        <h3>Enter your details to finish sign up</h3>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled
          />

          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0912xxxxxxx"
            required
          />

          <label htmlFor="studentCode">University Student Code</label>
          <input
            type="text"
            id="studentCode"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            placeholder="Student Code"
            required
          />

          <button type="submit" disabled={localLoading}>
            {localLoading ? 'Processing...' : 'Complete Sign Up'}
          </button>
        </form>
      </div>
    </div>
  )
}