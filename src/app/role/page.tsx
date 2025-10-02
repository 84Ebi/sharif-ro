'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/useAuth'

export default function RolePage() {
  const router = useRouter()
  const { loading } = useAuth()

  const handleRoleSelect = (role: 'customer' | 'delivery') => {
    localStorage.setItem('userRole', role)
    router.push(`/${role}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Role</h1>
          <p className="text-gray-600">Select how you want to use the app</p>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect('customer')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            Customer
          </button>
          <button
            onClick={() => handleRoleSelect('delivery')}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            Delivery Person
          </button>
        </div>
      </div>
    </div>
  )
}