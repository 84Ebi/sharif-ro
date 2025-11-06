'use client'

import Image from 'next/image'

interface OtherMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function OtherMenu({ isOpen, onClose }: OtherMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-gradient-to-r from-blue-900 to-blue-200 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white bg-opacity-95 p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <Image src="/other-icon.png" alt="Other" width={48} height={48} className="w-12 h-12 rounded-lg" />
            <h2 className="text-2xl font-bold text-gray-800">Other Services</h2>
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
        <div className="p-8 flex flex-col items-center justify-center space-y-4">
          <div className="text-6xl">🚧</div>
          <h3 className="text-2xl font-bold text-white text-center">Coming Soon!</h3>
          <p className="text-white text-center text-lg">
            This page is not working yet. We're working hard to bring you this service soon.
          </p>
          <p className="text-blue-100 text-center text-sm">
            Stay tuned for updates!
          </p>
        </div>

        {/* Footer */}
        <div className="bg-white bg-opacity-95 p-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
