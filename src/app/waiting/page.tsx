'use client'

import { useState, useEffect } from 'react'

export default function Waiting() {
  const [status, setStatus] = useState('Order placed successfully!')
  const [timeLeft, setTimeLeft] = useState(30) // minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0)
    }, 60000) // update every minute
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <h1 className="text-2xl mb-4">{status}</h1>
      <p className="mb-2">Estimated waiting time: {timeLeft} minutes</p>
      <p>Status: Processing your order...</p>
      <p className="mt-4 text-sm text-gray-600">You will be notified once a delivery person accepts your order.</p>
      <button
        onClick={() => {
          alert('Order cancelled')
          window.location.href = '/customer'
        }}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Cancel Order
      </button>
    </div>
  )
}