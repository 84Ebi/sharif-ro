'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { account } from '../../lib/appwrite'
import { Models } from 'appwrite'

export default function RoleSelectionPage() {
  const router = useRouter()
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await account.get()
        setUser(currentUser)
      } catch (error) {
        console.error('Authentication check failed:', error)
        router.push('/auth')
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [router])

  const handleRoleSelection = (role: string) => {
    // Here you would typically update user preferences or navigate
    // For now, we just navigate to the respective dashboard
    router.push(`/${role.toLowerCase()}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Loading user information...</p>
      </div>
    )
  }

  if (!user) {
    // This state should ideally not be reached due to the redirect in useEffect
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user.name}!</h1>
        <p className="text-lg text-gray-400">Please select your role to continue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
        <RoleCard
          title="Customer"
          description="Order from your favorite stores."
          onClick={() => handleRoleSelection('customer')}
        />
        <RoleCard
          title="Delivery"
          description="Deliver orders and earn money."
          onClick={() => handleRoleSelection('delivery')}
        />
        <RoleCard
          title="Courier"
          description="Manage and dispatch orders."
          onClick={() => handleRoleSelection('courier')}
        />
      </div>
    </div>
  )
}

interface RoleCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white/10 p-6 rounded-lg shadow-lg hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}