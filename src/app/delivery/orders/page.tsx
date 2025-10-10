'use client'

import { useState, useEffect, useCallback } from 'react'
import BottomDock from '../../../components/BottomDock'
import { useAuth } from '../../../lib/useAuth'
import { getOrders, subscribeToOrders, updateOrderStatus, type Order } from '../../../lib/orders'
import Link from 'next/link'

export default function DeliveryOrders() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'confirmed' | 'delivered'>('confirmed')

  const loadOrders = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const deliveryOrders = await getOrders({ deliveryPersonId: user.$id })
      setOrders(deliveryOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadOrders()

      // Subscribe to real-time updates for delivery person's orders
      const unsubscribe = subscribeToOrders((order) => {
        if (order.deliveryPersonId === user.$id) {
          setOrders(prev => {
            const exists = prev.find(o => o.$id === order.$id)
            if (exists) {
              return prev.map(o => o.$id === order.$id ? order : o)
            }
            return [order, ...prev]
          })
        }
      })

      return () => {
        unsubscribe()
      }
    }
  }, [user, loadOrders])

  const markAsDelivered = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'delivered')
      setOrders(orders.map(o => o.$id === orderId ? { ...o, status: 'delivered' } : o))
    } catch (error) {
      console.error('Error marking as delivered:', error)
      alert('Failed to update order status')
    }
  }

  const filteredOrders = orders.filter(order => {
    return order.status === filter
  })

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
        <div className="text-white text-xl">Please log in to view your delivery orders.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Delivery Orders</h1>
            <Link
              href="/delivery"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(['confirmed', 'delivered'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Orders list */}
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading your orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                {filter === 'confirmed'
                  ? 'You have no active deliveries.'
                  : 'You have no completed deliveries.'}
              </p>
              {filter === 'confirmed' && (
                <Link
                  href="/delivery"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Check for new orders →
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.$id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {order.restaurantLocation}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.$createdAt && new Date(order.$createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">
                        ${order.price.toFixed(2)}
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">
                        <strong>Type:</strong> {order.restaurantType}
                      </p>
                      {order.orderCode && (
                        <p className="text-gray-600">
                          <strong>Order Code:</strong> {order.orderCode}
                        </p>
                      )}
                      <p className="text-gray-600">
                        <strong>Delivery To:</strong> {order.deliveryLocation}
                      </p>
                      {order.extraNotes && (
                        <p className="text-gray-600">
                          <strong>Notes:</strong> {order.extraNotes}
                        </p>
                      )}
                    </div>

                    {/* Customer info */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-900 mb-2">Customer Details</h4>
                      <p className="text-gray-700">
                        <strong>Name:</strong> {order.fullName}
                      </p>
                      <p className="text-gray-700">
                        <strong>Phone:</strong>{' '}
                        <a
                          href={`tel:${order.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {order.phone}
                        </a>
                      </p>
                      {order.email && (
                        <p className="text-gray-700">
                          <strong>Email:</strong> {order.email}
                        </p>
                      )}
                      {order.confirmedAt && (
                        <p className="text-xs text-gray-600 mt-1">
                          Confirmed at: {new Date(order.confirmedAt).toLocaleString()}
                        </p>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => markAsDelivered(order.$id!)}
                          className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium text-sm"
                        >
                          ✓ Mark as Delivered
                        </button>
                      )}
                      {order.status === 'delivered' && order.deliveredAt && (
                        <p className="text-xs text-gray-600 mt-1">
                          Delivered at: {new Date(order.deliveredAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomDock role="delivery" />
    </div>
  )
}