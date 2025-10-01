'use client'

import { useRouter } from 'next/navigation'
import BottomDock from '../../components/BottomDock'

export default function CustomerPage() {
  const router = useRouter()

  const services = [
    { id: 'food', name: 'Food Delivery', description: 'Order food from various restaurants' },
    { id: 'service', name: 'Service Delivery', description: 'Order various services' },
    { id: 'courier', name: 'Courier Service', description: 'Send packages and documents' },
    { id: 'grocery', name: 'Grocery Delivery', description: 'Order groceries and essentials' },
    // Add more services later
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Customer Services</h1>
        <div className="space-y-4">
          {services.map(service => (
            <div
              key={service.id}
              onClick={() => {
                if (service.id === 'food') {
                  router.push('/order')
                } else if (service.id === 'service') {
                  router.push('/service')
                } else if (service.id === 'courier') {
                  router.push('/courier')
                } else if (service.id === 'grocery') {
                  router.push('/grocery')
                } else {
                  // Handle other services
                  alert('Service not implemented yet')
                }
              }}
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">{service.name}</h2>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
      <BottomDock role="customer" />
    </div>
  )
}