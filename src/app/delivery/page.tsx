'use client'

import { useState, useEffect, useCallback } from 'react'
import BottomDock from '../../components/BottomDock'
import { useAuth } from '../../lib/useAuth'
import Link from 'next/link'

interface Order {
  $id: string
  orderCode: string
  name: string
  phone: string
  email?: string
  address: string
  instructions: string
  createdAt: string
  cost: number
  assigned?: boolean
}

const mockOrders: Order[] = [
  {
    $id: '1',
    orderCode: 'ORD001',
    name: 'John Doe',
    phone: '1234567890',
    email: 'john@example.com',
    address: '123 Main St',
    instructions: 'Leave at door',
    createdAt: new Date().toISOString(),
    cost: 15.99,
  },
  {
    $id: '2',
    orderCode: 'ORD002',
    name: 'Jane Smith',
    phone: '0987654321',
    address: '456 Elm St',
    instructions: '',
    createdAt: new Date().toISOString(),
    cost: 22.50,
  },
]

export default function Delivery() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [locationFilter, setLocationFilter] = useState('')
  const [costMin, setCostMin] = useState('')
  const [costMax, setCostMax] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const filterOrders = useCallback(() => {
    let filtered = orders.filter(order => !order.assigned)
    if (locationFilter) {
      filtered = filtered.filter(order =>
        order.address.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }
    if (costMin) {
      filtered = filtered.filter(order => order.cost >= Number(costMin))
    }
    if (costMax) {
      filtered = filtered.filter(order => order.cost <= Number(costMax))
    }
    setFilteredOrders(filtered)
  }, [orders, locationFilter, costMin, costMax]);

  const loadOrders = useCallback(async () => {
    // Mock loading orders
    setOrders(mockOrders)
  }, []);

  useEffect(() => {
    if (user && user.emailVerification) {
      loadOrders()
    }
  }, [user, loadOrders])

  const acceptOrder = async (orderId: string) => {
    if (!user) return
    // Mock accept order
    setOrders(orders.map(order => order.$id === orderId ? { ...order, assigned: true, deliveryPerson: user.$id } : order))
    alert('Order accepted')
  }

  useEffect(() => {
    filterOrders()
  }, [filterOrders])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(to right, #0d47a1, #bbdefb)'}}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(to right, #0d47a1, #bbdefb)'}}>
        <div className="text-white text-xl">Please log in to access delivery dashboard.</div>
      </div>
    )
  }

  // Check if user is verified
  if (!user.emailVerification) {
    return (
      <>
        <style jsx>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          
          .background {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: linear-gradient(to right, #0d47a1, #bbdefb);
            color: #fff;
            padding: 18px;
            padding-bottom: 80px;
          }

          .verification-banner {
            width: 100%;
            max-width: 920px;
            margin-top: 20px;
            padding: 20px;
            background: rgba(255, 193, 7, 0.95);
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          }

          .banner-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #02243a;
            margin-bottom: 12px;
          }

          .banner-text {
            font-size: 1rem;
            color: #02243a;
            margin-bottom: 20px;
            opacity: 0.9;
          }

          .btn-verify {
            background: linear-gradient(180deg, #4f7bff 0%, #3b5fe6 100%);
            color: #fff;
            padding: 12px 32px;
            border-radius: 8px;
            font-weight: 700;
            border: none;
            box-shadow: 0 8px 20px rgba(79,123,255,0.3);
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.12s ease;
            font-size: 1rem;
          }

          .btn-verify:hover {
            transform: translateY(-2px);
          }

          .info-card {
            width: 100%;
            max-width: 920px;
            margin-top: 24px;
            padding: 24px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            backdrop-filter: blur(6px);
          }

          .info-title {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 12px;
          }

          .info-list {
            list-style: none;
            padding: 0;
          }

          .info-list li {
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .info-list li:last-child {
            border-bottom: none;
          }

          @media (max-width: 720px) {
            .banner-title {
              font-size: 1.25rem;
            }
            .banner-text {
              font-size: 0.9rem;
            }
          }
        `}</style>

        <div className="background">
          <div className="verification-banner">
            <h2 className="banner-title">⚠️ Verification Required</h2>
            <p className="banner-text">
              Your account is not yet verified to accept delivery orders. 
              Please complete the verification process to start delivering.
            </p>
            <Link href="/delivery/verify" className="btn-verify">
              Go to Verification
            </Link>
          </div>

          <div className="info-card">
            <h3 className="info-title">Why Verification?</h3>
            <ul className="info-list">
              <li>✓ Ensures safe and reliable deliveries</li>
              <li>✓ Protects customers and delivery partners</li>
              <li>✓ Verifies student identity</li>
              <li>✓ Manual review by admins for security</li>
            </ul>
          </div>

          <BottomDock role="delivery" />
        </div>
      </>
    )
  }

  return (
    <>
      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .background {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(to right, #0d47a1, #bbdefb);
          color: #fff;
          padding: 18px;
        }

        .topbar {
          width: 100%;
          max-width: 920px;
          margin-bottom: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .topbar-inner {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand {
          display: flex;
          align-items: center;
        }

        .brand-logo {
          width: 56px;
          height: 56px;
          font-size: 36px;
        }

        .page-title {
          font-size: 18px;
          font-weight: 700;
          color: rgba(255,255,255,0.95);
          margin: 0;
        }

        .filter-pill {
          align-self: flex-start;
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          color: #fff;
          cursor: pointer;
          transition: all 0.18s;
          border: 1px solid rgba(255,255,255,0.04);
          width: 110px;
          justify-content: center;
        }

        .filter-label {
          font-weight: 700;
          font-size: 13px;
        }

        .filter-controls {
          display: none;
          gap: 8px;
          align-items: center;
          margin-left: 8px;
        }

        .filter-pill:hover,
        .filter-pill:focus-within {
          background: rgba(255,255,255,0.12);
          width: auto;
          padding: 8px 14px;
        }

        .filter-pill:hover .filter-controls,
        .filter-pill:focus-within .filter-controls {
          display: flex;
        }

        .filter-input {
          padding: 8px 10px;
          border-radius: 10px;
          border: none;
          background: rgba(255,255,255,0.95);
          color: #02243a;
          font-size: 13px;
          min-width: 120px;
          outline: none;
          box-shadow: 0 6px 18px rgba(79,123,255,0.06);
        }

        .filter-input.small {
          min-width: 72px;
        }

        .card {
          width: 100%;
          max-width: 920px;
          background: rgba(255,255,255,0.06);
          border-radius: 12px;
          box-shadow: 0 12px 36px rgba(0,0,0,0.35);
          backdrop-filter: blur(6px);
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1 1 auto;
          min-height: 56vh;
          max-height: calc(100vh - 200px);
          overflow: hidden;
        }

        .orders {
          overflow: auto;
          padding-right: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 6px;
        }

        .order-compact {
          background: rgba(255,255,255,0.98);
          color: #02243a;
          border-radius: 10px;
          padding: 10px;
          border: 1px solid rgba(2,36,58,0.06);
          box-shadow: 0 6px 14px rgba(2,36,58,0.04);
          display: flex;
          flex-direction: column;
          gap: 8px;
          cursor: pointer;
          transition: transform 0.12s ease, box-shadow 0.12s ease;
          outline: none;
        }

        .order-compact:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(2,36,58,0.08);
        }

        .compact-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .compact-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .order-code {
          font-weight: 700;
          color: #034066;
          font-size: 13px;
        }

        .order-time {
          color: rgba(2,36,58,0.55);
          font-size: 12px;
        }

        .compact-cost {
          font-weight: 700;
          color: #034066;
          font-size: 14px;
        }

        .compact-preview {
          font-size: 13px;
          color: #1f3a4a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .expanded {
          max-height: ${expandedOrder ? '400px' : '0'};
          overflow: hidden;
          transition: max-height 260ms ease, opacity 180ms ease;
          opacity: ${expandedOrder ? '1' : '0'};
        }

        .order-body {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .order-body div {
          font-size: 13px;
          color: #1f3a4a;
          padding: 2px 0;
        }

        .order-actions {
          display: flex;
          justify-content: center;
          margin-top: 6px;
        }

        .btn-accept {
          background: linear-gradient(180deg, #4f7bff 0%, #3b5fe6 100%);
          color: #fff;
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: 700;
          border: none;
          box-shadow: 0 8px 20px rgba(79,123,255,0.14);
          cursor: pointer;
          transition: transform 0.12s ease;
        }

        .btn-accept:hover {
          transform: translateY(-2px);
        }

        .empty-state {
          text-align: center;
          color: rgba(255,255,255,0.8);
          padding: 40px;
          font-size: 16px;
        }

        @media (max-width: 720px) {
          .card {
            max-width: 96%;
            padding: 8px;
            max-height: calc(100vh - 170px);
          }
          .brand-logo {
            width: 48px;
            height: 48px;
            font-size: 28px;
          }
          .page-title {
            font-size: 16px;
          }
          .filter-input {
            min-width: 84px;
            font-size: 13px;
          }
          .order-compact {
            padding: 10px;
          }
        }
      `}</style>

      <div className="background">
        <header className="topbar">
          <div className="topbar-inner">
            <div className="brand">
                <img src="/gift.png" alt="Logo" className="brand-logo" />
            </div>
            <h1 className="page-title">Delivery Dashboard</h1>
          </div>

          <div className="filter-pill" tabIndex={0}>
            <span className="filter-label">Filters</span>
            <div className="filter-controls">
              <input
                className="filter-input"
                type="text"
                placeholder="Location"
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
              />
              <div style={{display: 'flex', gap: '8px'}}>
                <input
                  className="filter-input small"
                  type="number"
                  placeholder="Min"
                  value={costMin}
                  onChange={e => setCostMin(e.target.value)}
                  min="0"
                />
                <input
                  className="filter-input small"
                  type="number"
                  placeholder="Max"
                  value={costMax}
                  onChange={e => setCostMax(e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="card">
          <section className="orders">
            {filteredOrders.length === 0 ? (
              <div className="empty-state">No unassigned orders.</div>
            ) : (
              filteredOrders.map(order => (
                <article
                  key={order.$id}
                  className="order-compact"
                  tabIndex={0}
                  onClick={() => setExpandedOrder(expandedOrder === order.$id ? null : order.$id)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setExpandedOrder(expandedOrder === order.$id ? null : order.$id)
                    }
                  }}
                >
                  <div className="compact-head">
                    <div className="compact-info">
                      <div className="order-code">{order.orderCode}</div>
                      <div className="order-time">
                        {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                      </div>
                    </div>
                    <div className="compact-cost">${order.cost.toFixed(2)}</div>
                  </div>

                  <div className="compact-preview">
                    {order.name} — {order.address} {order.instructions && `— ${order.instructions}`}
                  </div>

                  <div className="expanded" style={{
                    maxHeight: expandedOrder === order.$id ? '400px' : '0',
                    opacity: expandedOrder === order.$id ? '1' : '0'
                  }}>
                    <div className="order-body">
                      <div><strong>Name:</strong> {order.name}</div>
                      <div><strong>Phone:</strong> {order.phone}</div>
                      {order.email && <div><strong>Email:</strong> {order.email}</div>}
                      <div><strong>Address:</strong> {order.address}</div>
                      <div><strong>Instructions:</strong> {order.instructions || 'None'}</div>
                      <div><strong>Time:</strong> {new Date(order.createdAt).toLocaleString()}</div>
                    </div>

                    <div className="order-actions">
                      <button
                        className="btn-accept"
                        onClick={(e) => {
                          e.stopPropagation()
                          acceptOrder(order.$id)
                        }}
                      >
                        Accept Order
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        </main>

        <BottomDock role="delivery" />
      </div>
    </>
  )
}