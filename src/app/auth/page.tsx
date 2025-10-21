'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  
  // Email/password states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  
  const [localError, setLocalError] = useState('')
  const [redirectMessage, setRedirectMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading, login, signup } = useAuth()

  // Check for redirect parameter and show message
  useEffect(() => {
    const redirect = searchParams.get('redirect')
    if (redirect) {
      setRedirectMessage('Please login to access that page')
    }
  }, [searchParams])

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      const redirect = searchParams.get('redirect')
      router.push(redirect && redirect.startsWith('/') ? redirect : '/role')
    }
  }, [user, loading, router, searchParams])
  
  const handleCredentialAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    
    try {
      if (isLogin) {
        // Login with email and password
        await login(email, password)
      } else {
        // Register with email and password
        if (password.length < 8) {
          setLocalError('Password must be at least 8 characters')
          return
        }
        
        if (!name.trim()) {
          setLocalError('Name is required')
          return
        }
        
        // Sign up new user
        await signup(email, password, name)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setLocalError(errorMessage)
    }
  }

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-blue-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-blue-900">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white/10 rounded-xl shadow-2xl backdrop-blur-lg">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold">Welcome to SharifRo</h2>
          <h3 className="text-xl">{isLogin ? 'Login' : 'Register'}</h3>
        </div>

        {redirectMessage && (
          <p className="text-yellow-300 text-sm text-center bg-yellow-900/30 py-2 px-3 rounded">
            {redirectMessage}
          </p>
        )}
        {localError && <p className="text-red-400 text-sm text-center">{localError}</p>}
        
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
              setLocalError('')
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