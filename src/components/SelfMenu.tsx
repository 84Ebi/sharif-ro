'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface MenuItem {
  name: string
  price: number
  category: string
}

interface SelfMenuProps {
  isOpen: boolean
  onClose: () => void
  onOrderSuccess: () => void
}

type SectionType = 'university_boys' | 'university_girls' | 'dorm_boys' | 'dorm_girls'
type MealType = 'lunch' | 'dinner'
type DeliveryMethod = 'pickup_at_dorm' | 'delivery_to_university'

export default function SelfMenu({ isOpen, onClose, onOrderSuccess }: SelfMenuProps) {
  const router = useRouter()
  // const { t } = useI18n() // Unused
  const [selectedSection, setSelectedSection] = useState<SectionType>('university_boys')
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch')
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup_at_dorm')
  const [dormCode, setDormCode] = useState('')
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Menu data for university cafeteria
  const universityMenuData = [
    {
      category: 'ناهار',
      items: [
        { name: 'ناهار سلف دانشگاه', price: 20000, category: 'ناهار' },
      ],
    },
  ]

  const dinnerMenuData = [
    {
      category: 'شام',
      items: [
        { name: 'شام سلف', price: 15000, category: 'شام' },
      ],
    },
  ]

  const sections = [
    { id: 'university_boys' as SectionType, label: 'سلف پسران دانشگاه', icon: '👨‍🎓' },
    { id: 'university_girls' as SectionType, label: 'سلف دختران دانشگاه', icon: '👩‍🎓' },
    { id: 'dorm_boys' as SectionType, label: 'سلف خوابگاه‌های پسران', icon: '🏘️' },
    { id: 'dorm_girls' as SectionType, label: 'سلف خوابگاه‌های دختران', icon: '🏘️' },
  ]

  const isDormSection = selectedSection === 'dorm_boys' || selectedSection === 'dorm_girls'
  const currentMenuData = selectedMealType === 'dinner' ? dinnerMenuData : universityMenuData

  const toggleItem = (item: MenuItem) => {
    const exists = selectedItems.find(
      (i) => i.name === item.name && i.category === item.category
    )

    if (exists) {
      setSelectedItems(selectedItems.filter((i) => !(i.name === item.name && i.category === item.category)))
    } else {
      // Only allow one meal selection
      setSelectedItems([item])
    }
  }

  const isItemSelected = (itemName: string, category: string) => {
    return selectedItems.some((i) => i.name === itemName && i.category === category)
  }

  const calculateTotal = () => {
    if (selectedMealType === 'dinner' && deliveryMethod === 'pickup_at_dorm') {
      return 15000
    } else if (selectedMealType === 'dinner' && deliveryMethod === 'delivery_to_university') {
      // Will add delivery fee in shopping cart based on location
      return selectedItems.reduce((sum, item) => sum + item.price, 0)
    }
    return selectedItems.reduce((sum, item) => sum + item.price, 0)
  }

  const handleProceedToOrder = () => {
    if (selectedItems.length === 0) {
      setError('لطفاً حداقل یک مورد انتخاب کنید.')
      return
    }

    if (selectedMealType === 'dinner' && !dormCode.trim()) {
      setError('لطفاً کد خوابگاه خود را وارد کنید.')
      return
    }

    setLoading(true)

    const orderData = {
      items: selectedItems,
      total: calculateTotal(),
      restaurantLocation: 'سلف دانشگاه',
      cafeteriaType: isDormSection ? 'dormitory' : 'university',
      mealType: selectedMealType,
      dormCode: selectedMealType === 'dinner' ? dormCode : undefined,
      deliveryMethod: selectedMealType === 'dinner' ? deliveryMethod : undefined,
      section: selectedSection,
    }

    // Save to session storage
    sessionStorage.setItem('shoppingCart', JSON.stringify(orderData))

    // Navigate to the order completion page
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
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Section Tabs */}
          <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-right">بخش سالن</h3>
            <div className="grid grid-cols-2 gap-3">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`p-3 rounded-lg border-2 font-semibold transition-all text-sm ${
                    selectedSection === section.id
                      ? 'bg-purple-100 border-purple-500 text-purple-700'
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
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
                onClick={() => {
                  setSelectedMealType('lunch')
                  setSelectedItems([])
                }}
                className={`flex-1 p-4 rounded-lg border-2 font-semibold transition-all ${
                  selectedMealType === 'lunch'
                    ? 'bg-orange-100 border-orange-500 text-orange-700'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-orange-50'
                }`}
              >
                🍽️ ناهار
              </button>
              <button
                onClick={() => {
                  setSelectedMealType('dinner')
                  setSelectedItems([])
                }}
                className={`flex-1 p-4 rounded-lg border-2 font-semibold transition-all ${
                  selectedMealType === 'dinner'
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-indigo-50'
                }`}
              >
                🌙 شام
              </button>
            </div>
          </div>

          {/* Dinner Delivery Method (only for dinner) */}
          {selectedMealType === 'dinner' && (
            <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-right">روش تحویل شام</h3>
              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'pickup_at_dorm'
                      ? 'bg-green-100 border-green-500'
                      : 'bg-gray-50 border-gray-300 hover:bg-green-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="pickup_at_dorm"
                      checked={deliveryMethod === 'pickup_at_dorm'}
                      onChange={() => setDeliveryMethod('pickup_at_dorm')}
                      className="w-5 h-5"
                    />
                    <span className="font-semibold text-gray-800">تحویل در خوابگاه</span>
                  </div>
                  <span className="text-green-600 font-bold">۱۵,۰۰۰ تومان</span>
                </label>
                <label
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'delivery_to_university'
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-gray-50 border-gray-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="delivery_to_university"
                      checked={deliveryMethod === 'delivery_to_university'}
                      onChange={() => setDeliveryMethod('delivery_to_university')}
                      className="w-5 h-5"
                    />
                    <span className="font-semibold text-gray-800">تحویل در دانشگاه</span>
                  </div>
                  <span className="text-blue-600 font-bold text-sm">بر اساس مقصد</span>
                </label>
              </div>
            </div>
          )}

          {/* Dorm Code Input (only for dinner) */}
          {selectedMealType === 'dinner' && (
            <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-right">کد خوابگاه</h3>
              <input
                type="text"
                value={dormCode}
                onChange={(e) => setDormCode(e.target.value)}
                placeholder="کد خوابگاه خود را وارد کنید"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-right"
              />
              <p className="text-sm text-gray-500 mt-2 text-right">
                برای دریافت شام، کد خوابگاه الزامی است
              </p>
            </div>
          )}

          {/* Menu Items */}
          <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-right border-b pb-2">
              {selectedMealType === 'dinner' ? 'منوی شام' : 'منوی ناهار'}
            </h3>
            <div className="space-y-2">
              {currentMenuData.map((section) =>
                section.items.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => toggleItem(item)}
                    className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all border ${
                      isItemSelected(item.name, item.category)
                        ? 'bg-purple-100 border-purple-500 shadow-md'
                        : 'bg-gray-50 border-gray-200 hover:bg-purple-50'
                    }`}
                  >
                    <span className="text-gray-800 font-medium">{item.name}</span>
                    <span className="text-purple-600 font-bold">
                      {selectedMealType === 'dinner' && deliveryMethod === 'pickup_at_dorm'
                        ? '۱۵,۰۰۰ تومان'
                        : `${item.price.toLocaleString()} تومان`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer with Total and Submit */}
        {selectedItems.length > 0 && (
          <div className="bg-white bg-opacity-95 p-4 border-t">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-purple-600">جمع کل:</span>
              <span className="text-2xl font-bold text-gray-800">
                {calculateTotal().toLocaleString()} تومان
              </span>
            </div>
            {selectedMealType === 'dinner' && dormCode && (
              <div className="text-sm text-gray-600 mb-3 text-right">
                کد خوابگاه: ****{dormCode.slice(-4)}
              </div>
            )}
            <button
              onClick={handleProceedToOrder}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
            >
              {loading ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
            </button>
          </div>
        )}

        {selectedItems.length === 0 && (
          <div className="bg-white bg-opacity-95 p-4 border-t text-center text-gray-500">
            {selectedMealType === 'dinner' ? 'وعده شام را انتخاب کنید' : 'وعده ناهار را انتخاب کنید'}
          </div>
        )}
      </div>
    </div>
  )
}
