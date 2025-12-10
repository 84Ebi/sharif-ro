'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function IOSInstallGuide() {
  const router = useRouter()
  const [showGuide, setShowGuide] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true

    // Only show guide if iOS and NOT in standalone mode
    if (isIOSDevice && !isStandalone) {
      setShowGuide(true)
    } else if (!isIOSDevice || isStandalone) {
      // Redirect to home if not iOS or already installed
      router.push('/customer')
    }
  }, [router])

  if (!showGuide || !isIOS) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-center">
          <div className="flex justify-center mb-4">
            <Image 
              src="/gift.png" 
              alt="SharifRo Logo" 
              width={80} 
              height={80} 
              className="w-20 h-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">خوش آمدید به شریف‌رو</h1>
          <p className="text-blue-100 text-sm">برای تجربه بهتر، اپلیکیشن را نصب کنید</p>
        </div>

        {/* Guide Content */}
        <div className="p-6 space-y-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">نصب اپلیکیشن</h2>
            <p className="text-gray-600 text-sm">
              با نصب اپلیکیشن، دسترسی سریع‌تر و راحت‌تر به سرویس‌های شریف‌رو خواهید داشت
            </p>
          </div>

          {/* Step 1 */}
          <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-2">دکمه Share را بزنید</h3>
              <p className="text-sm text-gray-600 mb-3">
                در پایین صفحه Safari، دکمه Share (مربعی با فلش به بالا) را پیدا کرده و بزنید
              </p>
              <div className="flex justify-center bg-white rounded-lg p-3">
                <div className="text-4xl">
                  <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4 bg-green-50 rounded-xl p-4">
            <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-2">گزینه "Add to Home Screen" را انتخاب کنید</h3>
              <p className="text-sm text-gray-600 mb-3">
                در منوی باز شده، به دنبال گزینه "Add to Home Screen" بگردید و آن را انتخاب کنید
              </p>
              <div className="flex justify-center bg-white rounded-lg p-3">
                <div className="text-center">
                  <div className="text-4xl mb-2">➕</div>
                  <p className="text-xs text-gray-600 font-semibold">Add to Home Screen</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4 bg-purple-50 rounded-xl p-4">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-2">روی "Add" کلیک کنید</h3>
              <p className="text-sm text-gray-600">
                در پنجره بعدی، دکمه "Add" را بزنید تا آیکون اپلیکیشن به صفحه اصلی گوشی شما اضافه شود
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mt-6">
            <h3 className="font-bold text-gray-800 mb-3 text-center">مزایای نصب اپلیکیشن</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>دسترسی سریع از صفحه اصلی گوشی</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>تجربه استفاده مانند یک اپلیکیشن واقعی</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>نمایش تمام صفحه بدون نوار مرورگر</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>سرعت بیشتر و عملکرد بهتر</span>
              </li>
            </ul>
          </div>

          {/* Skip Button */}
          <button
            onClick={() => router.push('/customer')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
          >
            فعلاً رد شو، بعداً نصب می‌کنم
          </button>
        </div>
      </div>
    </div>
  )
}
