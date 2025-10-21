'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import BottomDock from '../../components/BottomDock'
import '../../styles/account-profile.css'

export default function AccountPage() {
  const { user, loading: authLoading, updateName, updatePreferences, logout } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [studentCode, setStudentCode] = useState('')
  const [credit, setCredit] = useState(0)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState<'customer' | 'delivery'>('customer')
  const [editMode, setEditMode] = useState({
    name: false,
    studentCode: false,
    phone: false,
  })
  const router = useRouter()

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push('/auth')
      return
    }

    // Load user data
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setStudentCode(user.prefs?.studentCode || '')
      setCredit(user.prefs?.credit || 0)
      setPhone(user.prefs?.phone || user.phone || '')
    }

    // Load role from localStorage
    const storedRole = localStorage.getItem('userRole') as 'customer' | 'delivery'
    if (storedRole) setRole(storedRole)
  }, [user, authLoading, router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Update name if changed
      if (name.trim() && name !== user?.name) {
        await updateName(name)
      }
      
      // Update preferences
      await updatePreferences({
        studentCode,
        credit,
        phone
      })
      
      alert('Profile updated successfully')
      setEditMode({ name: false, studentCode: false, phone: false })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="background">
      <main className="profile-container">
        <h1>Account</h1>
        
        {error && <p className="error-message" style={{color: '#ff6b6b', marginBottom: '15px'}}>{error}</p>}
        
        <div className="profile-section">
          <div className="info-group">
            <label>Name</label>
            {editMode.name ? (
              <input
                type="text"
                className="info-input"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            ) : (
              <div className="info-value">{name}</div>
            )}
            <button 
              className="edit-btn"
              onClick={() => {
                if (editMode.name) {
                  const form = document.createElement('form');
                  const event = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent;
                  Object.defineProperty(event, 'target', { value: form, writable: false });
                  handleUpdate(event);
                }
                setEditMode(prev => ({ ...prev, name: !prev.name }))
              }}
              disabled={loading}
            >
              {editMode.name ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="info-group">
            <label>Email</label>
            <div className="info-value">{email}</div>
            <button className="edit-btn" disabled style={{opacity: 0.5, cursor: 'not-allowed'}}>
              Locked
            </button>
          </div>

          <div className="info-group">
            <label>University Student Code</label>
            {editMode.studentCode ? (
              <input
                type="text"
                className="info-input"
                value={studentCode}
                onChange={e => setStudentCode(e.target.value)}
              />
            ) : (
              <div className="info-value">{studentCode || 'Not set'}</div>
            )}
            <button 
              className="edit-btn"
              onClick={() => {
                if (editMode.studentCode) {
                  const form = document.createElement('form');
                  const event = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent;
                  Object.defineProperty(event, 'target', { value: form, writable: false });
                  handleUpdate(event);
                }
                setEditMode(prev => ({ ...prev, studentCode: !prev.studentCode }))
              }}
              disabled={loading}
            >
              {editMode.studentCode ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="info-group">
            <label>Credit</label>
            <div className="info-value">${credit.toFixed(2)}</div>
            <button className="edit-btn">Add Credit</button>
          </div>

          <div className="info-group">
            <label>Phone Number</label>
            {editMode.phone ? (
              <input
                type="tel"
                className="info-input"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            ) : (
              <div className="info-value">{phone || 'Not set'}</div>
            )}
            <button 
              className="edit-btn"
              onClick={() => {
                if (editMode.phone) {
                  const form = document.createElement('form');
                  const event = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent;
                  Object.defineProperty(event, 'target', { value: form, writable: false });
                  handleUpdate(event);
                }
                setEditMode(prev => ({ ...prev, phone: !prev.phone }))
              }}
              disabled={loading}
            >
              {editMode.phone ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="info-group" style={{borderBottom: 'none'}}>
            <button 
              onClick={handleLogout}
              className="edit-btn"
              style={{
                background: 'linear-gradient(180deg, #ff4f4f 0%, #e63b3b 100%)',
                width: '100%'
              }}
            >
              Logout
            </button>
          </div>

          <div className="info-group" style={{borderBottom: 'none', paddingTop: '10px'}}>
            <button
              onClick={() => {
                localStorage.removeItem('userRole')
                router.push('/role')
              }}
              className="edit-btn"
              style={{
                background: 'linear-gradient(180deg, #4CAF50 0%, #45a049 100%)',
                width: '100%'
              }}
            >
              Change Role
            </button>
          </div>
        </div>

      </main>

      <BottomDock role={role} />
    </div>
  )
}