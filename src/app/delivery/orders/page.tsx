'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getOrders, confirmPayment, Order } from '../../../lib/orders'
import BottomDock from '../../../components/BottomDock'
import { useI18n } from '@/lib/i18n'
import { useNotification } from '@/contexts/NotificationContext'
import OrderChat from '../../../components/OrderChat'

export default function MyDeliveries() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useI18n()
  const { showNotification } = useNotification()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'waiting_for_payment' | 'food_delivering' | 'food_delivered'>('all')
  const [selectedOrderForChat, setSelectedOrderForChat] = useState<Order | null>(null)

  const loadOrders = useCallback(async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const fetchedOrders = await getOrders({ deliveryPersonId: user.$id })
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
      setError(t('deliveries.error_load'))
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user, loadOrders])

  const handleConfirmPayment = async (orderId: string) => {
    try {
      await confirmPayment(orderId)
      await loadOrders()
      setSelectedOrder(null)
      showNotification(t('delivery.payment_confirmed'), 'success')
    } catch (error) {
      console.error('Error confirming payment:', error)
      showNotification(t('delivery.payment_confirm_failed'), 'error')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'waiting_for_payment':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'food_delivering':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'food_delivered':
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

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true
    return order.status === filterStatus
  })

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-200">
        <div className="text-white text-xl">{t('deliveries.loading')}</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-200">
        <div className="text-white text-xl">{t('deliveries.login_required')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-200 py-6 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">{t('deliveries.title')}</h1>
          <button
            onClick={loadOrders}
            className="px-4 py-2 bg-white bg-opacity-20 text-black rounded-lg hover:bg-opacity-30 transition-all"
          >
            {t('deliveries.refresh')}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filterStatus === 'all'
                ? 'bg-white text-gray-800'
                : 'bg-gray-500 bg-opacity-20 text-black hover:bg-opacity-30'
            }`}
          >
            {t('deliveries.tab.all')}
          </button>
          <button
            onClick={() => setFilterStatus('waiting_for_payment')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filterStatus === 'waiting_for_payment'
                ? 'bg-white text-gray-800'
                : 'bg-gray-500 bg-opacity-20 text-black hover:bg-opacity-30'
            }`}
          >
            {t('deliveries.tab.waiting_payment')}
          </button>
          <button
            onClick={() => setFilterStatus('food_delivering')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filterStatus === 'food_delivering'
                ? 'bg-white text-gray-800'
                : 'bg-gray-500 bg-opacity-20 text-black hover:bg-opacity-30'
            }`}
          >
            {t('deliveries.tab.delivering')}
          </button>
          <button
            onClick={() => setFilterStatus('food_delivered')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filterStatus === 'food_delivered'
                ? 'bg-white text-gray-800'
                : 'bg-gray-500 bg-opacity-20 text-black hover:bg-opacity-30'
            }`}
          >
            {t('deliveries.tab.completed')}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {filteredOrders.length === 0 ? (
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('deliveries.none_title')}</h2>
            <p className="text-gray-500">{t('deliveries.none_text')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.$id}
                className="bg-white rounded-lg shadow-lg p-5 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => setSelectedOrder(selectedOrder?.$id === order.$id ? null : order)}
              >
                <div className=" items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        {order.restaurantLocation === 'Self' ? 'سلف سرویس' : (order.orderCode || order.$id?.slice(0, 8))}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Customer Info - Always Visible */}
                    <div className="bg-blue-50 px-3 py-2 rounded-lg mb-2 border-l-4 border-blue-500">
                      <p className="text-sm font-semibold text-gray-800">
                        👤 {order.fullName}
                      </p>
                      <p className="text-sm text-gray-700">
                        📱 {order.phone}
                      </p>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      {order.restaurantLocation} → {order.deliveryLocation}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('deliveries.timeline.confirmed')}: {formatDate(order.confirmedAt || order.$createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{(order.deliveryFee || 0).toLocaleString()} {t('delivery.toman')}</p>
                    <p className="text-xs text-gray-500">{t('delivery.profit')}</p>
                  </div>
                </div>

                {selectedOrder?.$id === order.$id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 bg-green-50 p-3 rounded-lg">
                        <p className="text-xs font-semibold text-green-700 uppercase mb-2">
                          {t('deliveries.customer_info')}
                        </p>
                        <div className="space-y-1">
                          <div><strong>{t('deliveries.name')}:</strong> {order.fullName}</div>
                          <div><strong>{t('deliveries.phone')}:</strong> {order.phone}</div>
                          {order.email && <div><strong>{t('deliveries.email')}:</strong> {order.email}</div>}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          {t('deliveries.pickup_from')}
                        </p>
                        <p className="text-sm text-gray-800 mt-1">
                          {order.restaurantLocation}
                        </p>
                        <p className="text-xs text-gray-600">({order.restaurantType})</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          {t('deliveries.deliver_to')}
                        </p>
                        <p className="text-sm text-gray-800 mt-1">{order.deliveryLocation}</p>
                      </div>

                      {order.restaurantLocation === 'Self' ? (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            {t('deliveries.order_code')}
                          </p>
                          <p className="text-sm text-gray-800 mt-1 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                            {order.orderCode || t('deliveries.not_available')}
                          </p>
                        </div>
                      ) : (
                        order.orderCode && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              {t('deliveries.order_code')}
                            </p>
                            <p className="text-sm text-gray-800 mt-1 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                              {order.orderCode}
                            </p>
                          </div>
                        )
                      )}

                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">{t('delivery.food_price')}</p>
                        <p className="text-sm text-gray-800 mt-1 font-bold">
                          {((order.price || 0) - (order.deliveryFee || 0)).toLocaleString()} {t('delivery.toman')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">{t('delivery.profit')}</p>
                        <p className="text-sm text-green-600 mt-1 font-bold">
                          {(order.deliveryFee || 0).toLocaleString()} {t('delivery.toman')}
                        </p>
                      </div>

                      {order.extraNotes && (
                        <div className="md:col-span-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            {t('deliveries.notes')}
                          </p>
                          <p className="text-sm text-gray-800 mt-1 bg-yellow-50 p-2 rounded">
                            {order.extraNotes}
                          </p>
                        </div>
                      )}

                      <div className="md:col-span-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase">{t('deliveries.timeline')}</p>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>{t('deliveries.timeline.placed')}: {formatDate(order.$createdAt)}</span>
                          </div>
                          {order.confirmedAt && (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              <span>{t('deliveries.timeline.confirmed')}: {formatDate(order.confirmedAt)}</span>
                            </div>
                          )}
                          {order.paymentConfirmedAt && (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                              <span>{t('deliveries.timeline.payment_confirmed')}: {formatDate(order.paymentConfirmedAt)}</span>
                            </div>
                          )}
                          {order.deliveredAt && (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <span>{t('deliveries.timeline.delivered')}: {formatDate(order.deliveredAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {(order.status === 'waiting_for_payment' || order.status === 'food_delivering') && (
                      <div className="flex justify-center gap-2 pt-2">
                        {order.status === 'waiting_for_payment' && (
                          <button
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (order.$id) handleConfirmPayment(order.$id)
                            }}
                          >
                            {t('delivery.confirm_payment')}
                          </button>
                        )}
                        {(order.status === 'food_delivering' || order.status === 'waiting_for_payment') && (
                          <button
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedOrderForChat(order)
                            }}
                          >
                            💬 {t('chat.title')}
                          </button>
                        )}
                      </div>
                    )}
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

      <BottomDock role="delivery" />

      {/* Order Chat */}
      {selectedOrderForChat && (
        <OrderChat
          orderId={selectedOrderForChat.$id!}
          isOpen={!!selectedOrderForChat}
          onClose={() => setSelectedOrderForChat(null)}
          customerId={selectedOrderForChat.userId}
          deliveryPersonId={selectedOrderForChat.deliveryPersonId}
        />
      )}
    </div>
  )
}