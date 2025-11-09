'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import BottomDock from '../../components/BottomDock'
import SharifPlusMenu from '../../components/SharifPlusMenu'
import SharifFastFoodMenu from '../../components/SharifFastFoodMenu'
import OtherMenu from '../../components/OtherMenu'
import KelanaMenu from '../../components/KelanaMenu'
import CleanFoodMenu from '../../components/CleanFoodMenu'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n'
import { getOrdersByUser, confirmDelivery, Order } from '../../lib/orders'
import OrderChat from '../../components/OrderChat'
import { useNotification } from '@/contexts/NotificationContext'

export default function CustomerHome() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { t } = useI18n()
  const { showNotification } = useNotification()
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false)
  const [isFastFoodMenuOpen, setIsFastFoodMenuOpen] = useState(false)
  const [isOtherMenuOpen, setIsOtherMenuOpen] = useState(false)
  const [isKelanaMenuOpen, setIsKelanaMenuOpen] = useState(false)
  const [isCleanFoodMenuOpen, setIsCleanFoodMenuOpen] = useState(false)
  const [pendingOrders, setPendingOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedOrderForChat, setSelectedOrderForChat] = useState<Order | null>(null)

  const services = useMemo(() => [
    { name: t('service.sharif_plus'), icon: '/delivery-icon.png', location: 'Sharif Plus' },
    { name: t('service.sharif_fastfood'), icon: '/shariffastfood.png', location: 'Sharif Fastfood' },
    { name: t('service.self'), icon: '/self.png', location: 'Self' },
    { name: t('service.clean_food'), icon: '/logo38668.jpeg', location: 'Clean Food' },
    { name: t('service.other'), icon: '/other-icon.png', location: 'Other' },
    { name: t('service.kelana'), icon: '/kelana-icon.png', location: 'Kelana' },
  ], [t])

  const handleOrderClick = (location: string) => {
    if (location === 'Sharif Plus') {
      setIsPlusMenuOpen(true)
    } else if (location === 'Sharif Fastfood') {
      setIsFastFoodMenuOpen(true)
    } else if (location === 'Other') {
      setIsOtherMenuOpen(true)
    } else if (location === 'Kelana') {
      setIsKelanaMenuOpen(true)
    } else if (location === 'Clean Food') {
      setIsCleanFoodMenuOpen(true)
    } else {
      router.push(`/order?restaurant=${encodeURIComponent(location)}`)
    }
  }

  const handleOrderSuccess = () => {
    alert(t('order.success_submit'))
  }

  const loadOrders = async () => {
    if (!user) return
    
    setLoadingOrders(true)
    try {
      const orders = await getOrdersByUser(user.$id)
      const pending = orders.filter(order => 
        order.status === 'pending' || 
        order.status === 'waiting_for_payment' || 
        order.status === 'food_delivering'
      )
      setPendingOrders(pending)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleRefresh = async () => {
    if (!user) return
    
    setRefreshing(true)
    try {
      await loadOrders()
    } catch (err) {
      console.error('Error refreshing orders:', err)
    } finally {
      setRefreshing(false)
    }
  }

  // Fetch pending orders
  useEffect(() => {
    loadOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-200">
        <div className="text-white text-xl">{t('customer.loading')}</div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-200">
        <div className="text-white text-xl">{t('customer.redirecting_login')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-200 py-6 px-4 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image src="/logo-scooter.png" alt="SharifRo Logo" width={64} height={64} className="w-16 h-auto" />
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg font-medium text-sm transition-all flex items-center gap-2 border border-white border-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed"
              title={t('delivery.refresh')}
            >
              <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
              <span className="hidden sm:inline">{refreshing ? t('delivery.refreshing') : t('delivery.refresh')}</span>
            </button>
          </div>

        </header>

        {/* Pending Orders Section */}
        {!loadingOrders && pendingOrders.length > 0 && (
          <div className="mb-6">
            <div className="bg-white bg-opacity-95 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⏳</span>
                <h2 className="text-xl font-bold text-gray-800">سفارش‌های در حال پردازش</h2>
              </div>
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <div key={order.$id} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{order.restaurantLocation}</h3>
                        <p className="text-sm text-gray-600">{order.restaurantType}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === 'pending' 
                            ? 'bg-yellow-200 text-yellow-800' 
                            : order.status === 'waiting_for_payment'
                            ? 'bg-orange-200 text-orange-800'
                            : order.status === 'food_delivering'
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-green-200 text-green-800'
                        }`}>
                          {order.status === 'pending' 
                            ? '🕐 در انتظار' 
                            : order.status === 'waiting_for_payment'
                            ? '💰 در انتظار پرداخت'
                            : order.status === 'food_delivering'
                            ? '🚚 در حال ارسال'
                            : '✓ تحویل داده شد'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white bg-opacity-50 rounded p-2">
                        <span className="text-gray-600">{t('customer.amount')}</span>
                        <span className="font-bold text-gray-800 mr-2">{order.price.toLocaleString()} {t('delivery.toman')}</span>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded p-2">
                        <span className="text-gray-600">{t('customer.delivery_location')}</span>
                        <span className="font-bold text-gray-800 mr-2">{order.deliveryLocation}</span>
                      </div>
                    </div>
                    
                    {/* Delivery Person Phone - Only shown after order is accepted */}
                    {order.deliveryPersonPhone && (
                      <div className="mt-3 bg-green-50 border border-green-200 rounded p-3 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">📞</span>
                          <span className="text-gray-700 font-semibold">{t('customer.delivery_person_phone')}</span>
                        </div>
                        <span className="font-bold text-gray-800 text-base" dir="ltr">{order.deliveryPersonPhone}</span>
                      </div>
                    )}
                    
                    {/* Delivery Person Card Number - Only shown after order is accepted */}
                    {order.deliveryPersonCardNumber && (
                      <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">💳</span>
                          <span className="text-gray-700 font-semibold">{t('customer.delivery_person_card')}</span>
                        </div>
                        <span className="font-bold text-gray-800 text-base" dir="ltr">{order.deliveryPersonCardNumber}</span>
                      </div>
                    )}
                    
                    {/* Confirm Delivery Button - Only shown for food_delivering orders */}
                    {order.status === 'food_delivering' && (
                      <div className="mt-3 flex justify-center">
                        <button
                          onClick={async () => {
                            if (order.$id) {
                              try {
                                await confirmDelivery(order.$id)
                                showNotification(t('customer.delivery_confirmed'), 'success')
                                await loadOrders()
                              } catch (error) {
                                console.error('Error confirming delivery:', error)
                                showNotification(t('customer.delivery_confirm_failed'), 'error')
                              }
                            }
                          }}
                          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
                        >
                          {t('customer.confirm_delivery')}
                        </button>
                      </div>
                    )}
                    
                    {order.orderCode && (
                      <div className="mt-3 bg-white bg-opacity-70 rounded p-2 text-sm">
                        <span className="text-gray-600">{t('customer.order_code')}</span>
                        <span className="font-mono font-bold text-gray-800 mr-2">{order.orderCode}</span>
                      </div>
                    )}
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>📅</span>
                        <span>{order.$createdAt ? new Date(order.$createdAt).toLocaleString('fa-IR') : ''}</span>
                      </div>
                      {/* Chat button - only for orders with delivery person assigned */}
                      {user && (order.status === 'waiting_for_payment' || order.status === 'food_delivering') && order.deliveryPersonId && (
                        <button
                          onClick={() => setSelectedOrderForChat(order)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-1"
                        >
                          💬 چت
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              

            </div>
          </div>
        )}

        {/* Services Grid */}
        <main className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
          {services.map((service) => (
            <div
              key={service.name}
              onClick={() => handleOrderClick(service.location)}
              className="bg-white bg-opacity-95 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className="flex flex-col items-center gap-3">
                <Image
                  src={service.icon}
                  alt={service.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
                <span className="text-gray-800 font-semibold">{service.name}</span>
                <button className="hidden group-hover:block bg-gradient-to-b from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:from-blue-600 hover:to-blue-700">
                  {t('customer.order_now')}
                </button>
              </div>
            </div>
          ))}
        </main>
      </div>

      <BottomDock role="customer" />
      
      {/* Sharif Plus Menu Popup */}
      <SharifPlusMenu 
        isOpen={isPlusMenuOpen} 
        onClose={() => setIsPlusMenuOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Sharif Fast Food Menu Popup */}
      <SharifFastFoodMenu 
        isOpen={isFastFoodMenuOpen} 
        onClose={() => setIsFastFoodMenuOpen(false)}
      />

      {/* Other Menu Popup */}
      <OtherMenu 
        isOpen={isOtherMenuOpen} 
        onClose={() => setIsOtherMenuOpen(false)}
      />

      {/* Kelana Menu Popup */}
      <KelanaMenu 
        isOpen={isKelanaMenuOpen} 
        onClose={() => setIsKelanaMenuOpen(false)}
      />

      {/* Clean Food Menu Popup */}
      <CleanFoodMenu 
        isOpen={isCleanFoodMenuOpen} 
        onClose={() => setIsCleanFoodMenuOpen(false)}
      />

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