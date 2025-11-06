'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n'

interface KelanaMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function KelanaMenu({ isOpen, onClose }: KelanaMenuProps) {
  const router = useRouter()
  const { t } = useI18n()

  const handleOrderOnline = () => {
    window.open('https://cluna.app', '_blank')
  }

  const handleSubmitDeliveryRequest = () => {
    onClose()
    router.push('/order?restaurant=Kelana')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-8 " onClick={onClose}>
      <div
        className="bg-gradient-to-r from-blue-900 to-blue-200 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white bg-opacity-95 p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <Image src="/kelana-icon.png" alt="Kelana" width={48} height={48} className="w-12 h-12 rounded-lg" />
            <h2 className="text-2xl font-bold text-gray-800">{t('kelana.title')}</h2>
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
        <div className="p-6 space-y-2">
          <div className="bg-white bg-opacity-90 rounded-xl p-4 text-center space-y-4">
            <div className="text-5xl">🍽️</div>
            <h3 className="text-xl font-bold text-gray-800">{t('kelana.order_online_title')}</h3>
            <p className="text-gray-700 text-right leading-relaxed">
              {t('kelana.order_online_text')}
            </p>
            
            <button
              onClick={handleOrderOnline}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white p-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
            >
              {t('kelana.order_online_button')}
            </button>
          </div>

          <div className="bg-white bg-opacity-90 rounded-xl p-4 text-center space-y-3">
            <p className="text-gray-700 text-sm text-right">
              {t('kelana.after_order_text')}
            </p>
            <button
              onClick={handleSubmitDeliveryRequest}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              {t('kelana.submit_delivery')}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white bg-opacity-95 p-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 p-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            {t('kelana.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
