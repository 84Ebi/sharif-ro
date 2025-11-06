'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createOrder } from '../../lib/orders'
import BottomDock from '../../components/BottomDock'

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
    fullName: '',
    deliveryLocation: '',
    phone: '',
    extraNotes: '',
    price: 0,
    needsContainer: true,
    needsUtensils: false,
    selectedDrink: '',
    cafeteria: '',
    deliveryFee: 0,
  })

  // Prices for container and utensils
  const containerPrice = 4000
  const utensilsPrice = 4000
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (restaurantFromUrl) {
      setForm(prev => ({ ...prev, restaurantLocation: restaurantFromUrl }))
    }
  }, [restaurantFromUrl])

  // Set default name from user
  useEffect(() => {
    if (user && !form.fullName) {
      setForm(prev => ({ ...prev, fullName: user.name }))
    }
  }, [user, form.fullName])

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
    if (isSelfOrder) {
      // Start with base items
      finalPrice = 0
      if (form.needsContainer) finalPrice += containerPrice
      if (form.needsUtensils) finalPrice += utensilsPrice
      
      // Add drink price
      if (form.selectedDrink) {
        const selectedDrinkItem = drinksAndAddons.find(d => d.name === form.selectedDrink)
        if (selectedDrinkItem) {
          finalPrice += selectedDrinkItem.price
        }
      }
      
      // Add delivery fee
      finalPrice += form.deliveryFee
    }
    
    // Build order details for Self orders
    let orderDetails = form.orderCode
    if (isSelfOrder) {
      const additions = []
      if (form.needsContainer) additions.push('ظرف')
      if (form.needsUtensils) additions.push('قاشق چنگال')
      if (form.selectedDrink) additions.push(`نوشیدنی: ${form.selectedDrink}`)
      if (form.cafeteria) additions.push(`سالن: ${form.cafeteria}`)
      
      if (additions.length > 0) {
        orderDetails += `\n\nموارد اضافی:\n${additions.join('\n')}`
      }
    }
    
    try {
      await createOrder({
        userId: user.$id,
        fullName: form.fullName || user.name,
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
                  placeholder="کد سفارش سلف "
                  value={form.orderCode}
                  onChange={e => setForm({ ...form, orderCode: e.target.value })}
                  required
                  className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
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
                  className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوشیدنی و افزودنی‌ها
                </label>
                <select
                  value={form.selectedDrink}
                  onChange={e => setForm({ ...form, selectedDrink: e.target.value })}
                  className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                >
                  <option value="">هیچکدام</option>
                  {drinksAndAddons.map(drink => (
                    <option key={drink.name} value={drink.name}>
                      {drink.name} - {drink.price.toLocaleString()} تومان
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">انتخاب سالن *</label>
                <select
                  value={form.cafeteria}
                  onChange={e => setForm({ ...form, cafeteria: e.target.value })}
                  required
                  className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                >
                  <option value="" disabled>سالن را انتخاب کنید</option>
                  <option value="سلف دختران">سلف دختران</option>
                  <option value="سلف پسران">سلف پسران</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  موارد اضافی
                </label>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="container"
                      checked={form.needsContainer}
                      disabled
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="container" className="text-sm text-gray-700 cursor-pointer">
                      ظرف
                    </label>
                  </div>
                  <span className="text-sm text-gray-600">{containerPrice.toLocaleString()} تومان</span>
                </div>
                <div className="flex items-center justify-between gap-2">
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
                  <span className="text-sm text-gray-600">{utensilsPrice.toLocaleString()} تومان</span>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isSelfOrder ? 'نام دریافت‌کننده *' : 'Your Name *'}
            </label>
            <input
              type="text"
              placeholder={isSelfOrder ? 'نام خود را وارد کنید' : 'Enter your name'}
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              required
              className={`w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isSelfOrder ? 'text-right' : ''}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            {isSelfOrder ? 'تلفن همراه *' : 'Your Phone Number *'}
            </label>
            <input
              type="tel"
              placeholder={isSelfOrder ? 'تلفن همراه خود را وارد کنید' : 'Enter your phone number'}
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              required
              className="w-full text-black p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        key={loc.name}
                        onClick={() => {
                          setForm({ ...form, deliveryLocation: loc.name, deliveryFee: loc.price })
                          setIsDropdownOpen(false)
                        }}
                        className="p-3 text-black hover:bg-blue-50 cursor-pointer text-right"
                      >
                        {loc.name} - {loc.price.toLocaleString()} تومان
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

          {!isSelfOrder && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                placeholder={'Order price'}
                value={form.price || ''}
                onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                required
                min="0"
                step="1000"
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
          )}

          {isSelfOrder && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">ظرف:</span>
                <span className="font-bold text-blue-600">{containerPrice.toLocaleString()} تومان</span>
              </div>
              {form.needsUtensils && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">قاشق چنگال:</span>
                  <span className="font-bold text-blue-600">{utensilsPrice.toLocaleString()} تومان</span>
                </div>
              )}
              {form.selectedDrink && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">نوشیدنی ({form.selectedDrink}):</span>
                  <span className="font-bold text-blue-600">
                    {(drinksAndAddons.find(d => d.name === form.selectedDrink)?.price || 0).toLocaleString()} تومان
                  </span>
                </div>
              )}
              {form.deliveryFee > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">هزینه ارسال:</span>
                  <span className="font-bold text-blue-600">{form.deliveryFee.toLocaleString()} تومان</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm border-t pt-2">
                <span className="text-gray-700 font-semibold">جمع کل:</span>
                <span className="font-bold text-blue-600">
                  {(
                    containerPrice + 
                    (form.needsUtensils ? utensilsPrice : 0) + 
                    (drinksAndAddons.find(d => d.name === form.selectedDrink)?.price || 0) + 
                    form.deliveryFee
                  ).toLocaleString()} تومان
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

      {isSelfOrder && (
        <div className="max-w-md mx-auto mt-4">
          <div className="bg-white rounded-lg shadow-md p-4 space-y-2 text-right">
            <h2 className="font-bold text-gray-800 mb-2">خلاصه سفارش</h2>
            <div className="text-sm text-gray-700">
              <div>کد سفارش: {form.orderCode || '-'}</div>
              <div>نام غذا: {form.orderName || '-'}</div>
              <div>سالن: {form.cafeteria || '-'}</div>
              <div>محل دریافت: {form.deliveryLocation || '-'}</div>
              <div>تلفن: {form.phone || '-'}</div>
              <div>موارد اضافی: {['ظرف', form.needsUtensils ? 'قاشق چنگال' : null, form.selectedDrink ? `نوشیدنی: ${form.selectedDrink}` : null].filter(Boolean).join('، ') || '-'}</div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t text-sm">
              <span className="text-gray-700 font-semibold">جمع پرداختی:</span>
              <span className="font-bold text-blue-600">
                {(
                  containerPrice + 
                  (form.needsUtensils ? utensilsPrice : 0) + 
                  (drinksAndAddons.find(d => d.name === form.selectedDrink)?.price || 0) + 
                  form.deliveryFee
                ).toLocaleString()} تومان
              </span>
            </div>
          </div>
        </div>
      )}

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