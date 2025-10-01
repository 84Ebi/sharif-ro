'use client'

import { useState, useEffect } from 'react'
import { account, databases, Query } from '../../lib/appwrite'
import BottomDock from '../../components/BottomDock'

const permDbId = '68dad08a0025eb52dbbf'
const collectionId = 'orders'

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
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [locationFilter, setLocationFilter] = useState('')
  const [costMin, setCostMin] = useState('')
  const [costMax, setCostMax] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, locationFilter, costMin, costMax])

  const checkUser = async () => {
    // Mock user
    const mockUser = {
      $id: 'user1',
      name: 'Mock Delivery User',
      email: 'delivery@example.com',
    }
    setUser(mockUser)
    loadOrders()
  }

  const loadOrders = async () => {
    // Mock loading orders
    setOrders(mockOrders)
  }

  const filterOrders = () => {
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
  }

  const acceptOrder = async (orderId: string) => {
    if (!user) return
    // Mock accept order
    setOrders(orders.map(order => order.$id === orderId ? { ...order, assigned: true, deliveryPerson: user.$id } : order))
    alert('Order accepted')
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