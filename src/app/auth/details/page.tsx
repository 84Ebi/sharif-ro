'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { account } from '../../../lib/appwrite'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Enter your details to finish sign up</p>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={!!email}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912xxxxxxx"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="studentCode" className="block text-sm font-medium text-gray-700">
              University Student Code
            </label>
            <input
              type="text"
              id="studentCode"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Complete Sign Up'}
          </button>
        </form>
      </div>
    </div>
  )
}