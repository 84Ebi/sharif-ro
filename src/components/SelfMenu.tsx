'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface SelfMenuProps {
  isOpen: boolean
  onClose: () => void
  onOrderSuccess: () => void
}

type GenderType = 'male' | 'female'
type MealType = 'lunch' | 'dinner'
type LunchLocationType = 'kaleh_central' | 'kaleh_north' | 'self_hall' | 'kaleh_hall'
type DinnerDormType = 'ahmadi' | 'tarasht2' | 'tarasht3'

export default function SelfMenu({ isOpen, onClose, onOrderSuccess }: SelfMenuProps) {
  const router = useRouter()
  const [gender, setGender] = useState<GenderType>('male')
  const [mealType, setMealType] = useState<MealType>('lunch')
  const [lunchLocation, setLunchLocation] = useState<LunchLocationType>('kaleh_central')
  const [dinnerDorm, setDinnerDorm] = useState<DinnerDormType>('ahmadi')

  // Check if it's Thursday or Friday
  const dayOfWeek = new Date().getDay()
  const isThursday = dayOfWeek === 4
  const isFriday = dayOfWeek === 5

  // Meal options based on day
  const getMealOptions = () => {
    if (isFriday) {
      return [{ value: 'lunch' as MealType, label: 'ناهار', disabled: true }]
    }
    return [
      { value: 'lunch' as MealType, label: 'ناهار', disabled: false },
      { value: 'dinner' as MealType, label: 'شام', disabled: false }
    ]
  }

  const lunchLocations = [
    { value: 'kaleh_central' as LunchLocationType, label: 'بیرون بر کاله مرکزی', icon: '🏢' },
    { value: 'kaleh_north' as LunchLocationType, label: 'بیرون بر کاله شمالی', icon: '🏢' },
    { value: 'self_hall' as LunchLocationType, label: 'سالن سلف', icon: '🍽️' },
    { value: 'kaleh_hall' as LunchLocationType, label: 'سالن کاله', icon: '🍽️' }
  ]

  const dinnerDorms = [
    { value: 'ahmadi' as DinnerDormType, label: 'خوابگاه احمدی روشن', icon: '🏘️' },
    { value: 'tarasht2' as DinnerDormType, label: 'خوابگاه طرشت ۲', icon: '🏘️' },
    { value: 'tarasht3' as DinnerDormType, label: 'خوابگاه طرشت ۳', icon: '🏘️' }
  ]

  // Determine if current meal uses dorm rules
  const isDormMeal = mealType === 'dinner' || (mealType === 'lunch' && isThursday)

  // Calculate packaging fee
  const getPackagingFee = () => {
    if (isDormMeal) return 0
    if (lunchLocation === 'self_hall' || lunchLocation === 'kaleh_hall') {
      return 7000
    }
    return 0
  }

  const handleContinue = () => {
    let locationLabel = ''
    let locationType = ''
    
    if (isDormMeal) {
      const dorm = dinnerDorms.find(d => d.value === dinnerDorm)
      locationLabel = dorm?.label || ''
      locationType = dinnerDorm
    } else {
      const location = lunchLocations.find(l => l.value === lunchLocation)
      locationLabel = location?.label || ''
      locationType = lunchLocation
    }

    const mealLabel = mealType === 'lunch' ? 'ناهار' : 'شام'
    const genderLabel = gender === 'male' ? 'پسران' : 'دختران'
    const dayLabel = isThursday && mealType === 'lunch' ? 'پنجشنبه' : ''
    
    const itemName = `سلف - ${mealLabel} ${dayLabel} - ${genderLabel} - ${locationLabel}`

    const orderData = {
      items: [{
        name: itemName,
        price: 0,
        category: mealLabel,
        quantity: 1
      }],
      total: 0,
      restaurantLocation: 'Self',
      restaurantType: 'Self',
      selfMealType: mealType,
      selfGender: gender,
      selfLocation: locationType,
      selfIsDormMeal: isDormMeal,
      selfPackagingFee: getPackagingFee(),
      selfIsThursdayLunch: isThursday && mealType === 'lunch'
    }

    sessionStorage.setItem('shoppingCart', JSON.stringify(orderData))
    router.push('/customer/shopping-cart')
    onOrderSuccess()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4" onClick={onClose}>
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
          {isFriday && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-center">
              روز جمعه سرویس سلف دانشگاه غیرفعال است
            </div>
          )}

          {/* Gender Selection */}
          <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-right">جنسیت</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setGender('male')}
                disabled={isFriday}
                className={`flex-1 p-4 rounded-lg border-2 font-semibold transition-all flex items-center justify-center gap-2 ${
                  gender === 'male'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-blue-50'
                } ${isFriday ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="text-2xl">👨</span>
                <span>پسران</span>
              </button>
              <button
                onClick={() => setGender('female')}
                disabled={isFriday}
                className={`flex-1 p-4 rounded-lg border-2 font-semibold transition-all flex items-center justify-center gap-2 ${
                  gender === 'female'
                    ? 'bg-pink-100 border-pink-500 text-pink-700'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-pink-50'
                } ${isFriday ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="text-2xl">👩</span>
                <span>دختران</span>
              </button>
            </div>
          </div>

          {/* Meal Type Selection */}
          <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-right">نوع وعده</h3>
            <div className="flex gap-4">
              {getMealOptions().map(option => (
                <button
                  key={option.value}
                  onClick={() => !option.disabled && setMealType(option.value)}
                  disabled={option.disabled}
                  className={`flex-1 p-4 rounded-lg border-2 font-semibold transition-all flex items-center justify-center gap-2 ${
                    mealType === option.value
                      ? option.value === 'lunch'
                        ? 'bg-orange-100 border-orange-500 text-orange-700'
                        : 'bg-indigo-100 border-indigo-500 text-indigo-700'
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-orange-50'
                  } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="text-2xl">{option.value === 'lunch' ? '🍽️' : '🌙'}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
            {isThursday && mealType === 'lunch' && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                📌 ناهار پنجشنبه مانند قوانین شام است
              </div>
            )}
          </div>

          {/* Location/Dorm Selection */}
          {!isDormMeal ? (
            <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-right">محل دریافت ناهار</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lunchLocations.map(location => (
                  <button
                    key={location.value}
                    onClick={() => setLunchLocation(location.value)}
                    disabled={isFriday}
                    className={`p-3 rounded-lg border-2 font-semibold transition-all text-sm flex items-center justify-center gap-2 ${
                      lunchLocation === location.value
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-green-50'
                    } ${isFriday ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-xl">{location.icon}</span>
                    {location.label}
                  </button>
                ))}
              </div>
              {(lunchLocation === 'self_hall' || lunchLocation === 'kaleh_hall') && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded text-sm text-amber-800">
                  💰 هزینه بسته‌بندی: ۷,۰۰۰ تومان
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-right">
                خوابگاه {mealType === 'dinner' ? 'شام' : 'ناهار پنجشنبه'}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {dinnerDorms.map(dorm => (
                  <button
                    key={dorm.value}
                    onClick={() => setDinnerDorm(dorm.value)}
                    disabled={isFriday}
                    className={`p-3 rounded-lg border-2 font-semibold transition-all text-sm flex items-center justify-center gap-2 ${
                      dinnerDorm === dorm.value
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-purple-50'
                    } ${isFriday ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-xl">{dorm.icon}</span>
                    {dorm.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                💡 در صفحه سبد خرید، محل دریافت را انتخاب کنید:
                <br />• اگر در خوابگاه: ۱۵,۰۰۰ تومان
                <br />• اگر در دانشگاه: هزینه مسیر خوابگاه به دانشگاه + ۱۰,۰۰۰ تومان
              </div>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={isFriday}
            className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform ${
              isFriday 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:from-purple-700 hover:to-indigo-700 hover:scale-[1.02]'
            }`}
          >
            ادامه و ثبت سفارش
          </button>
        </div>
      </div>
    </div>
  )
}
