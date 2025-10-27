import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BottomDockProps {
  role: 'customer' | 'delivery'
}

export default function BottomDock({ role }: BottomDockProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className="fixed z-20 bottom-0 left-0 right-0 flex justify-center p-4" style={{pointerEvents: 'none'}}>
      <div className="flex justify-around items-center bg-white rounded-2xl shadow-lg border border-gray-200 p-3 gap-4" style={{maxWidth: '400px', width: '90%', pointerEvents: 'auto'}}>
        <Link href={role === 'customer' ? '/customer' : '/delivery'}>
          <div className={`flex flex-col items-center p-2 rounded-lg transition-all ${isActive(role === 'customer' ? '/customer' : '/delivery') ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </div>
        </Link>
        <Link href="/account">
          <div className={`flex flex-col items-center p-2 rounded-lg transition-all ${isActive('/account') ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1">Account</span>
          </div>
        </Link>
        {role === 'customer' ? (
          <Link href="/customer/shopping-cart">
            <div className={`flex flex-col items-center p-2 rounded-lg transition-all ${isActive('/customer/shopping-cart') ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span className="text-xs mt-1">Cart</span>
            </div>
          </Link>
        ) : (
          <Link href="/delivery/orders">
            <div className={`flex flex-col items-center p-2 rounded-lg transition-all ${isActive('/delivery/orders') ? 'bg-blue-100' : 'hover:bg-gray-100'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              <span className="text-xs mt-1">Orders List</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}