'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ServiceOrder() {
  const [form, setForm] = useState({
    serviceType: '',
    description: '',
    name: '',
    phone: '',
    email: '',
    address: '',
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
      <h1 className="text-2xl mb-4">Order Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={form.serviceType}
          onChange={e => setForm({ ...form, serviceType: e.target.value })}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Service Type</option>
          <option value="courier">Courier</option>
          <option value="repair">Repair</option>
          <option value="cleaning">Cleaning</option>
          <option value="other">Other</option>
        </select>
        <textarea
          placeholder="Service Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
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
          placeholder="Address"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
          required
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
          {loading ? 'Submitting...' : 'Submit Service Order'}
        </button>
      </form>
    </div>
  )
}