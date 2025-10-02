'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/useAuth'

export default function OrderForm() {
  const { loading: authLoading } = useAuth()
  const [form, setForm] = useState({
    orderCode: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    instructions: '',
    cost: 0,
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Mock submission, redirect to waiting after 2 seconds
    setTimeout(() => {
      router.push('/waiting')
    }, 2000)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Order Food from Food Hall</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Food Hall Order Code"
          value={form.orderCode}
          onChange={e => setForm({ ...form, orderCode: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Delivery Address"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Delivery Instructions"
          value={form.instructions}
          onChange={e => setForm({ ...form, instructions: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Estimated Cost"
          value={form.cost}
          onChange={e => setForm({ ...form, cost: Number(e.target.value) })}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Order'}
        </button>
      </form>
    </div>
  )
}