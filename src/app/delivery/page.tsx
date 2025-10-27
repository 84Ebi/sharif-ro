'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { getPendingOrders, confirmOrder, type Order } from '../../lib/orders'
import BottomDock from '../../components/BottomDock'

export default function Delivery() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [locationFilter, setLocationFilter] = useState('')
  const [costMin, setCostMin] = useState('')
  const [costMax, setCostMax] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const filterOrders = useCallback(() => {
    let filtered = orders
    
    if (locationFilter) {
      filtered = filtered.filter(order =>
        order.restaurantLocation.toLowerCase().includes(locationFilter.toLowerCase()) ||
        order.deliveryLocation.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }
    
    if (costMin) {
      filtered = filtered.filter(order => order.price >= Number(costMin))
    }
    
    if (costMax) {
      filtered = filtered.filter(order => order.price <= Number(costMax))
    }
    
    setFilteredOrders(filtered)
  }, [orders, locationFilter, costMin, costMax])

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      const pendingOrders = await getPendingOrders()
      setOrders(pendingOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user && user.emailVerification) {
      loadOrders()
    }
  }, [user, loadOrders])

  const acceptOrder = async (orderId: string) => {
    if (!user) return
    
    try {
      await confirmOrder(orderId, {
        id: user.$id,
        name: user.name,
        phone: user.phone || ''
      })
      
      // Remove order from list
      setOrders(orders.filter(order => order.$id !== orderId))
      alert('Order confirmed! Check "My Deliveries" to view details.')
    } catch (error) {
      console.error('Error accepting order:', error)
      alert('Failed to accept order. Please try again.')
    }
  }

  useEffect(() => {
    filterOrders()
  }, [filterOrders])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-200">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-200">
        <div className="text-white text-xl">Please log in to access delivery dashboard.</div>
      </div>
    )
  }

  // Check if user is verified
  if (!user.emailVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-200 py-6 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-100 rounded-xl p-6 text-center shadow-xl mt-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">⚠️ Verification Required</h2>
            <p className="text-gray-700 mb-6">
              Your account is not yet verified to accept delivery orders. 
              Please complete the verification process to start delivering.
            </p>
            <Link href="/delivery/verify">
              <button className="bg-gradient-to-b from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all">
                Go to Verification
              </button>
            </Link>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 mt-6">
            <h3 className="text-xl font-bold text-white mb-4">Why Verification?</h3>
            <ul className="space-y-2 text-white">
              <li className="flex items-center gap-2">
                <span>✓</span> Ensures safe and reliable deliveries
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Protects customers and delivery partners
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Verifies student identity
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span> Manual review by admins for security
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-200 text-black py-6 px-4 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-4">
          <div className="flex items-center gap-3 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gift.png" alt="Logo" className="w-14 h-14 object-contain" style={{mixBlendMode: 'screen'}} />
            <h1 className="text-lg font-bold text-white">Delivery Dashboard</h1>
          </div>

          {/* Filter Pill */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white bg-opacity-10 border border-white border-opacity-10 text-black hover:bg-opacity-20 transition-all group cursor-pointer">
            <span className="font-bold text-sm">Filters</span>
            <div className=" group-hover:flex group-focus-within:flex items-center gap-2">
              <input
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white text-gray-800 text-sm outline-none w-32"
              />
              <input
                type="number"
                placeholder="Min"
                value={costMin}
                onChange={(e) => setCostMin(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white text-gray-800 text-sm outline-none w-20"
              />
              <input
                type="number"
                placeholder="Max"
                value={costMax}
                onChange={(e) => setCostMax(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white text-gray-800 text-sm outline-none w-20"
              />
            </div>
          </div>
        </header>

        {/* Orders Card */}
        <main className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl shadow-2xl p-3 min-h-[60vh] max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
          <div className="overflow-auto pr-2 flex flex-col gap-2 p-2">
            {loading ? (
              <div className="text-center text-white py-8">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center text-white py-8">No pending orders available.</div>
            ) : (
              filteredOrders.map(order => (
                <article
                  key={order.$id}
                  className="bg-white rounded-lg p-3 shadow-md cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
                  onClick={() => setExpandedOrder(expandedOrder === order.$id ? null : (order.$id || null))}
                >
                  {/* Compact Header */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col gap-1">
                      <div className="font-bold text-gray-800 text-sm">
                        {order.restaurantLocation === 'Self' ? 'سلف سرویس' : (order.orderCode || order.$id?.slice(0, 8))}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.$createdAt && new Date(order.$createdAt).toLocaleDateString()} • {' '}
                        {order.$createdAt && new Date(order.$createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                      </div>
                    </div>
                    <div className="font-bold text-gray-800 text-sm">
                      ${order.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Preview Line */}
                  <div className="text-sm text-gray-700 truncate">
                    {order.restaurantLocation} → {order.deliveryLocation}
                  </div>

                  {/* Expanded Details */}
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: expandedOrder === order.$id ? '400px' : '0',
                      opacity: expandedOrder === order.$id ? '1' : '0'
                    }}
                  >
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-sm text-gray-700">
                      <div><strong>Customer:</strong> {order.fullName}</div>
                      <div><strong>Phone:</strong> {order.phone}</div>
                      {order.email && <div><strong>Email:</strong> {order.email}</div>}
                      <div><strong>Restaurant:</strong> {order.restaurantLocation} ({order.restaurantType})</div>
                      {order.restaurantLocation === 'Self' ? (
                        <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                          <div className="text-sm text-yellow-800">
                            <strong>⚠️ Self Service Order</strong><br/>
                            <span className="text-xs">Order code will be shown after acceptance</span>
                          </div>
                        </div>
                      ) : (
                        order.orderCode && <div><strong>Order Code:</strong> {order.orderCode}</div>
                      )}
                      <div><strong>Delivery To:</strong> {order.deliveryLocation}</div>
                      {order.extraNotes && <div><strong>Notes:</strong> {order.extraNotes}</div>}
                      <div><strong>Price:</strong> ${order.price.toFixed(2)}</div>
                    </div>

                    <div className="flex justify-center mt-3">
                      <button
                        className="bg-gradient-to-b from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (order.$id) acceptOrder(order.$id)
                        }}
                      >
                        Accept Order
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </main>
      </div>

      <BottomDock role="delivery" />
    </div>
  )
}