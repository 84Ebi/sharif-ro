'use client'

import { useState, useEffect, useCallback } from 'react'
import BottomDock from '../../components/BottomDock'
import { useAuth } from '../../lib/useAuth'

interface Order {
  $id: string
  orderCode: string
  name: string
  phone: string
  email?: string
  address: string
  instructions: string
  createdAt: string
  cost: number
  assigned?: boolean
}

const mockOrders: Order[] = [
  {
    $id: '1',
    orderCode: 'ORD001',
    name: 'John Doe',
    phone: '1234567890',
    email: 'john@example.com',
    address: '123 Main St',
    instructions: 'Leave at door',
    createdAt: new Date().toISOString(),
    cost: 15.99,
  },
  {
    $id: '2',
    orderCode: 'ORD002',
    name: 'Jane Smith',
    phone: '0987654321',
    address: '456 Elm St',
    instructions: '',
    createdAt: new Date().toISOString(),
    cost: 22.50,
  },
]

export default function Delivery() {
  const { loading: authLoading } = useAuth()
  const [user, setUser] = useState<{$id: string; name: string; email: string} | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [locationFilter, setLocationFilter] = useState('')
  const [costMin, setCostMin] = useState('')
  const [costMax, setCostMax] = useState('')

  // Define filterOrders with useCallback before using it in useEffect
  const filterOrders = useCallback(() => {
    let filtered = orders.filter(order => !order.assigned)
    if (locationFilter) {
      filtered = filtered.filter(order =>
        order.address.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }
    if (costMin) {
      filtered = filtered.filter(order => order.cost >= Number(costMin))
    }
    if (costMax) {
      filtered = filtered.filter(order => order.cost <= Number(costMax))
    }
    setFilteredOrders(filtered)
  }, [orders, locationFilter, costMin, costMax]);

  const loadOrders = useCallback(async () => {
    // Mock loading orders
    setOrders(mockOrders)
  }, []);

  const checkUser = useCallback(async () => {
    // Mock user
    const mockUser = {
      $id: 'user1',
      name: 'Mock Delivery User',
      email: 'delivery@example.com',
    }
    setUser(mockUser)
    loadOrders()
  }, [loadOrders]);

  const acceptOrder = async (orderId: string) => {
    if (!user) return
    // Mock accept order
    setOrders(orders.map(order => order.$id === orderId ? { ...order, assigned: true, deliveryPerson: user.$id } : order))
    alert('Order accepted')
  }

  useEffect(() => {
    checkUser()
  }, [checkUser])

  useEffect(() => {
    filterOrders()
  }, [filterOrders])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Delivery Dashboard</h1>
        <p className="mb-4">Welcome, {user.name || user.email}</p>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold mb-2">Filters</h2>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Filter by location"
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min cost"
                value={costMin}
                onChange={e => setCostMin(e.target.value)}
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Max cost"
                value={costMax}
                onChange={e => setCostMax(e.target.value)}
                className="w-1/2 p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <p>No unassigned orders.</p>
          ) : (
            filteredOrders.map(order => (
              <div key={order.$id} className="bg-white p-4 rounded-lg shadow-md">
                <p><strong>Order Code:</strong> {order.orderCode}</p>
                <p><strong>Name:</strong> {order.name}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                {order.email && <p><strong>Email:</strong> {order.email}</p>}
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Instructions:</strong> {order.instructions}</p>
                <p><strong>Time:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Cost:</strong> ${order.cost}</p>
                <button
                  onClick={() => acceptOrder(order.$id)}
                  className="w-full bg-blue-500 text-white p-2 rounded mt-2"
                >
                  Accept Order
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <BottomDock role="delivery" />
    </div>
  )
}