'use client'

import { useI18n } from '@/lib/i18n'

interface PolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PolicyModal({ isOpen, onClose }: PolicyModalProps) {
  const { t, locale } = useI18n()

  if (!isOpen) return null

  const policyContent = locale === 'fa' 
    ? t('policy.content_fa')
    : t('policy.content_en')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir={locale === 'fa' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">{t('policy.title')}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
            aria-label={t('policy.close')}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="whitespace-pre-line text-gray-700 leading-relaxed">
            {policyContent}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t('policy.close')}
          </button>
        </div>
      </div>
    </div>
  )
}

