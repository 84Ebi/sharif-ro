'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { account, ID } from '../../lib/appwrite'
import '../../styles/auth.css'

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
      if (isLogin) {
        // Login with email and password
        await account.createEmailPasswordSession(email, password)
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
        await account.createEmailPasswordSession(email, password)
        
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
    <div className="background">
      <div className="login-box">
        <h2>welcome to SharifRo</h2>
        <h3>{isLogin ? 'Login' : 'Register'}</h3>

        {error && <p className="error-message">{error}</p>}
        
        {/* Email/Password Authentication */}
        <form onSubmit={handleCredentialAuth}>
          {!isLogin && (
            <>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
              />
            </>
          )}
          
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
          />
          
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
          </button>
        </form>
        
        {isLogin && (
          <a href="#" className="forgot" onClick={(e) => {
            e.preventDefault()
            alert('Password recovery feature coming soon!')
          }}>
            Forgot Password?
          </a>
        )}
            
        <p className="register">
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
          >
            {isLogin ? 'Register for free' : 'Sign in'}
          </a>
        </p>
      </div>
    </div>
  )
}