'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface MenuItem {
  name: string
  price: number
  category: string
}

interface DormCafeteriaMenuProps {
  isOpen: boolean
  onClose: () => void
  onOrderSuccess: () => void
}

export default function DormCafeteriaMenu({ isOpen, onClose, onOrderSuccess }: DormCafeteriaMenuProps) {
  const router = useRouter()
  // const { t } = useI18n() // Unused
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | ''>('')
  const [isThursdayLunchTime, setIsThursdayLunchTime] = useState(false)

  // Check if it's Thursday lunch time (11:30 AM - 1:50 PM)
  useEffect(() => {
    const checkTime = () => {
      const now = new Date()
      const day = now.getDay()
      const hours = now.getHours()
      const minutes = now.getMinutes()

      // Thursday is day 4
      const isThursday = day === 4
      
      // Check time range: 11:30 AM - 1:50 PM (11:30 - 13:50)
      const isValidTime = 
        (hours === 11 && minutes >= 30) || 
        (hours === 12) || 
        (hours === 13 && minutes <= 50)

      setIsThursdayLunchTime(isThursday && isValidTime)
    }

    checkTime()
    const interval = setInterval(checkTime, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  // Load gender from sessionStorage
  useEffect(() => {
    if (isOpen) {
      const savedGender = sessionStorage.getItem('cafeteriaGender')
      if (savedGender === 'male' || savedGender === 'female') {
        setSelectedGender(savedGender)
      }
    }
  }, [isOpen])

  // Save gender to sessionStorage when changed
  const handleGenderChange = (gender: 'male' | 'female') => {
    setSelectedGender(gender)
    sessionStorage.setItem('cafeteriaGender', gender)
  }

  // Menu data for Thursday lunch (15,000 Toman)
  // const thursdayLunchMenu = [ // Unused
  //   {
  //     category: 'ناهار پنجشنبه',
  //     items: [
  //       { name: 'ناهار سلف', price: 15000, category: 'ناهار پنجشنبه' },
  //     ],
  //   },
  // ]

  // Get filtered dorms based on gender
  const getAvailableDorms = () => {
    if (selectedGender === 'male') {
      return [
        { name: 'خوابگاه احمدی', category: 'سلف خوابگاه پسران' },
        { name: 'خوابگاه طرشت ۲', category: 'سلف خوابگاه پسران' },
      ]
    } else if (selectedGender === 'female') {
      return [
        { name: 'خوابگاه طرشت ۳', category: 'سلف خوابگاه دختران' },
      ]
    }
    return []
  }

  const toggleItem = (item: MenuItem) => {
    const exists = selectedItems.find(
      (i) => i.name === item.name && i.category === item.category
    )

    if (exists) {
      setSelectedItems(selectedItems.filter((i) => !(i.name === item.name && i.category === item.category)))
    } else {
      setSelectedItems([...selectedItems, item])
    }
  }

  const isItemSelected = (itemName: string, category: string) => {
    return selectedItems.some((i) => i.name === itemName && i.category === category)
  }

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.price, 0)
  }

  const handleProceedToOrder = () => {
    if (selectedItems.length === 0) {
      setError('لطفاً حداقل یک مورد انتخاب کنید.')
      return
    }

    if (!selectedGender) {
      setError('لطفاً جنسیت خود را انتخاب کنید.')
      return
    }

    setLoading(true)

    const orderData = {
      items: selectedItems,
      total: calculateTotal(),
      restaurantLocation: 'سلف خوابگاه',
      cafeteriaType: 'dormitory',
      mealType: 'lunch',
      dayOfWeek: new Date().getDay(),
    }

    // Save to session storage
    sessionStorage.setItem('shoppingCart', JSON.stringify(orderData))

    // Navigate to the order completion page
    router.push('/customer/shopping-cart')
    onOrderSuccess()
    onClose()
  }

  if (!isOpen) return null

  // Show error modal if not Thursday lunch time
  if (!isThursdayLunchTime) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4" onClick={onClose}>
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">زمان سفارش سلف خوابگاه</h2>
            <p className="text-gray-600 mb-4 text-lg leading-relaxed">
              سلف خوابگاه فقط پنجشنبه‌ها از ساعت ۱۱:۳۰ تا ۱۳:۵۰ فعال است.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-gradient-to-r from-green-900 to-green-200 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white bg-opacity-95 p-4 flex items-center justify-between border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <Image src="/self.png" alt="سلف خوابگاه" width={48} height={48} className="w-12 h-12 rounded-lg" />
            <h2 className="text-2xl font-bold text-gray-800">سلف خوابگاه - ناهار پنجشنبه</h2>
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

          {/* Gender Selection */}
          <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-right">انتخاب جنسیت</h3>
            <div className="flex gap-4">
              <button
                onClick={() => handleGenderChange('male')}
                className={`flex-1 p-4 rounded-lg border-2 font-semibold transition-all ${
                  selectedGender === 'male'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-blue-50'
                }`}
              >
                پسران
              </button>
              <button
                onClick={() => handleGenderChange('female')}
                className={`flex-1 p-4 rounded-lg border-2 font-semibold transition-all ${
                  selectedGender === 'female'
                    ? 'bg-pink-100 border-pink-500 text-pink-700'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-pink-50'
                }`}
              >
                دختران
              </button>
            </div>
          </div>

          {/* Dorm Selection */}
          {selectedGender && (
            <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-right">انتخاب خوابگاه</h3>
              <div className="space-y-2">
                {getAvailableDorms().map((dorm) => (
                  <div
                    key={dorm.name}
                    onClick={() => toggleItem({ name: dorm.name, price: 15000, category: dorm.category })}
                    className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all border ${
                      isItemSelected(dorm.name, dorm.category)
                        ? 'bg-green-100 border-green-500 shadow-md'
                        : 'bg-gray-50 border-gray-200 hover:bg-green-50'
                    }`}
                  >
                    <span className="text-gray-800 font-medium">{dorm.name}</span>
                    <span className="text-green-600 font-bold">
                      ۱۵,۰۰۰ تومان
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-right border-b pb-2">
              منوی ناهار پنجشنبه
            </h3>
            <div className="text-gray-600 text-sm mb-2">
              قیمت ناهار در محل خوابگاه: ۱۵,۰۰۰ تومان
            </div>
          </div>
        </div>

        {/* Footer with Total and Submit */}
        {selectedItems.length > 0 && (
          <div className="bg-white bg-opacity-95 p-4 border-t">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-green-600">جمع کل:</span>
              <span className="text-2xl font-bold text-gray-800">
                {calculateTotal().toLocaleString()} تومان
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-3 text-right">
              خوابگاه انتخابی: {selectedItems[0]?.name}
            </div>
            <button
              onClick={handleProceedToOrder}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
            >
              {loading ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
            </button>
          </div>
        )}

        {selectedItems.length === 0 && (
          <div className="bg-white bg-opacity-95 p-4 border-t text-center text-gray-500">
            {selectedGender ? 'خوابگاه خود را انتخاب کنید' : 'ابتدا جنسیت خود را انتخاب کنید'}
          </div>
        )}
      </div>
    </div>
  )
}
