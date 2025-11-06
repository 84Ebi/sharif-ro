'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { getPendingOrders, confirmOrder, getOrders, type Order } from '../../lib/orders'
import BottomDock from '../../components/BottomDock'
import { useI18n } from '@/lib/i18n'


const deliveryLocations = [
  'دانشکده فیزیک',
  'دانشکده علوم ریاضی',
  'دانشکده شیمی',
  'دانشکده مهندسی برق',
  'دانشکده مهندسی انرژی',
  'دانشکده مدیریت و اقتصاد',
  'دانشکده مهندسی عمران',
  'دانشکده مهندسی صنایع',
  'دانشکده مهندسی شیمی و نفت',
  'دانشکده مهندسی و علم مواد',
  'دانشکده مهندسی مکانیک',
  'دانشکده مهندسی کامپیوتر',
  'دانشکده مهندسی هوا فضا',
  'مدیریت تربیت بدنی',
  'مرکز زبان‌ها و زبان‌شناسی',
  'گروه فلسفه علم',
  'مرکز معارف اسلامی و علوم انسانی',
  'مرکز آموزش مهارت‌های مهندسی',
  'خوابگاه احمدی روشن (پسران)',
  'خوابگاه طرشت ۲ (پسران)',
  'خوابگاه طرشت ۳(دختران)',
  'ساختمان ابن سینا',
  'تالار ها',
  'ساختمان روستا ازاد (پارک علم و فناوری )',
  'مسجد',
  'ساختمان اموزش',
  'امفی تئاتر',
]
export default function Delivery() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useI18n()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [locationFilter, setLocationFilter] = useState('')
  const [costMin, setCostMin] = useState('')
  const [costMax, setCostMax] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [deliveryLocation, setDeliveryLocation] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownButtonRef = useRef<HTMLButtonElement>(null)
  const [myActiveDeliveries, setMyActiveDeliveries] = useState<Order[]>([])
  const [loadingMyDeliveries, setLoadingMyDeliveries] = useState(true)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isDropdownOpen && !target.closest('.dropdown-container')) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isDropdownOpen])

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

  // Fetch delivery person's active deliveries (confirmed but not delivered)
  useEffect(() => {
    if (user && user.emailVerification) {
      setLoadingMyDeliveries(true)
      getOrders({ deliveryPersonId: user.$id, status: 'confirmed' })
        .then((deliveryOrders: Order[]) => {
          setMyActiveDeliveries(deliveryOrders)
        })
        .catch((err: Error) => console.error('Failed to fetch my deliveries:', err))
        .finally(() => setLoadingMyDeliveries(false))
    }
  }, [user])

  const handleRefresh = async () => {
    if (!user || !user.emailVerification) return
    
    setRefreshing(true)
    try {
      // Reload pending orders
      await loadOrders()
      
      // Reload active deliveries
      const deliveryOrders = await getOrders({ deliveryPersonId: user.$id, status: 'confirmed' })
      setMyActiveDeliveries(deliveryOrders)
    } catch (error) {
      console.error('Error refreshing:', error)
    } finally {
      setRefreshing(false)
    }
  }

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
      alert(t('delivery.order_confirmed'))
    } catch (error) {
      console.error('Error accepting order:', error)
      alert(t('delivery.accept_failed'))
    }
  }

  useEffect(() => {
    filterOrders()
  }, [filterOrders])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-200">
        <div className="text-white text-xl">{t('delivery.loading')}</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-200">
        <div className="text-white text-xl">{t('delivery.login_required')}</div>
      </div>
    )
  }

  // Check if user is verified
  if (!user.emailVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-200 py-6 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-100 rounded-xl p-6 text-center shadow-xl mt-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('delivery.verification_required_title')}</h2>
            <p className="text-gray-700 mb-6">
              {t('delivery.verification_required_text')}
            </p>
            <Link href="/delivery/verify">
              <button className="bg-gradient-to-b from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all">
                {t('delivery.go_to_verification')}
              </button>
            </Link>
          </div>

          {/* Removed extra info box under the verification message as requested */}
        </div>
        <BottomDock role="delivery" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-200 text-black py-6 px-4 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-4 relative z-20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/gift.png" alt="Logo" className="w-14 h-14 object-contain" style={{mixBlendMode: 'screen'}} />
              <h1 className="text-lg font-bold text-white">{t('delivery.dashboard')}</h1>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing || !user?.emailVerification}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg font-medium text-sm transition-all flex items-center gap-2 border border-white border-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed"
              title={t('delivery.refresh')}
            >
              <span className={refreshing ? 'animate-spin' : ''}> 🔄</span>
              <span className="hidden sm:inline">{refreshing ? t('delivery.refreshing') : t('delivery.refresh')}</span>
            </button>
          </div>

          {/* Filter Section */}
          <div className="flex flex-inline justify-around items-center gap-1 px-2 py-3 rounded-xl bg-white bg-opacity-15 border border-white border-opacity-30 backdrop-blur-sm relative">
            
            {/* Location Dropdown */}
            <div className="relative dropdown-container z-50">
              <button
                ref={dropdownButtonRef}
                type="button"
                onClick={() => {
                  console.log('Dropdown button clicked, current state:', isDropdownOpen)
                  setIsDropdownOpen(!isDropdownOpen)
                }}
                className="px-2 py-2 rounded-lg bg-white shadow-md hover:shadow-lg text-gray-800 font-medium text-sm transition-all flex items-center justify-between gap-2 border border-gray-200"
              >
                <span className="text-right flex">
                  {deliveryLocation || t('delivery.select_location')}
                </span>
                <span className="text-gray-600">▼</span>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-[99999] top-full left-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-300 max-h-60 overflow-y-auto w-full min-w-[250px]">
                  {deliveryLocations.map((loc) => (
                    <div
                      key={loc}
                      onClick={() => {
                        setDeliveryLocation(loc)
                        setLocationFilter(loc)
                        setIsDropdownOpen(false)
                      }}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-right border-b border-gray-100 last:border-0 transition-colors text-gray-800"
                    >
                      {loc}
                    </div>
                  ))}
                  <div
                    onClick={() => {
                      setDeliveryLocation('')
                      setLocationFilter('')
                      setIsDropdownOpen(false)
                    }}
                    className="px-4 py-3 hover:bg-red-50 cursor-pointer text-gray-800 border-t-2 border-gray-200 font-medium"
                  >
                    {t('delivery.clear_filter')}
                  </div>
                </div>
              )}
            </div>
            
            {/* Cost Range Inputs */}
            <div className="flex items-center ">
              <input
                type="number"
                placeholder={t('delivery.cost_min')}
                value={costMin}
                onChange={(e) => setCostMin(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white shadow-md hover:shadow-lg text-gray-800 text-sm outline-none w-20 border border-gray-200"
              />
              <span className="text-white font-medium text-lg">-</span>
              <input
                type="number"
                placeholder={t('delivery.cost_max')}
                value={costMax}
                onChange={(e) => setCostMax(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white shadow-md hover:shadow-lg text-gray-800 text-sm outline-none w-20 border border-gray-200"
              />
            </div>
          </div>
        </header>

        {/* My Active Deliveries Section */}
        {!loadingMyDeliveries && myActiveDeliveries.length > 0 && (
          <div className="mb-4 relative z-10">
            <div className="bg-white bg-opacity-95 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🚀</span>
                <h2 className="text-xl font-bold text-gray-800">{t('delivery.active_deliveries_title')}</h2>
              </div>
              <div className="space-y-4">
                {myActiveDeliveries.map((order) => (
                  <div key={order.$id} className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-500">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{order.restaurantLocation}</h3>
                        <p className="text-sm text-gray-600">{order.restaurantType}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-200 text-green-800">
                          {t('delivery.status_in_delivery')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div className="bg-white bg-opacity-50 rounded p-2">
                        <span className="text-gray-600">{t('delivery.origin')}</span>
                        <span className="font-bold text-gray-800 mr-2">{order.restaurantLocation}</span>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded p-2">
                        <span className="text-gray-600">{t('delivery.destination')}</span>
                        <span className="font-bold text-gray-800 mr-2">{order.deliveryLocation}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div className="bg-white bg-opacity-50 rounded p-2">
                        <span className="text-gray-600">{t('delivery.amount')}</span>
                        <span className="font-bold text-gray-800 mr-2">{order.price.toLocaleString()} {t('delivery.toman')}</span>
                      </div>
                    </div>

                    {/* Phone Numbers - Only shown after order is accepted */}
                    {(order.phone || order.deliveryPersonPhone) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                        {order.phone && (
                          <div className="bg-white bg-opacity-50 rounded p-2">
                            <span className="text-gray-600">{t('delivery.customer_phone')}</span>
                            <span className="font-bold text-gray-800 mr-2" dir="ltr">{order.phone}</span>
                          </div>
                        )}
                        {order.deliveryPersonPhone && (
                          <div className="bg-white bg-opacity-50 rounded p-2">
                            <span className="text-gray-600">{t('delivery.delivery_person_phone')}</span>
                            <span className="font-bold text-gray-800 mr-2" dir="ltr">{order.deliveryPersonPhone}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {order.orderCode && (
                      <div className="mt-3 bg-white bg-opacity-70 rounded p-2 text-sm">
                        <span className="text-gray-600">{t('delivery.order_code')}</span>
                        <span className="font-mono font-bold text-gray-800 mr-2">{order.orderCode}</span>
                      </div>
                    )}

                    {order.extraNotes && (
                      <div className="mt-3 bg-white bg-opacity-70 rounded p-2 text-sm">
                        <span className="text-gray-600">{t('delivery.note')}</span>
                        <span className="text-gray-800 mr-2">{order.extraNotes}</span>
                      </div>
                    )}
                    
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <span>📅</span>
                      <span>{order.$createdAt ? new Date(order.$createdAt).toLocaleString('fa-IR') : ''}</span>
                    </div>

                    <div className="mt-3 flex justify-center">
                      <Link href="/delivery/orders">
                        <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg">
                          {t('delivery.view_details_and_deliver')}
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 text-right">
                <p className="text-sm text-gray-700">
                  💡 <span className="font-semibold">{t('delivery.reminder_title')}</span> {t('delivery.reminder_text')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Orders Card */}
        <main className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl shadow-2xl p-3 min-h-[60vh] max-h-[calc(100vh-200px)] overflow-hidden flex flex-col relative z-10">
          <div className="overflow-auto pr-2 flex flex-col gap-2 p-2">
            {loading ? (
              <div className="text-center text-white py-8">{t('delivery.loading_orders')}</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center text-white py-8">{t('delivery.no_pending')}</div>
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
                        {order.restaurantLocation === 'Self' ? 'سلف ' : (order.orderCode || order.$id?.slice(0, 8))}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.$createdAt && new Date(order.$createdAt).toLocaleDateString()} • {' '}
                        {order.$createdAt && new Date(order.$createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                      </div>
                    </div>
                    <div className="font-bold text-gray-800 text-sm">
                      {order.price.toLocaleString()} {t('delivery.toman')}
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
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2 text-sm text-gray-700">
                      <div><strong>{t('deliveries.pickup_from')}:</strong> {order.restaurantLocation} ({order.restaurantType})</div>
                      {order.restaurantLocation === 'Self' ? (
                        <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                          <div className="text-sm text-yellow-800">
                           
                            <span className="text-xs">{t('delivery.order_code_will_be_shown_after_acceptance')}</span>
                          </div>
                        </div>
                      ) : (
                        order.orderCode && <div><strong>{t('deliveries.order_code')}:</strong> {order.orderCode}</div>
                      )}
                      <div><strong>{t('deliveries.deliver_to')}:</strong> {order.deliveryLocation}</div>
                      {order.extraNotes && <div><strong>{t('deliveries.notes')}:</strong> {order.extraNotes}</div>}
                      <div><strong>{t('deliveries.price')}:</strong> {order.price.toLocaleString()} {t('delivery.toman')}</div>
                    </div>

                    <div className="flex justify-center mt-3">
                      <button
                        className="bg-gradient-to-b from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (order.$id) acceptOrder(order.$id)
                        }}
                      >
                        {t('delivery.accept_order')}
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