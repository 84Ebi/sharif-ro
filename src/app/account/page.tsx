'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import BottomDock from '../../components/BottomDock'
import styles from './account.module.css'

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
    <div className={styles.background}>
      <main className={styles.profileContainer}>
        <h1>Account</h1>
        
        {error && <p className={styles.errorMessage} style={{color: '#ff6b6b', marginBottom: '15px'}}>{error}</p>}
        
        <div className={styles.profileSection}>
          <div className={styles.infoGroup}>
            <label>Name</label>
            {editMode.name ? (
              <input
                type="text"
                className={styles.infoInput}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            ) : (
              <div className={styles.infoValue}>{name}</div>
            )}
            <button 
              className={styles.editBtn}
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

          <div className={styles.infoGroup}>
            <label>Email</label>
            <div className={styles.infoValue}>{email}</div>
            <button className={styles.editBtn} disabled style={{opacity: 0.5, cursor: 'not-allowed'}}>
              Locked
            </button>
          </div>

          <div className={styles.infoGroup}>
            <label>University Student Code</label>
            {editMode.studentCode ? (
              <input
                type="text"
                className={styles.infoInput}
                value={studentCode}
                onChange={e => setStudentCode(e.target.value)}
              />
            ) : (
              <div className={styles.infoValue}>{studentCode || 'Not set'}</div>
            )}
            <button 
              className={styles.editBtn}
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

          <div className={styles.infoGroup}>
            <label>Credit</label>
            <div className={styles.infoValue}>${credit.toFixed(2)}</div>
            <button className={styles.editBtn}>Add Credit</button>
          </div>

          <div className={styles.infoGroup}>
            <label>Phone Number</label>
            {editMode.phone ? (
              <input
                type="tel"
                className={styles.infoInput}
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            ) : (
              <div className={styles.infoValue}>{phone || 'Not set'}</div>
            )}
            <button 
              className={styles.editBtn}
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

          <div className={styles.infoGroup} style={{borderBottom: 'none'}}>
            <button 
              onClick={handleLogout}
              className={styles.editBtn}
              style={{
                background: 'linear-gradient(180deg, #ff4f4f 0%, #e63b3b 100%)',
                width: '100%'
              }}
            >
              Logout
            </button>
          </div>

          <div className={styles.infoGroup} style={{borderBottom: 'none', paddingTop: '10px'}}>
            <button
              onClick={() => {
                localStorage.removeItem('userRole')
                router.push('/role')
              }}
              className={styles.editBtn}
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