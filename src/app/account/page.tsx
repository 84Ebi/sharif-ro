'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { account } from '../../lib/appwrite'
import BottomDock from '../../components/BottomDock'

interface Order {
  id: string;
  orderCode: string;
  status: string;
  date: string;
  cost: number;
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [studentCode, setStudentCode] = useState('')
  const [credit, setCredit] = useState(0)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState<'customer' | 'delivery'>('customer')
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()

  useEffect(() => {
    checkUser()
    const storedRole = localStorage.getItem('userRole') as 'customer' | 'delivery'
    if (storedRole) setRole(storedRole)
  }, [])

  const checkUser = async () => {
    try {
      // Get user from Appwrite session
      const currentUser = await account.get()
      setUser(currentUser)
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
  }

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
      router.push('/auth')
    } catch (err) {
      console.error('Logout failed:', err)
      // Force redirect even if logout fails
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Account</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">University Student Code</label>
            <input
              type="text"
              value={studentCode}
              onChange={e => setStudentCode(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Credit</label>
            <input
              type="number"
              value={credit}
              onChange={e => setCredit(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Logout
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('userRole')
            router.push('/role')
          }}
          className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Change Role
        </button>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Order History</h2>
          <div className="space-y-2">
            {orders.map(order => (
              <div key={order.id} className="bg-white p-4 rounded-lg shadow-md">
                <p><strong>Order Code:</strong> {order.orderCode}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Date:</strong> {order.date}</p>
                <p><strong>Cost:</strong> ${order.cost}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomDock role={role} />
    </div>
  )
}