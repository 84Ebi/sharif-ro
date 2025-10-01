'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { account } from '../../../lib/appwrite'
import { localDb, authUtils } from '../../../lib/localDb'

export default function DetailsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [studentCode, setStudentCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tempCredentials, setTempCredentials] = useState<{username: string, password: string} | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if we have temp registration data
    if (typeof window !== 'undefined') {
      const tempRegisterData = sessionStorage.getItem('tempRegister')
      if (tempRegisterData) {
        try {
          const parsedData = JSON.parse(tempRegisterData)
          setTempCredentials(parsedData)
        } catch (e) {
          console.error('Failed to parse temp registration data')
        }
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // If we have temp credentials, register the user with the local DB
      if (tempCredentials) {
        const { username, password } = tempCredentials
        
        // Check if username already exists
        const existingUser = localDb.findUserByUsername(username)
        if (existingUser) {
          setError('Username already taken')
          setLoading(false)
          return
        }
        
        // Create the new user
        const newUser = localDb.createUser({
          username,
          password,
          name,
          email,
          studentCode
        })
        
        // Remove password from stored user data
        const { password: _, ...safeUserData } = newUser
        authUtils.setCurrentUser(safeUserData)
        
        // Clear temp data
        sessionStorage.removeItem('tempRegister')
      }
      
      // For all registrations, redirect to role selection
      router.push('/role')
    } catch (err: any) {
      setError(err.message || 'Failed to update details')
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