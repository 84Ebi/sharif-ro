'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { account, ID } from '../../lib/appwrite'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  
  // Email/password states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const checkExistingSession = useCallback(async () => {
    try {
      await account.get()
      // If we get here, user is already logged in
      router.push('/role')
    } catch {
      // No active session, user can proceed with login/signup
    }
  }, [router])

  useEffect(() => {
    // Check if user is already logged in
    checkExistingSession()
  }, [checkExistingSession])
  
  const handleCredentialAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Delete any existing sessions
      await account.deleteSessions()

      if (isLogin) {
        // Login with email and password
        const session = await account.createEmailPasswordSession(email, password)
        localStorage.setItem('appwrite_session', JSON.stringify(session))
        router.push('/role')
      } else {
        // Register with email and password
        if (password.length < 8) {
          setError('Password must be at least 8 characters')
          setLoading(false)
          return
        }
        
        if (!name.trim()) {
          setError('Name is required')
          setLoading(false)
          return
        }
        
        // Create new account
        await account.create(
          ID.unique(),
          email,
          password,
          name
        )
        
        // Automatically log in after registration
        const session = await account.createEmailPasswordSession(email, password)
        localStorage.setItem('appwrite_session', JSON.stringify(session))
        
        // Redirect to details page to complete profile
        router.push('/auth/details')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-blue-900">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white/10 rounded-xl shadow-2xl backdrop-blur-lg">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold">Welcome to SharifRo</h2>
          <h3 className="text-xl">{isLogin ? 'Login' : 'Register'}</h3>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        
        <form onSubmit={handleCredentialAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-200">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
                className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-200">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full px-4 py-2 font-bold text-white bg-blue-800 rounded-md hover:bg-blue-700 disabled:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900">
            {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
          </button>
        </form>
        
        {isLogin && (
          <div className="text-center">
            <a href="#" className="text-sm text-gray-300 hover:underline" onClick={(e) => {
              e.preventDefault()
              alert('Password recovery feature coming soon!')
            }}>
              Forgot Password?
            </a>
          </div>
        )}
            
        <p className="text-sm text-center text-gray-300">
          {isLogin ? "Don't have an account yet? " : "Already have an account? "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setIsLogin(!isLogin)
              setEmail('')
              setPassword('')
              setName('')
              setError('')
            }}
            className="font-medium text-white hover:underline"
          >
            {isLogin ? 'Register for free' : 'Sign in'}
          </a>
        </p>
      </div>
    </div>
  )
}