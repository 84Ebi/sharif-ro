'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/useAuth'
import Image from 'next/image'

export default function RolePage() {
  const router = useRouter()
  const { loading } = useAuth()

  const handleRoleSelect = (role: 'customer' | 'delivery') => {
    localStorage.setItem('userRole', role)
    router.push(`/${role}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sharif-blue-dark to-sharif-blue-light">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sharif-blue-dark to-sharif-blue-light p-4">
      <div className="text-center">
        {/* Logo Section */}
        <div className="mb-10">
          <div className="flex justify-center mb-4">
            <Image 
              src="/logo-scooter.png" 
              alt="SharifRo Logo" 
              width={240} 
              height={240}
              priority
            />
          </div>
          <p className="text-white text-lg opacity-90">Choose Your Role</p>
        </div>

        {/* Choices Section */}
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12">
          {/* Customer - SharifGir */}
          <div
            onClick={() => handleRoleSelect('customer')}
            className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/20 w-64"
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 mb-5 flex items-center justify-center">
                <Image 
                  src="/sharifgir.jpg" 
                  alt="SharifGir Icon" 
                  width={96} 
                  height={96}
                  className="rounded-full"
                />
              </div>
              <h2 className="text-2xl font-bold text-white">SharifGir</h2>
              <p className="text-white/80 text-sm mt-2">Customer</p>
            </div>
          </div>

          {/* Delivery Person - SharifBar */}
          <div
            onClick={() => handleRoleSelect('delivery')}
            className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/20 w-64"
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 mb-5 flex items-center justify-center">
                <Image 
                  src="/sharifbar.png" 
                  alt="SharifBar Icon" 
                  width={96} 
                  height={96}
                  className="rounded-full"
                />
              </div>
              <h2 className="text-2xl font-bold text-white">SharifBar</h2>
              <p className="text-white/80 text-sm mt-2">Delivery Person</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}