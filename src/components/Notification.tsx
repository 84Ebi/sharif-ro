'use client'

import { useNotification } from '@/contexts/NotificationContext'
import { useI18n } from '@/lib/i18n'

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification()
  const { t } = useI18n()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full" dir="rtl">
      {notifications.map((notification) => {
        const bgColors = {
          success: 'bg-green-500',
          error: 'bg-red-500',
          info: 'bg-blue-500',
          warning: 'bg-yellow-500',
        }
        
        const iconColors = {
          success: '✓',
          error: '✕',
          info: 'ℹ',
          warning: '⚠',
        }

        return (
          <div
            key={notification.id}
            className={`${bgColors[notification.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-3 animate-slide-in-right`}
            role="alert"
          >
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xl font-bold">{iconColors[notification.type]}</span>
              <p className="flex-1 text-sm font-medium">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-white hover:text-gray-200 transition-colors text-xl font-bold"
              aria-label={t('notification.close')}
            >
              ×
            </button>
          </div>
        )
      })}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

