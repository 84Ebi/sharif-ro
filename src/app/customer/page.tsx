'use client'

import { useState } from 'react'
import { useAuth } from '../../lib/useAuth'
import { useRouter } from 'next/navigation'
import BottomDock from '../../components/BottomDock'
import SharifPlusMenu from '../../components/SharifPlusMenu'
import SharifFastFoodMenu from '../../components/SharifFastFoodMenu'

export default function CustomerHome() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [filterLocation, setFilterLocation] = useState('')
  const [minCost, setMinCost] = useState('')
  const [maxCost, setMaxCost] = useState('')
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false)
  const [isFastFoodMenuOpen, setIsFastFoodMenuOpen] = useState(false)

  const services = [
    { name: 'Sharif Plus', icon: '/delivery-icon.png', location: 'Sharif Plus' },
    { name: 'Sharif Fastfood', icon: '/shariffastfood.png', location: 'Sharif Fastfood' },
    { name: 'Self', icon: '/self.png', location: 'Self' },
    { name: 'Clean Food', icon: '/logo38668.jpeg', location: 'Clean Food' },
    { name: 'Other', icon: '/other-icon.png', location: 'Other' },
    { name: 'Kelana', icon: '/kelana-icon.png', location: 'Kelana' },
  ]

  const handleOrderClick = (location: string) => {
    if (location === 'Sharif Plus') {
      setIsPlusMenuOpen(true)
    } else if (location === 'Sharif Fastfood') {
      setIsFastFoodMenuOpen(true)
    } else {
      router.push(`/order?restaurant=${encodeURIComponent(location)}`)
    }
  }

  const handleOrderSuccess = () => {
    // Show success message or redirect
    alert('Order submitted successfully!')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-200">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-200">
        <div className="text-white text-xl">Redirecting to login...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-200 py-6 px-4 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo-scooter.png" alt="SharifRo Logo" className="w-16 h-auto" />
          </div>

          {/* Filter Pill */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white bg-opacity-10 border border-white border-opacity-10 text-white hover:bg-opacity-20 transition-all group cursor-pointer">
            <span className="font-bold text-sm">Filters</span>
            <div className="hidden group-hover:flex group-focus-within:flex items-center gap-2">
              <input
                type="text"
                placeholder="Location"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white text-gray-800 text-sm outline-none w-32"
              />
              <input
                type="number"
                placeholder="Min"
                value={minCost}
                onChange={(e) => setMinCost(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white text-gray-800 text-sm outline-none w-20"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxCost}
                onChange={(e) => setMaxCost(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white text-gray-800 text-sm outline-none w-20"
              />
            </div>
          </div>
        </header>

        {/* Services Grid */}
        <main className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-8">
          {services.map((service) => (
            <div
              key={service.name}
              onClick={() => handleOrderClick(service.location)}
              className="bg-white bg-opacity-95 rounded-xl p-6 text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className="flex flex-col items-center gap-3">
                <img
                  src={service.icon}
                  alt={service.name}
                  className="w-12 h-12 object-contain"
                />
                <span className="text-gray-800 font-semibold">{service.name}</span>
                <button className="hidden group-hover:block bg-gradient-to-b from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:from-blue-600 hover:to-blue-700">
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </main>
      </div>

      <BottomDock role="customer" />
      
      {/* Sharif Plus Menu Popup */}
      <SharifPlusMenu 
        isOpen={isPlusMenuOpen} 
        onClose={() => setIsPlusMenuOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Sharif Fast Food Menu Popup */}
      <SharifFastFoodMenu 
        isOpen={isFastFoodMenuOpen} 
        onClose={() => setIsFastFoodMenuOpen(false)}
      />
    </div>
  )
}