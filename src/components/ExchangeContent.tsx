'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import BottomDock from './BottomDock'
import { useI18n } from '@/lib/i18n'
import { useNotification } from '@/contexts/NotificationContext'

interface ExchangeListing {
  $id: string
  userId: string
  userName: string
  userCardNumber: string
  itemType: string
  itemName: string
  description?: string
  price: number
  status: 'active' | 'sold' | 'cancelled' | 'flagged' | 'expired' | 'pending_payment'
  buyerId?: string
  flagCount: number
  codeValue?: string
  expiresAt: string
  paymentConfirmedAt?: string
  $createdAt: string
}

export default function ExchangeContent({ initialTab }: { initialTab?: 'buy' | 'sell' | 'history' }) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = initialTab || (searchParams.get('tab') as 'buy' | 'sell' | 'history') || 'buy'
  const { t } = useI18n()
  const { showNotification } = useNotification()
  
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'history'>(defaultTab)
  const [listings, setListings] = useState<ExchangeListing[]>([])
  const [myListings, setMyListings] = useState<ExchangeListing[]>([])
  const [myPurchases, setMyPurchases] = useState<ExchangeListing[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Create Listing State
  const [newItemName, setNewItemName] = useState('')
  const [newItemCode, setNewItemCode] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [newItemDesc, setNewItemDesc] = useState('')
  const [sellerCardNumber, setSellerCardNumber] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  
  // Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null)
  const [reportReason, setReportReason] = useState('')

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedPaymentListing, setSelectedPaymentListing] = useState<ExchangeListing | null>(null)

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true)
      // Fetch active listings for Buy tab
      const res = await fetch('/api/exchange/listings?status=active')
      const data = await res.json()
      
      if (data.listings) {
        // Filter out my own listings from Buy tab
        setListings(data.listings.filter((l: ExchangeListing) => l.userId !== user?.$id))
        
        // Fetch my listings (active, sold, etc)
        if (user) {
          const myRes = await fetch(`/api/exchange/listings?userId=${user.$id}&status=all`)
          const myData = await myRes.json()
          if (myData.listings) {
             setMyListings(myData.listings)
          }

          // Fetch my purchases
          const purchaseRes = await fetch(`/api/exchange/listings?buyerId=${user.$id}&status=all`)
          const purchaseData = await purchaseRes.json()
          if (purchaseData.listings) {
            setMyPurchases(purchaseData.listings)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
      showNotification(t('exchange.loading_error'), 'error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [user, t, showNotification])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
    } else if (user) {
      fetchListings()
    }
  }, [user, authLoading, router, fetchListings])

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!newItemName || !newItemCode || !newItemPrice || !sellerCardNumber) {
      showNotification(t('exchange.required_fields'), 'error')
      return
    }

    const price = parseFloat(newItemPrice)
    if (isNaN(price) || price <= 0 || price > 60000) {
      showNotification(t('exchange.price_error'), 'error')
      return
    }

    try {
      setCreateLoading(true)
      const res = await fetch('/api/exchange/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.$id,
          userName: user.name,
          userCardNumber: sellerCardNumber,
          itemType: 'code',
          itemName: newItemName,
          description: newItemDesc,
          price: price,
          codeValue: newItemCode
        })
      })

      const data = await res.json()
      if (res.ok) {
        showNotification(t('exchange.create_success'), 'success')
        setNewItemName('')
        setNewItemCode('')
        setNewItemPrice('')
        setNewItemDesc('')
        // Refresh listings
        fetchListings()
        setActiveTab('sell') // Stay on sell tab to see it
      } else {
        showNotification(data.error || t('exchange.create_error'), 'error')
      }
    } catch (error) {
      console.error('Error creating listing:', error)
      showNotification(t('exchange.create_error'), 'error')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleBuyClick = (listing: ExchangeListing) => {
    setSelectedPaymentListing(listing)
    setPaymentModalOpen(true)
  }

  const handleConfirmPaid = async () => {
    if (!selectedPaymentListing || !user) return

    try {
      const res = await fetch(`/api/exchange/listings/${selectedPaymentListing.$id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'purchase',
          buyerId: user.$id
        })
      })

      if (res.ok) {
        showNotification('درخواست خرید ثبت شد. منتظر تأیید فروشنده باشید.', 'success')
        setPaymentModalOpen(false)
        setSelectedPaymentListing(null)
        fetchListings()
      } else {
        const data = await res.json()
        showNotification(data.error || 'خطا در ثبت خرید', 'error')
      }
    } catch (error) {
      console.error('Error buying listing:', error)
      showNotification('خطا در ثبت خرید', 'error')
    }
  }

  const handleConfirmReceipt = async (listingId: string) => {
    if (!user) return

    try {
      const res = await fetch(`/api/exchange/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'confirm_payment',
          sellerId: user.$id
        })
      })

      if (res.ok) {
        showNotification('فروش با موفقیت تأیید شد', 'success')
        fetchListings()
      } else {
        const data = await res.json()
        showNotification(data.error || 'خطا در تأیید فروش', 'error')
      }
    } catch (error) {
      console.error('Error confirming receipt:', error)
      showNotification('خطا در تأیید فروش', 'error')
    }
  }

  const handleReport = async () => {
    if (!selectedListingId || !reportReason) return

    try {
      const res = await fetch(`/api/exchange/listings/${selectedListingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'flag',
          reason: reportReason
        })
      })

      if (res.ok) {
        showNotification('گزارش شما ثبت شد', 'success')
        setReportModalOpen(false)
        setReportReason('')
        setSelectedListingId(null)
        fetchListings()
      } else {
        showNotification('خطا در ثبت گزارش', 'error')
      }
    } catch (error) {
      console.error('Error reporting listing:', error)
      showNotification('خطا در ثبت گزارش', 'error')
    }
  }

  const handleCancelListing = async (listingId: string) => {
    if (!user) return
    if (!confirm('آیا از حذف این آگهی اطمینان دارید؟')) return

    try {
      const res = await fetch(`/api/exchange/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
          userId: user.$id
        })
      })

      if (res.ok) {
        showNotification('آگهی لغو شد', 'success')
        fetchListings()
      } else {
        showNotification('خطا در لغو آگهی', 'error')
      }
    } catch (error) {
      console.error('Error cancelling listing:', error)
      showNotification('خطا در لغو آگهی', 'error')
    }
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            {/* Panda Icon Placeholder */}
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-2xl">🐼</div>
            <h1 className="text-xl font-bold text-gray-800">{t('exchange.title')}</h1>
          </div>
          <button 
            onClick={() => { setRefreshing(true); fetchListings(); }} 
            className={`p-2 rounded-full hover:bg-gray-100 ${refreshing ? 'animate-spin' : ''}`}
          >
            🔄
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Tabs - Only show Buy/Sell if not in history mode */}
        {initialTab !== 'history' ? (
          <div className="flex bg-white rounded-xl p-1 shadow-sm mb-6">
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'buy' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t('exchange.buy')}
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'sell' 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t('exchange.sell')}
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">داد و ستد های من</h2>
            <div className="flex bg-white rounded-xl p-1 shadow-sm">
               <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'history' 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                خریدها
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'sell' 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                فروش‌ها
              </button>
            </div>
          </div>
        )}

        {/* Buy Tab Content */}
        {activeTab === 'buy' && initialTab !== 'history' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">{t('exchange.loading')}</div>
            ) : listings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">{t('exchange.no_listings')}</div>
            ) : (
              listings.map((listing) => (
                <div key={listing.$id} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{listing.itemName}</h3>
                      <p className="text-sm text-gray-500">{listing.userName}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {listing.itemType}
                    </span>
                  </div>
                  
                  {listing.description && (
                    <p className="text-gray-600 text-sm mb-3 bg-gray-50 p-2 rounded">
                      {listing.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-lg font-bold text-blue-600">
                      {listing.price.toLocaleString()} {t('delivery.toman')}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedListingId(listing.$id)
                          setReportModalOpen(true)
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title={t('exchange.report')}
                      >
                        🚩
                      </button>
                      <button
                        onClick={() => handleBuyClick(listing)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        {t('exchange.buy_code')}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Sell Tab Content */}
        {activeTab === 'sell' && (
          <div className="space-y-6">
            {/* Create Listing Form - Only show if NOT in history mode */}
            {initialTab !== 'history' && (
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">{t('exchange.create_listing')}</h2>
              <form onSubmit={handleCreateListing} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('exchange.item_name')}</label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="مثال: کد تخفیف اسنپ فود"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('exchange.code_value')}</label>
                  <input
                    type="text"
                    value={newItemCode}
                    onChange={(e) => setNewItemCode(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-mono text-left"
                    placeholder="CODE123"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('exchange.price')}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="0"
                      max="60000"
                    />
                    <span className="absolute left-3 top-2 text-gray-500 text-sm">{t('delivery.toman')}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t('exchange.max_price')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('exchange.card_number')}</label>
                  <input
                    type="text"
                    value={sellerCardNumber}
                    onChange={(e) => setSellerCardNumber(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none font-mono text-left"
                    placeholder="0000-0000-0000-0000"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('exchange.description')}</label>
                  <textarea
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    rows={2}
                  />
                </div>

                <button
                  type="submit"
                  disabled={createLoading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md disabled:opacity-50"
                >
                  {createLoading ? t('exchange.loading') : t('exchange.submit_listing')}
                </button>
              </form>
            </div>
            )}

            {/* My Listings */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">آگهی‌های من</h3>
              <div className="space-y-3">
                {myListings.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">شما هنوز آگهی ثبت نکرده‌اید</p>
                ) : (
                  myListings.map((listing) => (
                    <div key={listing.$id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-800">{listing.itemName}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          listing.status === 'active' ? 'bg-green-100 text-green-800' :
                          (listing.status === 'sold' && !listing.paymentConfirmedAt) ? 'bg-yellow-100 text-yellow-800' :
                          listing.status === 'sold' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {listing.status === 'sold' && !listing.paymentConfirmedAt 
                            ? t('exchange.status.pending_payment') 
                            : t(`exchange.status.${listing.status}`)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                        <span>{listing.price.toLocaleString()} {t('delivery.toman')}</span>
                        <span>{new Date(listing.$createdAt).toLocaleDateString('fa-IR')}</span>
                      </div>
                      
                      {listing.status === 'active' && (
                        <button
                          onClick={() => handleCancelListing(listing.$id)}
                          className="w-full py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm"
                        >
                          {t('exchange.cancel')}
                        </button>
                      )}

                      {(listing.status === 'pending_payment' || (listing.status === 'sold' && !listing.paymentConfirmedAt)) && (
                        <div className="space-y-2">
                          <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-800">
                            خریدار اعلام پرداخت کرده است. لطفاً حساب خود را چک کنید.
                          </div>
                          <button
                            onClick={() => handleConfirmReceipt(listing.$id)}
                            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-bold"
                          >
                            {t('exchange.confirm_payment')}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Tab Content */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {myPurchases.length === 0 ? (
              <div className="text-center py-8 text-gray-500">شما هنوز خریدی انجام نداده‌اید</div>
            ) : (
              myPurchases.map((listing) => (
                <div key={listing.$id} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{listing.itemName}</h3>
                      <p className="text-sm text-gray-500">فروشنده: {listing.userName}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      listing.paymentConfirmedAt ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {listing.paymentConfirmedAt ? 'تحویل شده' : 'در انتظار تأیید فروشنده'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="text-lg font-bold text-blue-600">
                      {listing.price.toLocaleString()} {t('delivery.toman')}
                    </div>
                  </div>

                  {listing.paymentConfirmedAt ? (
                    <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800 mb-1 font-bold">کد خریداری شده:</p>
                      <p className="font-mono text-xl text-center select-all dir-ltr">{listing.codeValue}</p>
                    </div>
                  ) : (
                    <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-sm text-yellow-800">
                      <p>منتظر تأیید پرداخت توسط فروشنده باشید. پس از تأیید، کد در اینجا نمایش داده می‌شود.</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <BottomDock role="exchange" />

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">{t('exchange.report')}</h3>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
              placeholder={t('exchange.report_reason')}
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setReportModalOpen(false)}
                className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
              >
                {t('exchange.cancel')}
              </button>
              <button
                onClick={handleReport}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {t('exchange.submit_report')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModalOpen && selectedPaymentListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4 text-center">اطلاعات پرداخت</h3>
            
            <div className="bg-blue-50 p-4 rounded-xl mb-6 text-center">
              <p className="text-sm text-gray-600 mb-2">{t('exchange.seller_card')}</p>
              <p className="text-xl font-mono font-bold text-blue-800 dir-ltr select-all">
                {selectedPaymentListing.userCardNumber}
              </p>
              <p className="text-sm text-gray-500 mt-2">{selectedPaymentListing.userName}</p>
            </div>

            <div className="text-center mb-6">
              <p className="text-gray-600 mb-1">مبلغ قابل پرداخت</p>
              <p className="text-2xl font-bold text-gray-800">
                {selectedPaymentListing.price.toLocaleString()} {t('delivery.toman')}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleConfirmPaid}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg transition-all"
              >
                {t('exchange.i_paid')}
              </button>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="w-full py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
              >
                {t('exchange.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
