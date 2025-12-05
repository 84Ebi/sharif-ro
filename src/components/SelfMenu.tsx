'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface SelfMenuProps {
  isOpen: boolean
  onClose: () => void
  onOrderSuccess: () => void
}

type SectionType = 'university_boys' | 'university_girls' | 'dorm_boys' | 'dorm_girls'
type MealType = 'lunch' | 'dinner'

export default function SelfMenu({ isOpen, onClose, onOrderSuccess }: SelfMenuProps) {
  const router = useRouter()
  const [selectedSection, setSelectedSection] = useState<SectionType>('university_boys')
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch')
  const [error, setError] = useState('')

  const sections = [
    { id: 'university_boys' as SectionType, label: 'سلف پسران دانشگاه', icon: '👨‍🎓' },
    { id: 'university_girls' as SectionType, label: 'سلف دختران دانشگاه', icon: '👩‍🎓' },
    { id: 'dorm_boys' as SectionType, label: 'سلف خوابگاه‌های پسران', icon: '🏘️' },
    { id: 'dorm_girls' as SectionType, label: 'سلف خوابگاه‌های دختران', icon: '🏘️' },
  ]

  const handleContinue = () => {
    // Construct a descriptive name for the item
    const sectionLabel = sections.find(s => s.id === selectedSection)?.label || 'سلف'
    const mealLabel = selectedMealType === 'lunch' ? 'ناهار' : 'شام'
    const itemName = `${sectionLabel} - ${mealLabel}`

    const orderData = {
      items: [{
        name: itemName,
        price: 0, // Price hidden/removed as requested
        category: mealLabel,
        quantity: 1
      }],
      total: 0,
      restaurantLocation: 'Self',
      restaurantType: 'Self',
      cafeteriaType: selectedSection.includes('dorm') ? 'dormitory' : 'university',
      mealType: selectedMealType,
      section: selectedSection,
    }

    // Save to session storage
    sessionStorage.setItem('shoppingCart', JSON.stringify(orderData))

    // Navigate to the shopping cart
    router.push('/customer/shopping-cart')
    onOrderSuccess()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-gradient-to-r from-purple-900 to-purple-200 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white bg-opacity-95 p-4 flex items-center justify-between border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <Image src="/self.png" alt="سلف دانشگاه" width={48} height={48} className="w-12 h-12 rounded-lg" />
            <h2 className="text-2xl font-bold text-gray-800">سلف دانشگاه</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-3xl font-bold leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Section Tabs (Origin) */}
          <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-right">مبدا سفارش</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`p-3 rounded-lg border-2 font-semibold transition-all text-sm flex items-center justify-center ${
                    selectedSection === section.id
                      ? 'bg-purple-100 border-purple-500 text-purple-700'
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  <span className="mr-2 text-xl">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Meal Type Selection */}
          <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-right">نوع وعده</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedMealType('lunch')}
                className={`flex-1 p-4 rounded-lg border-2 font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedMealType === 'lunch'
                    ? 'bg-orange-100 border-orange-500 text-orange-700'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-orange-50'
                }`}
              >
                <span className="text-2xl">🍽️</span>
                <span>ناهار</span>
              </button>
              <button
                onClick={() => setSelectedMealType('dinner')}
                className={`flex-1 p-4 rounded-lg border-2 font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedMealType === 'dinner'
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-indigo-50'
                }`}
              >
                <span className="text-2xl">🌙</span>
                <span>شام</span>
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02]"
          >
            ادامه و ثبت سفارش
          </button>
        </div>
      </div>
    </div>
  )
}
