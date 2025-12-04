'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n'

export default function RoleSelectionPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { t } = useI18n()

  useEffect(() => {
    // Redirect to auth if not logged in
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  const handleRoleSelection = (role: string) => {
    // Save role to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRole', role.toLowerCase())
    }
    
    // Navigate to the respective dashboard
    router.push(`/${role.toLowerCase()}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#0d47a1] to-[#bbdefb] text-white">
        <p className="text-xl">{t('role.loading_user')}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#0d47a1] to-[#bbdefb] text-white">
        <p className="text-xl">{t('role.redirecting_login')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#0d47a1] to-[#bbdefb] text-white p-4">
      {/* Logo Section */}
      <div className="mb-10">
        <Image 
          src="/logo-scooter.png" 
          alt="SharifRo Logo" 
          width={220} 
          height={220}
          priority
        />
      </div>

      {/* Choices Section */}
      <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-20">
        {/* Delivery Person - SharifGir */}
        <div
          onClick={() => handleRoleSelection('customer')}
          className="bg-white/95 backdrop-blur-sm p-8 rounded-[20px] transition-all duration-300 cursor-pointer w-[220px] hover:scale-110 text-center"
        >
          <div className="flex justify-center mb-5">
            <Image 
              src="/sharifgir.jpg" 
              alt="SharifGir Icon" 
              width={100} 
              height={100}
            />
          </div>
          <h2 className="text-2xl font-bold text-[#001f3f]">{t('role.customer')}</h2>
        </div>

        {/* Customer - SharifBar */}
        <div
          onClick={() => handleRoleSelection('delivery')}
          className="bg-white/97 backdrop-blur-sm p-8 rounded-[20px] transition-all duration-300 cursor-pointer w-[220px] hover:scale-110 hover:bg-white/97 text-center"
        >
          <div className="flex justify-center mb-5">
            <Image 
              src="/sharifbar.png" 
              alt="SharifBar Icon" 
              width={100} 
              height={100}
            />
          </div>
          <h2 className="text-2xl font-bold text-[#001f3f]">{t('role.delivery')}</h2>
        </div>

        {/* Exchange - Sharif Exchange */}
        <div
          onClick={() => handleRoleSelection('exchange')}
          className="bg-white/97 backdrop-blur-sm p-8 rounded-[20px] transition-all duration-300 cursor-pointer w-[220px] hover:scale-110 hover:bg-white/97 text-center"
        >
          <div className="flex justify-center mb-5">
            <div className="w-[100px] h-[100px] bg-gray-200 rounded-full flex items-center justify-center text-4xl">🐼</div>
          </div>
          <h2 className="text-2xl font-bold text-[#001f3f]">{t('exchange.title')}</h2>
        </div>
      </div>
    </div>
  )
}