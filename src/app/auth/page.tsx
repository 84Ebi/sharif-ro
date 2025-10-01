'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { account } from '../../lib/appwrite'
import { localDb, authUtils } from '../../lib/localDb'
import '../../styles/auth.css'

type AuthMethod = 'phone' | 'credentials';
type PhoneStep = 'phone' | 'otp';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [authMethod, setAuthMethod] = useState<AuthMethod>('credentials')
  
  // Phone auth states
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('phone')
  
  // Username/password states
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Generate 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Format mobile number (remove leading 0 and add country code)
      const formattedMobile = phone.startsWith('0') ? '98' + phone.slice(1) : phone
      
      // Send OTP via SMS.ir API
      const response = await fetch('https://api.sms.ir/v1/send/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/plain',
          'x-api-key': 'BDTs7SBkEK24HaVfTOBPczODgXHNVVePmr9UHWf2sdeM3bWe'
        },
        body: JSON.stringify({
          mobile: formattedMobile,
          templateId: 117259,
          parameters: [
            {
              name: 'Code',
              value: generatedOtp
            }
          ]
        })
      })
      
      const result = await response.json()
      
      if (result.status === 1) {
        // Store OTP in sessionStorage for verification
        sessionStorage.setItem('otp', generatedOtp)
        sessionStorage.setItem('otpPhone', phone)
        setPhoneStep('otp')
      } else {
        setError('Failed to send OTP: ' + (result.message || 'Unknown error'))
      }
    } catch (err: any) {
      setError('Failed to send OTP: ' + (err.message || 'Network error'))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const storedOtp = sessionStorage.getItem('otp')
      const storedPhone = sessionStorage.getItem('otpPhone')
      
      if (!storedOtp || !storedPhone) {
        setError('OTP session expired. Please request a new OTP.')
        setPhoneStep('phone')
        setLoading(false)
        return
      }
      
      if (storedPhone !== phone) {
        setError('Phone number mismatch. Please request a new OTP.')
        setPhoneStep('phone')
        setLoading(false)
        return
      }
      
      if (otp === storedOtp) {
        // Clear stored OTP
        sessionStorage.removeItem('otp')
        sessionStorage.removeItem('otpPhone')
        
        // Store phone for registration if needed
        if (!isLogin) {
          sessionStorage.setItem('verifiedPhone', phone)
        }
        
        // Proceed to next step
        if (isLogin) {
          router.push('/role')
        } else {
          router.push('/auth/details')
        }
      } else {
        setError('Invalid OTP. Please try again.')
      }
    } catch (err: any) {
      setError('Verification failed: ' + (err.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }
  
  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      if (isLogin) {
        // Login with credentials
        const user = localDb.verifyCredentials(username, password)
        if (user) {
          // Remove password from stored user data
          const { password: _, ...safeUserData } = user
          authUtils.setCurrentUser(safeUserData)
          router.push('/role')
        } else {
          setError('Invalid username or password')
        }
      } else {
        // Register with credentials - will be completed in details page
        if (password.length < 6) {
          setError('Password must be at least 6 characters')
          setLoading(false)
          return
        }
        
        // Store in session for completion in details page
        sessionStorage.setItem('tempRegister', JSON.stringify({ username, password }))
        router.push('/auth/details')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="background">
      <div className="login-box">
        <h2>welcome to SharifRo</h2>
        <h3>{isLogin ? 'Login' : 'Register'}</h3>
        
        {/* Auth Method Selector Buttons - Moved outside forms */}
        <div className="auth-method-selector">
          <button 
            type="button" 
            onClick={(e) => {
              e.preventDefault()
              setAuthMethod('credentials')
            }}
            className={authMethod === 'credentials' ? 'active' : ''}
          >
            Username/Password
          </button>
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault()
              setAuthMethod('phone')
            }}
            className={authMethod === 'phone' ? 'active' : ''}
          >
            Phone
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
        
        {authMethod === 'phone' ? (
          // Phone Authentication
          phoneStep === 'phone' ? (
            <form onSubmit={handleSendOtp}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912xxxxxxx"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <label htmlFor="otp">OTP Code</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
              
              <button type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              
              <button 
                type="button" 
                className="back-button" 
                onClick={() => setPhoneStep('phone')}
              >
                Back
              </button>
            </form>
          )
        ) : (
          // Credentials Authentication
          <form onSubmit={handleCredentialLogin}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
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
              {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Continue'}
            </button>
          </form>
        )}
        {isLogin && <a href="#" className="forgot">Forgot Password?</a>}
            
        <p className="register">
          {isLogin ? "Don't have an account yet? " : "Already have an account? "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setIsLogin(!isLogin)
              setPhoneStep('phone')
              setPhone('')
              setOtp('')
              setUsername('')
              setPassword('')
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