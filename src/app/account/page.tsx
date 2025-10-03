'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { account } from '../../lib/appwrite'
import BottomDock from '../../components/BottomDock'
import '../../styles/account-profile.css'

interface Order {
  id: string;
  orderCode: string;
  status: string;
  date: string;
  cost: number;
}

interface UserData {
  $id: string;
  name: string;
  email: string;
  phone: string;
  prefs: {
    studentCode?: string;
    credit?: number;
    phone?: string;
  };
}

export default function AccountPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [studentCode, setStudentCode] = useState('')
  const [credit, setCredit] = useState(0)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState<'customer' | 'delivery'>('customer')
  const [orders, setOrders] = useState<Order[]>([])
  const [editMode, setEditMode] = useState({
    name: false,
    studentCode: false,
    phone: false,
  })
  const router = useRouter()

  const checkUser = useCallback(async () => {
    try {
      // Get user from Appwrite session
      const currentUser = await account.get()
      setUser(currentUser as UserData)
      setName(currentUser.name || '')
      setEmail(currentUser.email || '')
      
      // Get user preferences
      const prefs = currentUser.prefs || {}
      setStudentCode(prefs.studentCode || '')
      setCredit(prefs.credit || 0)
      setPhone(prefs.phone || currentUser.phone || '')
      
      // Mock order history data
      const mockOrders = [
        {
          id: '1',
          orderCode: 'ORD001',
          status: 'Delivered',
          date: '2023-10-01',
          cost: 15.99,
        },
        {
          id: '2',
          orderCode: 'ORD002',
          status: 'In Progress',
          date: '2023-10-02',
          cost: 22.50,
        },
      ]
      setOrders(mockOrders)
    } catch (err) {
      console.error('Not authenticated:', err)
      router.push('/auth')
    }
  }, [router])

  useEffect(() => {
    checkUser()
    const storedRole = localStorage.getItem('userRole') as 'customer' | 'delivery'
    if (storedRole) setRole(storedRole)
  }, [checkUser])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Update name
      if (name.trim()) {
        await account.updateName(name)
      }
      
      // Update preferences
      await account.updatePrefs({
        studentCode,
        credit,
        phone
      })
      
      alert('Profile updated successfully')
      setEditMode({ name: false, studentCode: false, phone: false })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await account.deleteSession('current')
      localStorage.removeItem('userRole')
      router.push('/auth')
    } catch (err) {
      console.error('Logout failed:', err)
      router.push('/auth')
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
                  handleUpdate(new Event('submit') as any)
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
                  handleUpdate(new Event('submit') as any)
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
                  handleUpdate(new Event('submit') as any)
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

        <div className="orders-section">
          <h2>Order History</h2>
          <div className="orders-list">
            {orders.length > 0 ? (
              orders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-header">
                    <span className="order-code">Order Code: {order.orderCode}</span>
                    <span className="order-status">Status: {order.status}</span>
                  </div>
                  <div className="order-details">
                    <p>Date: {order.date}</p>
                    <p>Total: ${order.cost.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{color: '#02243a', textAlign: 'center'}}>No orders yet</p>
            )}
          </div>
        </div>
      </main>

      <BottomDock role={role} />
    </div>
  )
}