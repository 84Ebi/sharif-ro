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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0d47a1] to-[#bbdefb]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0d47a1] to-[#bbdefb]">
      <div className="text-center">
        {/* Logo Section */}
        <div className="mb-10">
          <div className="flex justify-center mb-4">
            <Image 
              src="/logo-scooter.png" 
              alt="SharifRo Logo" 
              width={320} 
              height={320}
              priority
            />
          </div>
          <p className="text-white text-lg opacity-90">Choose Your Role</p>
        </div>

        {/* Choices Section */}
        <div className="flex justify-center gap-20 flex-wrap">
          {/* Customer - SharifGir */}
          <div
            onClick={() => handleRoleSelect('customer')}
            className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-3xl cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-opacity-20 w-56"
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 mb-5 flex items-center justify-center">
                <Image 
                  src="/4537278.png" 
                  alt="SharifGir Icon" 
                  width={96} 
                  height={96}
                />
              </div>
              <h2 className="text-2xl font-bold text-[#001f3f]">SharifGir</h2>
              <p className="text-white text-sm mt-2 opacity-80">Customer</p>
            </div>
          </div>

          {/* Delivery Person - SharifBar */}
          <div
            onClick={() => handleRoleSelect('delivery')}
            className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-3xl cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-opacity-20 w-56"
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 mb-5 flex items-center justify-center">
                <Image 
                  src="/gift.png" 
                  alt="SharifBar Icon" 
                  width={96} 
                  height={96}
                />
              </div>
              <h2 className="text-2xl font-bold text-[#001f3f]">SharifBar</h2>
              <p className="text-white text-sm mt-2 opacity-80">Delivery Person</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}