'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createOrder } from '../../lib/orders'
import BottomDock from '../../components/BottomDock'

function OrderFormContent() {
  const { user, loading: authLoading } = useAuth()
  const searchParams = useSearchParams()
  const restaurantFromUrl = searchParams.get('restaurant') || ''
  
  const [form, setForm] = useState({
    restaurantLocation: restaurantFromUrl,
    restaurantType: '',
    orderCode: '',
    deliveryLocation: '',
    phone: '',
    extraNotes: '',
    price: 0,
  })
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
    
    try {
      await createOrder({
        userId: user.$id,
        fullName: user.name,
        restaurantLocation: form.restaurantLocation,
        restaurantType: form.restaurantType,
        orderCode: form.orderCode || undefined,
        deliveryLocation: form.deliveryLocation,
        phone: form.phone,
        extraNotes: form.extraNotes || undefined,
        price: form.price,
        status: 'pending',
      })
      
      // Redirect to customer page to view order
      router.push('/customer')
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
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Place Your Order</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address *
            </label>
            <textarea
              placeholder="Your delivery address"
              value={form.deliveryLocation}
              onChange={e => setForm({ ...form, deliveryLocation: e.target.value })}
              required
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Extra Notes (Optional)
            </label>
            <textarea
              placeholder="Any special instructions"
              value={form.extraNotes}
              onChange={e => setForm({ ...form, extraNotes: e.target.value })}
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="number"
              placeholder="Order price"
              value={form.price || ''}
              onChange={e => setForm({ ...form, price: Number(e.target.value) })}
              required
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            {loading ? 'Submitting...' : 'Submit Order'}
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