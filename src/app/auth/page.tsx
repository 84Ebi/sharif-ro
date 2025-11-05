'use client'

import { useState, useEffect, Suspense } from 'react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/lib/i18n'

function AuthPageContent() {
  const [isLogin, setIsLogin] = useState(true)
  const { t } = useI18n()
  
  // Email/password states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [studentCode, setStudentCode] = useState('')
  
  const [localError, setLocalError] = useState('')
  const [redirectMessage, setRedirectMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading, login, signup, updatePreferences } = useAuth()

  // Check for redirect parameter and show message
  useEffect(() => {
    const redirect = searchParams.get('redirect')
    if (redirect) {
      setRedirectMessage(t('auth.redirect'))
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
        console.log('Attempting login...');
        await login(email, password)
        console.log('Login successful');
      } else {
        // Register with email and password
        if (password.length < 8) {
          setLocalError(t('auth.password_min'))
          return
        }
        
        if (!name.trim()) {
          setLocalError(t('auth.name_required'))
          return
        }
        
        // Sign up new user
        console.log('Attempting signup...');
        await signup(email, password, name)
        // Save additional info
        await updatePreferences({ phone, studentCode })
        console.log('Signup successful');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      console.error('Auth error:', err);
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 relative">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-sm p-8 space-y-6 bg-white/10 rounded-xl shadow-2xl backdrop-blur-lg">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold">{t('auth.welcome')}</h2>
          <h3 className="text-xl">{isLogin ? t('auth.login') : t('auth.register')}</h3>
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
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-200">{t('auth.name')}</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('auth.placeholder.name')}
                required
                className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {!isLogin && (
            <div>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-200">{t('auth.phone')}</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('auth.placeholder.phone')}
                required
                className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {!isLogin && (
            <div>
              <label htmlFor="studentCode" className="block mb-2 text-sm font-medium text-gray-200">{t('auth.student_code')}</label>
              <input
                type="text"
                id="studentCode"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                placeholder={t('auth.placeholder.student_code')}
                required
                className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200">{t('auth.email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.placeholder.email')}
              required
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-200">{t('auth.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.placeholder.password')}
              required
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full px-4 py-2 font-bold text-white bg-blue-800 rounded-md hover:bg-blue-700 disabled:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900">
            {loading ? t('auth.processing') : isLogin ? t('auth.signin') : t('auth.signup')}
          </button>
        </form>
        
            
        <p className="text-sm text-center text-gray-300">
          {isLogin ? t('auth.have_no_account') : t('auth.have_account')}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setIsLogin(!isLogin)
              setEmail('')
              setPassword('')
              setName('')
              setLocalError('')
              setPhone('')
              setStudentCode('')
            }}
            className="font-medium text-white hover:underline"
          >
            {isLogin ? t('auth.register_free') : t('auth.signin_link')}
          </a>
        </p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-blue-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  )
}