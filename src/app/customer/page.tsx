'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '../../lib/useAuth'
import { useState } from 'react'

export default function CustomerPage() {
  const router = useRouter()
  const { loading } = useAuth()
  const [filterExpanded, setFilterExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [minCost, setMinCost] = useState('')
  const [maxCost, setMaxCost] = useState('')

  const services = [
    { 
      id: 'plus', 
      name: 'Sharif Plus', 
      icon: '/delivery-icon.png', 
      route: '/order',
      description: 'Fast delivery for packages',
      color: 'white'
    },
    { 
      id: 'fastfood', 
      name: 'Sharif Fastfood', 
      icon: '/shariffastfood.png', 
      route: '/order',
      description: 'Hot meals delivered quick',
      color: 'white'
    },
    { 
      id: 'self', 
      name: 'Self Service', 
      icon: '/4537278.png', 
      route: '/courier',
      description: 'Pick up your own orders',
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'clean', 
      name: 'Clean Food', 
      icon: '/logo38668.jpeg', 
      route: '/grocery',
      description: 'Fresh & healthy groceries',
      color: 'from-[#b22930] to-[#b22930]'
    },
    { 
      id: 'other', 
      name: 'Other Services', 
      icon: '/other-icon.png', 
      route: '/service',
      description: 'Various delivery options',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'kelana', 
      name: 'Kelana', 
      icon: '/kelana-icon.png', 
      route: '/courier',
      description: 'Long distance delivery',
      color: 'from-[#86be45] to-[#86be45]'
    },
  ]

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0d47a1] to-[#bbdefb]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-[#0d47a1] to-[#bbdefb] text-white p-4 sm:p-[18px]">
      {/* Top Bar */}
      <header className="w-full max-w-[920px] mb-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo-scooter.png" 
              alt="SharifRo Logo" 
              width={164} 
              height={164}
              className="object-contain w-16 h-16 "
              priority
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">SharifGir</h1>
              <p className="text-xs sm:text-sm text-white/80">Your delivery partner</p>
            </div>
          </div>
          
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search services..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-2xl border-none bg-white/95 text-[#02243a] text-sm outline-none shadow-lg placeholder:text-gray-400 focus:ring-2 focus:ring-white/50 transition-all"
          />
          <svg 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter Pill */}
        <div 
          className={`self-start relative inline-flex items-center gap-[10px] px-3 py-2 rounded-full bg-white/10 border border-white/20 cursor-pointer transition-all backdrop-blur-sm ${filterExpanded ? 'bg-white/20 w-auto px-[14px]' : 'w-[110px] justify-center'}`}
          onMouseEnter={() => setFilterExpanded(true)}
          onMouseLeave={() => setFilterExpanded(false)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-bold text-[13px]">Filters</span>
          {filterExpanded && (
            <div className="flex gap-2 items-center ml-2 animate-in fade-in slide-in-from-left-2 duration-200">
              <input 
                type="text" 
                placeholder="Location" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="px-[10px] py-2 rounded-[10px] border-none bg-white/95 text-[#02243a] text-[13px] min-w-[120px] outline-none shadow-lg"
              />
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Min $" 
                  value={minCost}
                  onChange={(e) => setMinCost(e.target.value)}
                  className="px-[10px] py-2 rounded-[10px] border-none bg-white/95 text-[#02243a] text-[13px] w-[72px] outline-none shadow-lg"
                />
                <input 
                  type="number" 
                  placeholder="Max $" 
                  value={maxCost}
                  onChange={(e) => setMaxCost(e.target.value)}
                  className="px-[10px] py-2 rounded-[10px] border-none bg-white/95 text-[#02243a] text-[13px] w-[72px] outline-none shadow-lg"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Services Grid */}
      <main className="w-full max-w-[920px] flex-1 mb-4">
        <h2 className="text-lg font-bold mb-4 px-2">Available Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
          {filteredServices.map((service, index) => (
            <div
              key={service.id}
              onClick={() => router.push(service.route)}
              className="bg-white/95 rounded-2xl p-4 sm:p-5 text-center transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-2xl group backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col items-center gap-3">
                {/* Icon with gradient background */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${service.color} p-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Image 
                    src={service.icon} 
                    alt={service.name}
                    width={48}
                    height={48}
                    className="object-contain w-full h-full"
                  />
                </div>
                
                {/* Service Name */}
                <div className="flex-1">
                  <h3 className="text-[#02243a] font-bold text-sm sm:text-base mb-1">{service.name}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-tight">{service.description}</p>
                </div>
                
                {/* Order Button */}
                <button className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#4f7bff] to-[#3b5fe6] text-white border-none px-4 py-2 rounded-xl cursor-pointer font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105">
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/80 text-lg">No services found matching &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="w-full max-w-[920px] flex justify-around gap-2 sm:gap-3 pt-3 pb-2">
        <button 
          onClick={() => router.push('/customer')}
          className="bg-white/95 rounded-xl sm:rounded-2xl border-none p-2 sm:p-[10px_14px] flex-1 flex flex-col sm:flex-row gap-1 sm:gap-2 items-center justify-center text-[#02243a] font-bold cursor-pointer shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6">
            <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11.5z" fill="#02243a"/>
          </svg>
          <span className="text-xs sm:text-sm">Home</span>
        </button>

        <button 
          onClick={() => router.push('/account')}
          className="bg-white/95 rounded-xl sm:rounded-2xl border-none p-2 sm:p-[10px_14px] flex-1 flex flex-col sm:flex-row gap-1 sm:gap-2 items-center justify-center text-[#02243a] font-bold cursor-pointer shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" fill="#02243a"/>
          </svg>
          <span className="text-xs sm:text-sm">Account</span>
        </button>

        <button 
          onClick={() => router.push('/order')}
          className="bg-gradient-to-r from-[#4f7bff] to-[#3b5fe6] rounded-xl sm:rounded-2xl border-none p-2 sm:p-[10px_14px] flex-1 flex flex-col sm:flex-row gap-1 sm:gap-2 items-center justify-center text-white font-bold cursor-pointer shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6">
            <path d="M12 4v16m8-8H4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-xs sm:text-sm">New Order</span>
        </button>
      </nav>
    </div>
  )
}