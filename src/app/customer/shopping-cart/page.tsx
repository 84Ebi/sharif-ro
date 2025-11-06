'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createOrder, getOrdersByUser, Order } from '../../../lib/orders'
import BottomDock from '../../../components/BottomDock'
import { useI18n } from '@/lib/i18n'

interface MenuItem {
  name: string
  price: number
  category: string
  quantity: number
}

interface OrderData {
  items: MenuItem[]
  total: number
}

const deliveryLocations = [
  { name: 'دانشکده فیزیک', price: 20000 },
  { name: 'دانشکده علوم ریاضی', price: 20000 },
  { name: 'دانشکده شیمی', price: 25000 },
  { name: 'دانشکده مهندسی برق', price: 20000 },
  { name: 'دانشکده مهندسی انرژی', price: 30000 },
  { name: 'دانشکده مدیریت و اقتصاد', price: 30000 },
  { name: 'دانشکده مهندسی عمران', price: 25000 },
  { name: 'دانشکده مهندسی صنایع', price: 20000 },
  { name: 'دانشکده مهندسی شیمی و نفت', price: 15000 },
  { name: 'دانشکده مهندسی و علم مواد', price: 25000 },
  { name: 'دانشکده مهندسی مکانیک', price: 30000 },
  { name: 'دانشکده مهندسی کامپیوتر', price: 15000 },
  { name: 'دانشکده مهندسی هوا فضا', price: 30000 },
  { name: 'مدیریت تربیت بدنی', price: 30000 },
  { name: 'مرکز زبان‌ها و زبان‌شناسی', price: 10000 },
  { name: 'گروه فلسفه علم', price: 25000 },
  { name: 'مرکز معارف اسلامی و علوم انسانی', price: 10000 },
  { name: 'مرکز آموزش مهارت‌های مهندسی', price: 10000 },
  { name: 'خوابگاه احمدی روشن (پسران)', price: 45000 },
  { name: 'خوابگاه طرشت ۲ (پسران)', price: 50000 },
  { name: 'خوابگاه طرشت ۳(دختران)', price: 45000 },
  { name: 'ساختمان ابن سینا', price: 10000 },
  { name: 'تالار ها', price: 25000 },
  { name: 'ساختمان روستا ازاد (پارک علم و فناوری )', price: 20000 },
  { name: 'مسجد', price: 25000 },
  { name: 'ساختمان اموزش', price: 30000 },
  { name: 'امفی تئاتر', price: 25000 },
]

function ShoppingCartContent() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { t } = useI18n()

  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [deliveryLocation, setDeliveryLocation] = useState('')
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [extraNotes, setExtraNotes] = useState('')
  const [phone, setPhone] = useState('')
  const [discountCode, setDiscountCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pastOrders, setPastOrders] = useState<Order[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState('')

  useEffect(() => {
    const cartData = sessionStorage.getItem('shoppingCart')
    if (cartData) {
      try {
        const parsedData = JSON.parse(cartData)
        if (parsedData.items) {
          const itemsWithQuantity = parsedData.items.reduce((acc: MenuItem[], item: MenuItem) => {
            const existingItem = acc.find((i: MenuItem) => i.name === item.name)
            if (existingItem) {
              existingItem.quantity = (existingItem.quantity || 0) + 1
            } else {
              acc.push({ ...item, quantity: 1 })
            }
            return acc
          }, [])
          setOrderData({ ...parsedData, items: itemsWithQuantity })
        } else {
          setOrderData(parsedData)
        }
      } catch {
        setError(t('errors.invalid_cart_data'))
        sessionStorage.removeItem('shoppingCart')
      }
    }
  }, [])

  useEffect(() => {
    if (user) {
      setHistoryLoading(true)
      getOrdersByUser(user.$id)
        .then(setPastOrders)
        .catch(() => setHistoryError(t('errors.fetch_past_orders')))
        .finally(() => setHistoryLoading(false))
    }
  }, [user])

  // Set default phone from user account
  useEffect(() => {
    if (user && !phone) {
      const userPhone = user.prefs?.phone || ''
      setPhone(userPhone)
    }
  }, [user, phone])

  const updateCart = (newItems: MenuItem[]) => {
    const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const newOrderData = { items: newItems, total: newTotal }
    setOrderData(newOrderData)
    sessionStorage.setItem('shoppingCart', JSON.stringify(newOrderData))
  }

  const handleRemoveItem = (itemName: string) => {
    if (orderData) {
      const newItems = orderData.items.filter((item) => item.name !== itemName)
      updateCart(newItems)
    }
  }

  const handleQuantityChange = (itemName: string, newQuantity: number) => {
    if (orderData) {
      if (newQuantity <= 0) {
        handleRemoveItem(itemName)
        return
      }
      const newItems = orderData.items.map((item) =>
        item.name === itemName ? { ...item, quantity: newQuantity } : item,
      )
      updateCart(newItems)
    }
  }

  const handleSubmitOrder = async () => {
    if (!user) {
      setError('Please log in to place an order.')
      return
    }
    if (!orderData) {
      setError('Your shopping cart is empty.')
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
        .map(
          (item) =>
            `${item.name} (x${item.quantity}) - ${(
              item.price * item.quantity
            ).toLocaleString()} تومان`,
        )
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
        price: orderData.total,
        status: 'pending',
      })

      // Clear the cart and redirect
      sessionStorage.removeItem('shoppingCart')
      router.push('/customer')
      alert(t('order.success_submit'))
    } catch (err: unknown) {
      console.error('Order submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return <div className="text-center p-8 text-white">{t('customer.loading')}</div>
  }

  const finalPrice = orderData ? orderData.total + deliveryFee : deliveryFee

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-200 py-6 px-4 pb-24 text-black">
      <div className="max-w-md mx-auto space-y-6">
        {orderData && orderData.items.length > 0 ? (
          <div className="bg-white bg-opacity-95 rounded-2xl shadow-xl p-6 space-y-6">
            <header className="text-center">
              <h1 className="text-2xl font-bold text-gray-800">{t('cart.title')}</h1>
            </header>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Cart Items */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">اقلام سفارش</h2>
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.name, item.quantity - 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.name, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.name)}
                        className="ml-4 text-red-500"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    {(item.price * item.quantity).toLocaleString()} تومان
                  </p>
                </div>
              ))}
            </div>

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
                        key={loc.name}
                        onClick={() => {
                          setDeliveryLocation(loc.name)
                          setDeliveryFee(loc.price)
                          setIsDropdownOpen(false)
                        }}
                        className="p-3 hover:bg-blue-50 cursor-pointer text-right"
                      >
                        {loc.name} - {loc.price.toLocaleString()} تومان
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
        ) : (
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold text-white mb-6">{t('cart.empty_title')}</h1>
            <div className="bg-white bg-opacity-20 p-8 rounded-xl">
              <p className="text-white">{t('cart.empty_text')}</p>
            </div>
          </div>
        )}

        {/* Past Orders */}
        <div className="max-w-md mx-auto">
          <header className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">{t('cart.past_orders_title')}</h1>
          </header>
          {historyLoading && <div className="text-center text-white">{t('cart.loading_orders')}</div>}
          {historyError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">{historyError}</div>}
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
              !historyLoading && (
                <div className="text-center text-white bg-white bg-opacity-20 p-6 rounded-xl">
                  {t('cart.no_past_orders')}
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <BottomDock role="customer" />
    </div>
  )
}

export default function ShoppingCartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-200 text-center p-8 text-white">Loading Page...</div>}>
      <ShoppingCartContent />
    </Suspense>
  )
}
