'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../../lib/useAuth'
import { getOrdersByUser, Order } from '../../../lib/orders'
import BottomDock from '../../../components/BottomDock'

export default function MyOrders() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const loadOrders = useCallback(async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const fetchedOrders = await getOrdersByUser(user.$id)
      // Sort by creation date, newest first
      const sortedOrders = fetchedOrders.sort((a, b) => {
        const dateA = a.$createdAt ? new Date(a.$createdAt).getTime() : 0
        const dateB = b.$createdAt ? new Date(b.$createdAt).getTime() : 0
        return dateB - dateA
      })
      setOrders(sortedOrders)
      setError('')
    } catch (err) {
      console.error('Error loading orders:', err)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user, loadOrders])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-200">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-200">
        <div className="text-white text-xl">Please log in to view your orders.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-200 py-6 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">My Orders</h1>
          <button
            onClick={loadOrders}
            className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500">Start by placing your first order!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.$id}
                className="bg-white rounded-lg shadow-lg p-5 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => setSelectedOrder(selectedOrder?.$id === order.$id ? null : order)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        {order.restaurantLocation}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.restaurantType}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Order placed: {formatDate(order.$createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">${order.price.toFixed(2)}</p>
                  </div>
                </div>

                {selectedOrder?.$id === order.$id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Delivery Address
                        </p>
                        <p className="text-sm text-gray-800 mt-1">{order.deliveryLocation}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Phone</p>
                        <p className="text-sm text-gray-800 mt-1">{order.phone}</p>
                      </div>

                      {order.orderCode && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Order Code
                          </p>
                          <p className="text-sm text-gray-800 mt-1 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                            {order.orderCode}
                          </p>
                        </div>
                      )}

                      {order.extraNotes && (
                        <div className="md:col-span-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Extra Notes
                          </p>
                          <p className="text-sm text-gray-800 mt-1">{order.extraNotes}</p>
                        </div>
                      )}

                      {order.status !== 'pending' && order.deliveryPersonName && (
                        <div className="md:col-span-2 bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs font-semibold text-blue-700 uppercase mb-2">
                            Delivery Person
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-gray-600">Name</p>
                              <p className="text-sm font-semibold text-gray-800">
                                {order.deliveryPersonName}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Phone</p>
                              <p className="text-sm font-semibold text-gray-800">
                                {order.deliveryPersonPhone}
                              </p>
                            </div>
                          </div>
                          {order.confirmedAt && (
                            <p className="text-xs text-gray-600 mt-2">
                              Confirmed: {formatDate(order.confirmedAt)}
                            </p>
                          )}
                          {order.deliveredAt && (
                            <p className="text-xs text-gray-600 mt-1">
                              Delivered: {formatDate(order.deliveredAt)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center mt-3 text-gray-400">
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      selectedOrder?.$id === order.$id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomDock role="customer" />
    </div>
  )
}
