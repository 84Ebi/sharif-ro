'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { account } from '../../../lib/appwrite'
import '../../../styles/auth.css'

export default function DetailsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [studentCode, setStudentCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Get current user data to pre-fill the form
    const loadUserData = async () => {
      try {
        const user = await account.get()
        setName(user.name || '')
        setEmail(user.email || '')
        setPhone(user.phone || '')
      } catch (err) {
        console.error('Failed to load user data:', err)
      }
    }
    loadUserData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Update user name if provided
      if (name.trim()) {
        await account.updateName(name)
      }
      
      // Update user preferences (store additional data like studentCode)
      await account.updatePrefs({
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
      setLoading(false)
    }
  }

  return (
    <div className="background">
      <div className="login-box">
        <h2>Complete Your Profile</h2>
        <h3>Enter your details to finish sign up</h3>

        {error && <div className="error-message">{error}</div>}

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

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Complete Sign Up'}
          </button>
        </form>
      </div>
    </div>
  )
}