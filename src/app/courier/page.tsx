'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CourierOrder() {
  const [form, setForm] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    packageDescription: '',
    name: '',
    phone: '',
    email: '',
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

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Courier Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Pickup Address"
          value={form.pickupAddress}
          onChange={e => setForm({ ...form, pickupAddress: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Delivery Address"
          value={form.deliveryAddress}
          onChange={e => setForm({ ...form, deliveryAddress: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Package Description"
          value={form.packageDescription}
          onChange={e => setForm({ ...form, packageDescription: e.target.value })}
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
          {loading ? 'Submitting...' : 'Submit Courier Order'}
        </button>
      </form>
    </div>
  )
}