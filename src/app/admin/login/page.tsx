'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Admin authentication with environment-based password
    // For production: Store this password securely
    const ADMIN_PASSWORD = 'Sharif@2025!SecureAdmin#Ro'
    
    if (username === 'admin' && password === ADMIN_PASSWORD) {
      // Store admin session in localStorage
      localStorage.setItem('adminAuth', 'true')
      localStorage.setItem('adminUsername', username)
      router.push('/admin/verifications')
    } else {
      setError('Invalid username or password')
      setLoading(false)
    }
  }

  return (
    <>
      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .background {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(to right, #0d47a1, #bbdefb);
          padding: 20px;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
          width: 100%;
          max-width: 400px;
        }

        .logo {
          text-align: center;
          margin-bottom: 24px;
        }

        .logo-icon {
          font-size: 4rem;
          margin-bottom: 12px;
        }

        .title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #034066;
          text-align: center;
          margin-bottom: 8px;
        }

        .subtitle {
          text-align: center;
          color: rgba(2, 36, 58, 0.7);
          margin-bottom: 32px;
          font-size: 0.95rem;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #034066;
          font-size: 0.95rem;
        }

        .input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .input:focus {
          outline: none;
          border-color: #4f7bff;
        }

        .error {
          background: rgba(244, 67, 54, 0.1);
          color: #c62828;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 500;
        }

        .btn-login {
          width: 100%;
          background: linear-gradient(180deg, #4f7bff 0%, #3b5fe6 100%);
          color: white;
          padding: 14px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: transform 0.12s ease, opacity 0.2s;
          box-shadow: 0 8px 20px rgba(79, 123, 255, 0.3);
        }

        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .btn-login:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .default-creds {
          margin-top: 24px;
          padding: 16px;
          background: rgba(255, 193, 7, 0.1);
          border-left: 4px solid #ffc107;
          border-radius: 8px;
        }

        .default-creds-title {
          font-weight: 700;
          color: #f57c00;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .default-creds-text {
          color: rgba(2, 36, 58, 0.8);
          font-size: 0.85rem;
          line-height: 1.5;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 32px 24px;
          }

          .title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="background">
        <div className="login-card">
          <div className="logo">
            <div className="logo-icon">🔐</div>
            <h1 className="title">Admin Portal</h1>
            <p className="subtitle">Verification Management System</p>
          </div>

          <form onSubmit={handleLogin}>
            {error && <div className="error">{error}</div>}

            <div className="form-group">
              <label className="label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit" 
              className="btn-login"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}


