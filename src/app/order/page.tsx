'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createOrder } from '../../lib/orders'
import BottomDock from '../../components/BottomDock'

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

const drinksAndAddons = [
  { name: 'نوشابه کوکا', price: 20000 },
  { name: 'نوشابه زیرو', price: 20000 },
  { name: 'اسپرایت', price: 20000 },
  { name: 'دوغ', price: 15000 },
  { name: 'ماست', price: 15000 },
  { name: 'لیموناد', price: 25000 },
]

function OrderFormContent() {
  const { user, loading: authLoading } = useAuth()
  const searchParams = useSearchParams()
  const restaurantFromUrl = searchParams.get('restaurant') || ''
  const isSelfOrder = restaurantFromUrl === 'Self'
  
  const [form, setForm] = useState({
    restaurantLocation: restaurantFromUrl,
    restaurantType: '',
    orderCode: '',
    orderName: '',
    deliveryLocation: '',
    phone: '',
    extraNotes: '',
    price: 0,
    needsContainer: false,
    needsUtensils: false,
    selectedDrink: '',
  })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (restaurantFromUrl) {
      setForm(prev => ({ ...prev, restaurantLocation: restaurantFromUrl }))
    }
  }, [restaurantFromUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (!user) {
      setError('User not authenticated')
      setLoading(false)
      return
    }

    // Calculate final price for Self orders
    let finalPrice = form.price
    if (isSelfOrder && form.selectedDrink) {
      const selectedDrinkItem = drinksAndAddons.find(d => d.name === form.selectedDrink)
      if (selectedDrinkItem) {
        finalPrice += selectedDrinkItem.price
      }
    }
    
    // Build order details for Self orders
    let orderDetails = form.orderCode
    if (isSelfOrder) {
      const additions = []
      if (form.needsContainer) additions.push('ظرف')
      if (form.needsUtensils) additions.push('قاشق چنگال')
      if (form.selectedDrink) additions.push(`نوشیدنی: ${form.selectedDrink}`)
      
      if (additions.length > 0) {
        orderDetails += `\n\nموارد اضافی:\n${additions.join('\n')}`
      }
    }
    
    try {
      await createOrder({
        userId: user.$id,
        fullName: user.name,
        restaurantLocation: isSelfOrder ? 'Self' : form.restaurantLocation,
        restaurantType: isSelfOrder ? form.orderName : form.restaurantType,
        orderCode: orderDetails || undefined,
        deliveryLocation: form.deliveryLocation,
        phone: form.phone,
        extraNotes: form.extraNotes || undefined,
        price: finalPrice,
        status: 'pending',
      })
      
      // Redirect to customer page to view order
      router.push('/customer')
      alert('سفارش شما با موفقیت ثبت شد!')
    } catch (err: unknown) {
      console.error('Order submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create order. Please try again.')
      setLoading(false)
    }
  }

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
        <div className="text-white text-xl">Please log in to place an order.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-200 py-8 px-4 pb-24">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          {isSelfOrder ? 'ثبت سفارش سلف سرویس' : 'Place Your Order'}
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSelfOrder && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Food Hall, West Campus"
                  value={form.restaurantLocation}
                  onChange={e => setForm({ ...form, restaurantLocation: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Type *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Fast Food, Pizza, Cafe"
                  value={form.restaurantType}
                  onChange={e => setForm({ ...form, restaurantType: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Food Hall Order Code"
                  value={form.orderCode}
                  onChange={e => setForm({ ...form, orderCode: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {isSelfOrder && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  کد سفارش *
                </label>
                <input
                  type="text"
                  placeholder="کد سفارش سلف سرویس"
                  value={form.orderCode}
                  onChange={e => setForm({ ...form, orderCode: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام غذا *
                </label>
                <input
                  type="text"
                  placeholder="نام غذا یا غذاها را وارد کنید"
                  value={form.orderName}
                  onChange={e => setForm({ ...form, orderName: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوشیدنی و افزودنی‌ها
                </label>
                <select
                  value={form.selectedDrink}
                  onChange={e => setForm({ ...form, selectedDrink: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                >
                  <option value="">هیچکدام</option>
                  {drinksAndAddons.map(drink => (
                    <option key={drink.name} value={drink.name}>
                      {drink.name} - {drink.price.toLocaleString()} تومان
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  موارد اضافی
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="container"
                    checked={form.needsContainer}
                    onChange={e => setForm({ ...form, needsContainer: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="container" className="text-sm text-gray-700 cursor-pointer">
                    ظرف
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="utensils"
                    checked={form.needsUtensils}
                    onChange={e => setForm({ ...form, needsUtensils: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="utensils" className="text-sm text-gray-700 cursor-pointer">
                    قاشق چنگال
                  </label>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={user.name}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              placeholder="Your phone number"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isSelfOrder ? 'محل دریافت سفارش *' : 'Delivery Address *'}
            </label>
            {isSelfOrder ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-3 border border-blue-500 rounded-lg bg-blue-50 text-right flex justify-between items-center"
                >
                  <span className="text-gray-700">{form.deliveryLocation || 'محل را انتخاب کنید'}</span>
                  <span>▼</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200">
                    {deliveryLocations.map((loc) => (
                      <div
                        key={loc}
                        onClick={() => {
                          setForm({ ...form, deliveryLocation: loc })
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
            ) : (
              <textarea
                placeholder="Your delivery address"
                value={form.deliveryLocation}
                onChange={e => setForm({ ...form, deliveryLocation: e.target.value })}
                required
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isSelfOrder ? 'توضیحات سفارش (اختیاری)' : 'Extra Notes (Optional)'}
            </label>
            <textarea
              placeholder={isSelfOrder ? 'توضیحات اضافی' : 'Any special instructions'}
              value={form.extraNotes}
              onChange={e => setForm({ ...form, extraNotes: e.target.value })}
              rows={2}
              className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isSelfOrder ? 'text-right' : ''}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isSelfOrder ? 'مبلغ (تومان) *' : 'Price *'}
            </label>
            <input
              type="number"
              placeholder={isSelfOrder ? 'مبلغ سفارش' : 'Order price'}
              value={form.price || ''}
              onChange={e => setForm({ ...form, price: Number(e.target.value) })}
              required
              min="0"
              step="1000"
              className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isSelfOrder ? 'text-right' : ''}`}
            />
          </div>

          {isSelfOrder && form.selectedDrink && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">مبلغ نهایی با نوشیدنی:</span>
                <span className="font-bold text-blue-600">
                  {(form.price + (drinksAndAddons.find(d => d.name === form.selectedDrink)?.price || 0)).toLocaleString()} تومان
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            {loading ? (isSelfOrder ? 'در حال ثبت...' : 'Submitting...') : (isSelfOrder ? 'ثبت سفارش' : 'Submit Order')}
          </button>
        </form>
      </div>

      <BottomDock role="customer" />
    </div>
  )
}

export default function OrderForm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-200">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <OrderFormContent />
    </Suspense>
  )
}