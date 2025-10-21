'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createOrder, getOrdersByUser, Order } from '../../../lib/orders'
import BottomDock from '../../../components/BottomDock'

interface MenuItem {
  name: string
  price: number
  category: string
}

interface OrderData {
  items: MenuItem[]
  total: number
}

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

function OrderCompletionContent() {
  const { user, loading: authLoading } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [pastOrders, setPastOrders] = useState<Order[]>([])
  const [pageMode, setPageMode] = useState<'loading' | 'completion' | 'history'>('loading')

  const [deliveryLocation, setDeliveryLocation] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [extraNotes, setExtraNotes] = useState('')
  const [phone, setPhone] = useState('')
  const [discountCode, setDiscountCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const orderQuery = searchParams.get('order')
    if (orderQuery) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(orderQuery))
        setOrderData(parsedData)
        setPageMode('completion')
      } catch {
        setError('Invalid order data.')
        setPageMode('history') // Fallback to history
      }
    } else {
      // No order in query, so fetch past orders
      setPageMode('history')
    }
  }, [searchParams])

  useEffect(() => {
    if (pageMode === 'history' && user) {
      setLoading(true)
      getOrdersByUser(user.$id)
        .then(setPastOrders)
        .catch(() => setError('Failed to fetch past orders.'))
        .finally(() => setLoading(false))
    }
  }, [pageMode, user])

  const handleSubmitOrder = async () => {
    if (!user) {
      setError('Please log in to place an order.')
      return
    }
    if (!orderData) {
      setError('No order data found.')
      return
    }
    if (!deliveryLocation) {
      setError('Please select a delivery location.')
      return
    }
    if (!phone) {
      setError('Please enter a phone number.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const orderItemsText = orderData.items
        .map((item) => `${item.name} (${item.category}) - ${item.price.toLocaleString()} تومان`)
        .join('\n')

      await createOrder({
        userId: user.$id,
        fullName: user.name,
        restaurantLocation: 'Sharif Plus',
        restaurantType: 'Sharif Plus Menu',
        orderCode: orderItemsText,
        deliveryLocation: deliveryLocation,
        phone: phone,
        extraNotes: extraNotes || undefined,
        price: orderData.total, // You might want to add delivery fee or apply discount here
        status: 'pending',
      })

      router.push('/customer')
      alert('Your order has been placed successfully!')
    } catch (err: unknown) {
      console.error('Order submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || pageMode === 'loading') {
    return <div className="text-center p-8 text-white">Loading...</div>
  }

  if (pageMode === 'history') {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-200 py-6 px-4 pb-24">
        <div className="max-w-md mx-auto">
          <header className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">My Past Orders</h1>
          </header>
          {loading && <div className="text-center text-white">Loading orders...</div>}
          {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}
          <div className="space-y-4">
            {pastOrders.length > 0 ? (
              pastOrders.map((order) => (
                <div key={order.$id} className="bg-white bg-opacity-95 rounded-xl shadow-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-800">{order.restaurantLocation}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                      order.status === 'confirmed' ? 'bg-blue-200 text-blue-800' :
                      'bg-green-200 text-green-800'
                    }`}>{order.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 whitespace-pre-wrap">{order.orderCode}</p>
                  <div className="text-right font-bold text-blue-600">{order.price.toLocaleString()} تومان</div>
                </div>
              ))
            ) : (
              <div className="text-center text-white bg-white bg-opacity-20 p-6 rounded-xl">
                You have no past orders.
              </div>
            )}
          </div>
        </div>
        <BottomDock role="customer" />
      </div>
    )
  }

  if (!orderData) {
    // This case should ideally not be hit if logic is correct, but as a fallback:
    router.push('/customer'); // Redirect if no order data and not in history mode
    return <div className="text-center p-8 text-white">Redirecting...</div>;
  }

  const deliveryFee = 15000
  const finalPrice = orderData.total + deliveryFee

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-200 py-6 px-4 pb-24">
      <div className="max-w-md mx-auto bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 space-y-6">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">سبد خرید</h1>
        </header>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Delivery Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            انتخاب محل دریافت سفارش
          </label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-3 border border-blue-500 rounded-lg bg-blue-50 text-right flex justify-between items-center"
            >
              <span>{deliveryLocation || 'محل را انتخاب کنید'}</span>
              <span>▼</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200">
                {deliveryLocations.map((loc) => (
                  <div
                    key={loc}
                    onClick={() => {
                      setDeliveryLocation(loc)
                      setIsDropdownOpen(false)
                    }}
                    className="p-3 hover:bg-blue-50 cursor-pointer text-right"
                  >
                    {loc}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Notes and Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات سفارش</label>
          <textarea
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
            rows={2}
            placeholder="اگر سفارش‌تان نیاز به توضیحات دارد اینجا بنویسید."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">شماره تلفن</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            placeholder="شماره تلفن خود را وارد کنید"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">کد تخفیف</label>
          <input
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            type="text"
            placeholder="کد تخفیف خود را وارد کنید"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Order Summary */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">خلاصه سفارش</h2>
          <div className="flex justify-between text-gray-700">
            <span>جمع سفارش ({orderData.items.length})</span>
            <span>{orderData.total.toLocaleString()} تومان</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>هزینه ارسال</span>
            <span>{deliveryFee.toLocaleString()} تومان</span>
          </div>
          <div className="flex justify-between font-bold text-xl text-gray-800 pt-2 border-t">
            <span>مبلغ قابل پرداخت</span>
            <span>{finalPrice.toLocaleString()} تومان</span>
          </div>
        </div>

        <button
          onClick={handleSubmitOrder}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
        >
          {loading ? 'در حال ثبت سفارش...' : 'ثبت نهایی سفارش'}
        </button>
      </div>
      <BottomDock role="customer" />
    </div>
  )
}

export default function MyOrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-200 text-center p-8 text-white">Loading Page...</div>}>
      <OrderCompletionContent />
    </Suspense>
  )
}
