'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface MenuItem {
  name: string
  price: number
  category: string
}

interface SharifPlusMenuProps {
  isOpen: boolean
  onClose: () => void
  onOrderSuccess: () => void
}

export default function SharifPlusMenu({ isOpen, onClose, onOrderSuccess }: SharifPlusMenuProps) {
  const router = useRouter()
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const menuData = [
    {
      category: 'غذای ایرانی',
      items: [
        { name: 'املت', price: 75000, category: 'غذای ایرانی' },
        { name: 'سیب و اسفناج', price: 75000, category: 'غذای ایرانی' },
        { name: 'گوشت و قارچ', price: 65000, category: 'غذای ایرانی' },
        { name: 'صبحانه', price: 65000, category: 'غذای ایرانی' },
        { name: 'خوراک لوبیا چیتی', price: 75000, category: 'غذای ایرانی' },
        { name: 'خوراک عدس', price: 75000, category: 'غذای ایرانی' },
        { name: 'خوراک لوبیا سبز', price: 85000, category: 'غذای ایرانی' },
        { name: 'خوراک بادمجان', price: 120000, category: 'غذای ایرانی' },
        { name: 'خوراک کدو سبز', price: 120000, category: 'غذای ایرانی' },
        { name: 'خوراک سبزیجات', price: 120000, category: 'غذای ایرانی' },
        { name: 'خوراک مرغ و سبزیجات', price: 165000, category: 'غذای ایرانی' },
        { name: 'خوراک گوشت و سبزیجات', price: 220000, category: 'غذای ایرانی' },
        { name: 'کوبیده مرغ', price: 165000, category: 'غذای ایرانی' },
        { name: 'کوبیده گوشت', price: 240000, category: 'غذای ایرانی' },
        { name: 'کباب تابه ای', price: 260000, category: 'غذای ایرانی' },
        { name: 'خورشت قیمه', price: 260000, category: 'غذای ایرانی' },
        { name: 'خورشت قرمه سبزی', price: 260000, category: 'غذای ایرانی' },
        { name: 'خورشت فسنجان', price: 260000, category: 'غذای ایرانی' },
        { name: 'خورشت کرفس', price: 180000, category: 'غذای ایرانی' },
        { name: 'خورشت بامیه', price: 180000, category: 'غذای ایرانی' },
        { name: 'خورشت آلو', price: 180000, category: 'غذای ایرانی' },
        { name: 'خورشت سبزیجات', price: 170000, category: 'غذای ایرانی' },
        { name: 'کوفته سبزی', price: 180000, category: 'غذای ایرانی' },
      ],
    },
    {
      category: 'فست فود',
      items: [
        { name: 'سبزی', price: 285000, category: 'فست فود' },
        { name: 'سوسیس گوشت', price: 265000, category: 'فست فود' },
        { name: 'سوسیس مرغ', price: 250000, category: 'فست فود' },
        { name: 'مخلوط', price: 275000, category: 'فست فود' },
        { name: 'ساندویچ', price: 275000, category: 'فست فود' },
        { name: 'دوبل برگر', price: 275000, category: 'فست فود' },
        { name: 'رویال برگر', price: 250000, category: 'فست فود' },
        { name: 'اسنک گوشت', price: 230000, category: 'فست فود' },
        { name: 'اسنک مرغ', price: 230000, category: 'فست فود' },
        { name: 'پاستا پنه مرغ', price: 250000, category: 'فست فود' },
        { name: 'پاستا پنه گوشت', price: 275000, category: 'فست فود' },
        { name: 'پاستا آلفردو', price: 285000, category: 'فست فود' },
        { name: 'پاستا اسپشیال', price: 285000, category: 'فست فود' },
        { name: 'پیتزا سبزیجات', price: 399000, category: 'فست فود' },
        { name: 'پیتزا گوشت', price: 420000, category: 'فست فود' },
        { name: 'پیتزا مرغ', price: 370000, category: 'فست فود' },
        { name: 'پیتزا مخلوط', price: 420000, category: 'فست فود' },
        { name: 'پیتزا ساده', price: 85000, category: 'فست فود' },
        { name: 'پیتزا قارچ', price: 100000, category: 'فست فود' },
        { name: 'پیتزا سوسیس', price: 85000, category: 'فست فود' },
        { name: 'پیتزا کالباس', price: 140000, category: 'فست فود' },
        { name: 'پیتزا مخلوط ساده', price: 85000, category: 'فست فود' },
        { name: 'پیتزا مخلوط قارچ', price: 140000, category: 'فست فود' },
      ],
    },
    {
      category: 'سالاد بار',
      items: [
        { name: 'سالاد یونانی', price: 100000, category: 'سالاد بار' },
        { name: 'سالاد سبزیجات', price: 80000, category: 'سالاد بار' },
        { name: 'سالاد فصل', price: 80000, category: 'سالاد بار' },
        { name: 'سالاد مرغ', price: 100000, category: 'سالاد بار' },
        { name: 'سالاد کدو سبز', price: 80000, category: 'سالاد بار' },
        { name: 'سالاد کاهو و لیمو', price: 85000, category: 'سالاد بار' },
        { name: 'سالاد تن ماهی', price: 100000, category: 'سالاد بار' },
        { name: 'سالاد سیب زمینی', price: 85000, category: 'سالاد بار' },
        { name: 'سالاد ساده', price: 80000, category: 'سالاد بار' },
        { name: 'سالاد مخلوط', price: 80000, category: 'سالاد بار' },
        { name: 'سالاد سبز', price: 80000, category: 'سالاد بار' },
        { name: 'سالاد خیار', price: 80000, category: 'سالاد بار' },
        { name: 'سالاد کلم', price: 85000, category: 'سالاد بار' },
        { name: 'سالاد کرفس', price: 80000, category: 'سالاد بار' },
        { name: 'سالاد کاهو', price: 80000, category: 'سالاد بار' },
        { name: 'سالاد کاهو و ماست', price: 35000, category: 'سالاد بار' },
        { name: 'سالاد ماست', price: 35000, category: 'سالاد بار' },
      ],
    },
    {
      category: 'کافه',
      items: [
        { name: 'لیموناد', price: 65000, category: 'کافه' },
        { name: 'موهیتو', price: 65000, category: 'کافه' },
        { name: 'آیس تی', price: 50000, category: 'کافه' },
        { name: 'شیک توت فرنگی', price: 130000, category: 'کافه' },
        { name: 'شیک نسکافه', price: 130000, category: 'کافه' },
        { name: 'آیس آمریکانو', price: 120000, category: 'کافه' },
        { name: 'آیس موکا', price: 120000, category: 'کافه' },
        { name: 'آیس لاته', price: 120000, category: 'کافه' },
        { name: 'آیس اسپرسو', price: 120000, category: 'کافه' },
        { name: 'آیس وانیل', price: 120000, category: 'کافه' },
        { name: 'آیس شکلات', price: 120000, category: 'کافه' },
        { name: 'آیس کاپوچینو', price: 120000, category: 'کافه' },
        { name: 'آیس کافه لاته', price: 120000, category: 'کافه' },
        { name: 'کیک روز', price: 85000, category: 'کافه' },
        { name: 'کیک ویژه', price: 110000, category: 'کافه' },
        { name: 'چیزکیک', price: 105000, category: 'کافه' },
        { name: 'چیسس و چیزکیک', price: 90000, category: 'کافه' },
        { name: 'چیسس و چیزکیک ویژه', price: 150000, category: 'کافه' },
      ],
    },
  ]

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
      setError('Please select at least one item.')
      return
    }

    setLoading(true)

    const orderData = {
      items: selectedItems,
      total: calculateTotal(),
    }

    // Save to session storage
    sessionStorage.setItem('shoppingCart', JSON.stringify(orderData));

    // Navigate to the order completion page
    router.push('/customer/shopping-cart');
    onOrderSuccess();
    onClose();
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div
        className="bg-gradient-to-r from-blue-900 to-blue-200 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white bg-opacity-95 p-4 flex items-center justify-between border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <Image src="/logo38668.jpeg" alt="Sharif Plus" width={48} height={48} className="w-12 h-12 rounded-lg" />
            <h2 className="text-2xl font-bold text-gray-800">منوی شریف پلاس</h2>
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

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {menuData.map((section) => (
              <div
                key={section.category}
                className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-right border-b pb-2">
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div
                      key={item.name}
                      onClick={() => toggleItem(item)}
                      className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-all border ${
                        isItemSelected(item.name, section.category)
                          ? 'bg-blue-100 border-blue-500 shadow-md'
                          : 'bg-gray-50 border-gray-200 hover:bg-blue-50'
                      }`}
                    >
                      <span className="text-gray-800 text-sm font-medium">{item.name}</span>
                      <span className="text-blue-600 font-bold text-sm">
                        {item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Total and Submit */}
        {selectedItems.length > 0 && (
          <div className="bg-white bg-opacity-95 p-4 border-t">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-blue-600">جمع کل:</span>
              <span className="text-2xl font-bold text-gray-800">
                {calculateTotal().toLocaleString()} تومان
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-3 text-right">
              {selectedItems.length} items selected
            </div>
            <button
              onClick={handleProceedToOrder}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              {loading ? 'Adding to Cart...' : 'Add to Shopping Cart'}
            </button>
          </div>
        )}

        {selectedItems.length === 0 && (
          <div className="bg-white bg-opacity-95 p-4 border-t text-center text-gray-500">
            Select items from the menu above to create your order
          </div>
        )}
      </div>
    </div>
  )
}
