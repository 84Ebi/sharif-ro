'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Addon {
  name: string
  price: number
}

interface MenuItem {
  name: string
  price: number
  category: string
  addons?: Addon[]
}

// This represents a selected item in the cart, which might include an addon
interface SelectedItem extends MenuItem {
  selectedAddon?: Addon
}

interface SharifFastFoodMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function SharifFastFoodMenu({ isOpen, onClose }: SharifFastFoodMenuProps) {
  const router = useRouter()
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [error, setError] = useState('')
  const [openAddons, setOpenAddons] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const menuData: { category: string; items: MenuItem[] }[] = [
    {
      category: 'Breakfast',
      items: [
        { name: 'نیمرو', price: 55000, category: 'Breakfast' },
        { name: 'املت', price: 60000, category: 'Breakfast' },
        { name: 'سوسیس تخم‌مرغ', price: 65000, category: 'Breakfast' },
        { name: 'املت قارچ', price: 70000, category: 'Breakfast' },
        { name: 'سوسیس املت', price: 75000, category: 'Breakfast' },
        { name: 'چیز املت', price: 65000, category: 'Breakfast' },
        { name: 'سوپر املت', price: 85000, category: 'Breakfast' },
        { name: 'عدسی', price: 70000, category: 'Breakfast' },
      ],
    },
    {
      category: 'Sandwiches',
      items: [
        {
          name: 'فلافل',
          price: 100000,
          category: 'Sandwiches',
          addons: [
            { name: 'قارچ و پنیر', price: 55000 },
            { name: 'ژامبون پنیر گودا', price: 100000 },
            { name: 'مینی فلافل', price: 75000 },
          ],
        },
        {
          name: 'هات داگ',
          price: 140000,
          category: 'Sandwiches',
          addons: [
            { name: 'قارچ و پنیر', price: 55000 },
            { name: 'ژامبون پنیر گودا', price: 100000 },
            { name: 'مینی هات داگ', price: 75000 },
          ],
        },
        {
          name: 'بندری',
          price: 110000,
          category: 'Sandwiches',
          addons: [
            { name: 'قارچ و پنیر', price: 55000 },
            { name: 'مینی بندری', price: 75000 },
          ],
        },
        {
          name: 'مرغ گریل',
          price: 155000,
          category: 'Sandwiches',
          addons: [
            { name: 'قارچ و پنیر', price: 55000 },
            { name: 'ژامبون پنیر گودا', price: 100000 },
            { name: 'مینی مرغ گریل', price: 85000 },
          ],
        },
        {
          name: 'دونر کباب گوشت',
          price: 185000,
          category: 'Sandwiches',
          addons: [
            { name: 'قارچ و پنیر', price: 55000 },
            { name: 'ژامبون پنیر گودا', price: 100000 },
          ],
        },
        {
          name: 'ژامبون تنوری',
          price: 185000,
          category: 'Sandwiches',
          addons: [{ name: 'ژامبون تنوری مخصوص', price: 185000 }],
        },
        {
          name: 'رست بیف',
          price: 190000,
          category: 'Sandwiches',
          addons: [{ name: 'ژامبون پنیر گودا', price: 100000 }],
        },
      ],
    },
    {
      category: 'Burgers',
      items: [
        { name: 'چیز برگر', price: 190000, category: 'Burgers' },
        { name: 'همبرگر ذغالی', price: 170000, category: 'Burgers' },
        { name: 'چیکن برگر', price: 210000, category: 'Burgers' },
        { name: 'ماش روم برگر', price: 185000, category: 'Burgers' },
      ],
    },
    {
      category: 'Appetizers',
      items: [
        { name: 'نان سیر', price: 120000, category: 'Appetizers' },
        { name: 'سیب زمینی', price: 85000, category: 'Appetizers' },
        { name: 'سیب زمینی مخصوص', price: 140000, category: 'Appetizers' },
        { name: 'سیب زمینی با سس قارچ', price: 150000, category: 'Appetizers' },
        { name: 'چیپس و پنیر', price: 120000, category: 'Appetizers' },
        { name: 'سوسیس سیب زمینی', price: 140000, category: 'Appetizers' },
      ],
    },
    {
      category: 'Pizza',
      items: [
        { name: 'پیتزا مخصوص', price: 215000, category: 'Pizza' },
        { name: 'پیتزا مخلوط', price: 190000, category: 'Pizza' },
        { name: 'پیتزا پپرونی', price: 190000, category: 'Pizza' },
        { name: 'پیتزا گوشت و قارچ', price: 210000, category: 'Pizza' },
        { name: 'پیتزا رست بیف', price: 210000, category: 'Pizza' },
        { name: 'پیتزا چیکن آلفردو', price: 200000, category: 'Pizza' },
        { name: 'پیتزا سبزیجات', price: 170000, category: 'Pizza' },
        { name: 'پیتزا سیر و استیک', price: 230000, category: 'Pizza' },
        { name: 'پیتزا بیکن', price: 215000, category: 'Pizza' },
      ],
    },
    {
      category: 'Pasta',
      items: [
        { name: 'چیز پاستا مخصوص', price: 200000, category: 'Pasta' },
        { name: 'پاستا چیکن آلفردو', price: 180000, category: 'Pasta' },
      ],
    },
  ]

  const toggleItem = (item: MenuItem) => {
    const itemKey = `${item.category}-${item.name}`
    const exists = selectedItems.find((i) => i.name === item.name && i.category === item.category)

    if (exists) {
      setSelectedItems(selectedItems.filter((i) => !(i.name === item.name && i.category === item.category)))
      if (openAddons === itemKey) {
        setOpenAddons(null)
      }
    } else {
      setSelectedItems([...selectedItems, { ...item }])
      if (item.addons) {
        setOpenAddons(itemKey)
      }
    }
  }

  const handleAddonSelection = (item: SelectedItem, addon: Addon | null) => {
    const updatedItems = selectedItems.map((si) => {
      if (si.name === item.name && si.category === item.category) {
        return { ...si, selectedAddon: addon || undefined }
      }
      return si
    })
    setSelectedItems(updatedItems)
  }

  const isItemSelected = (itemName: string, category: string) => {
    return selectedItems.some((i) => i.name === itemName && i.category === category)
  }

  const getSelectedItem = (itemName: string, category: string) => {
    return selectedItems.find((i) => i.name === itemName && i.category === category)
  }

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => {
      const itemPrice = item.price
      const addonPrice = item.selectedAddon ? item.selectedAddon.price : 0
      return sum + itemPrice + addonPrice
    }, 0)
  }

  const handleProceedToOrder = () => {
    if (selectedItems.length === 0) {
      setError('Please select at least one item.')
      return
    }

    const orderData = {
      items: selectedItems.map(item => ({
        name: item.selectedAddon ? `${item.name} (${item.selectedAddon.name})` : item.name,
        price: item.price + (item.selectedAddon ? item.selectedAddon.price : 0),
        category: item.category,
      })),
      total: calculateTotal(),
    }

    const existingCart = sessionStorage.getItem('shoppingCart')
    let finalCart = orderData

    if (existingCart) {
      const parsedCart = JSON.parse(existingCart)
      finalCart = {
        items: [...parsedCart.items, ...orderData.items],
        total: parsedCart.total + orderData.total,
      }
    }
    
    setLoading(true)
    sessionStorage.setItem('shoppingCart', JSON.stringify(finalCart))
    router.push('/customer/shopping-cart')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-2xl bg-opacity-50 p-4" onClick={onClose}>
      <div
        className="bg-gradient-to-r from-blue-900 to-blue-200 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white bg-opacity-95 p-4 flex items-center justify-between border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <Image src="/logo38668.jpeg" alt="Sharif Fast Food" width={48} height={48} className="w-12 h-12 rounded-lg" />
            <h2 className="text-2xl font-bold text-gray-800">منوی فست فود شریف</h2>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-3xl font-bold">×</button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuData.map((section) => (
              <div key={section.category} className="bg-white bg-opacity-90 rounded-xl p-4 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-right border-b pb-2">{section.category}</h3>
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const itemKey = `${item.category}-${item.name}`
                    const selected = isItemSelected(item.name, item.category)
                    const currentItem = getSelectedItem(item.name, item.category)

                    return (
                      <div key={itemKey}>
                        <div
                          onClick={() => toggleItem(item)}
                          className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-all border ${
                            selected ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 hover:bg-blue-50'
                          }`}
                        >
                          <span className="text-gray-800 font-medium">{item.name}</span>
                          <span className="text-blue-600 font-bold">{item.price.toLocaleString()}</span>
                        </div>
                        {selected && item.addons && openAddons === itemKey && (
                          <div className="p-2 mt-1 bg-blue-50 rounded-md">
                            <h4 className="text-sm font-semibold text-right mb-1 text-gray-700">افزودنی</h4>
                            <div className="space-y-1">
                              <div
                                onClick={() => handleAddonSelection(item, null)}
                                className={`flex justify-between p-1 rounded cursor-pointer text-sm ${!currentItem?.selectedAddon ? 'bg-green-200' : 'hover:bg-gray-200'}`}
                              >
                                <span>هیچکدام</span>
                                <span>رایگان</span>
                              </div>
                              {item.addons.map((addon) => (
                                <div
                                  key={addon.name}
                                  onClick={() => handleAddonSelection(item, addon)}
                                  className={`flex justify-between p-1 rounded cursor-pointer text-sm ${currentItem?.selectedAddon?.name === addon.name ? 'bg-green-200' : 'hover:bg-gray-200'}`}
                                >
                                  <span>{addon.name}</span>
                                  <span>{addon.price.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        {selectedItems.length > 0 && (
          <div className="bg-white bg-opacity-95 p-4 border-t">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-blue-600">جمع کل:</span>
              <span className="text-2xl font-bold text-gray-800">{calculateTotal().toLocaleString()} تومان</span>
            </div>
            <button
              onClick={handleProceedToOrder}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg font-semibold"
            >
              {loading ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
