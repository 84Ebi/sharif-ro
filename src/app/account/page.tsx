'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/lib/i18n'
import BottomDock from '../../components/BottomDock'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import styles from './account.module.css'

export default function AccountPage() {
  const { user, loading: authLoading, updateName, updatePreferences, logout } = useAuth()
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [studentCode, setStudentCode] = useState('')
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
        phone
      })
      
      alert(t('account.updated'))
      setEditMode({ name: false, studentCode: false, phone: false })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('account.update_failed')
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
        <div>{t('account.loading')}</div>
      </div>
    )
  }

  return (
    <div className={styles.background}>
      <h1 className={styles.profileContainer}>{t('account.title')}</h1>
      <div className='w-fit px-10 justify-around text-center text-black bg-white p-2  rounded-2xl z-50'>
        <h1>زبان</h1>
        <LanguageSwitcher />
      </div>
      <main className={styles.profileContainer}>
        
        
        {error && <p className={styles.errorMessage} style={{color: '#ff6b6b', marginBottom: '15px'}}>{error}</p>}
        
        <div className={styles.profileSection}>
          <div className={styles.infoGroup}>
            <label>{t('account.name')}</label>
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
              {editMode.name ? t('account.save') : t('account.edit')}
            </button>
          </div>

          <div className={styles.infoGroup}>
            <label>{t('account.email')}</label>
            <div className={styles.infoValue}>{email}</div>
            <button className={styles.editBtn} disabled style={{opacity: 0.5, cursor: 'not-allowed'}}>
              {t('account.locked')}
            </button>
          </div>

          <div className={styles.infoGroup}>
            <label>{t('account.studentCode')}</label>
            {editMode.studentCode ? (
              <input
                type="text"
                className={styles.infoInput}
                value={studentCode}
                onChange={e => setStudentCode(e.target.value)}
              />
            ) : (
              <div className={styles.infoValue}>{studentCode || t('account.not_set')}</div>
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
              {editMode.studentCode ? t('account.save') : t('account.edit')}
            </button>
          </div>

          <div className={styles.infoGroup}>
            <label>{t('account.phone')}</label>
            {editMode.phone ? (
              <input
                type="tel"
                className={styles.infoInput}
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            ) : (
              <div className={styles.infoValue}>{phone || t('account.not_set')}</div>
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
              {editMode.phone ? t('account.save') : t('account.edit')}
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
              {t('account.logout')}
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
              {t('account.change_role')}
            </button>
          </div>
        </div>

      </main>

      <BottomDock role={role} />
    </div>
  )
}