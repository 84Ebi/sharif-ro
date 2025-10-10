'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../lib/useAuth'
import Link from 'next/link'
import Image from 'next/image'
import { getPendingOrders, confirmOrder, type Order } from '../../lib/orders'

export default function Delivery() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [locationFilter, setLocationFilter] = useState('')
  const [costMin, setCostMin] = useState('')
  const [costMax, setCostMax] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const filterOrders = useCallback(() => {
    let filtered = orders
    
    if (locationFilter) {
      filtered = filtered.filter(order =>
        order.restaurantLocation.toLowerCase().includes(locationFilter.toLowerCase()) ||
        order.deliveryLocation.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }
    
    if (costMin) {
      filtered = filtered.filter(order => order.price >= Number(costMin))
    }
    
    if (costMax) {
      filtered = filtered.filter(order => order.price <= Number(costMax))
    }
    
    setFilteredOrders(filtered)
  }, [orders, locationFilter, costMin, costMax])

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      const pendingOrders = await getPendingOrders()
      setOrders(pendingOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user && user.emailVerification) {
      loadOrders()
    }
  }, [user, loadOrders])

  const acceptOrder = async (orderId: string) => {
    if (!user) return
    
    try {
      await confirmOrder(orderId, {
        id: user.$id,
        name: user.name,
        phone: user.phone || ''
      })
      
      // Remove order from list
      setOrders(orders.filter(order => order.$id !== orderId))
      alert('Order confirmed! Customer details are now available.')
    } catch (error) {
      console.error('Error accepting order:', error)
      alert('Failed to accept order. Please try again.')
    }
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
        </div>
      </>
    )
  }

  return (
    <>
      <style jsx>{`
        /* Reset & base */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing:antialiased; }

        /* Page background gradient */
        .background {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(to right, #0d47a1, #bbdefb);
          color: #fff;
          padding: 18px;
        }

        /* Top area */
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

        /* Modified brand and logo styling */
        .brand {
          display: flex;
          align-items: center;
        }
        .brand-logo {
          width: 56px;
          height: 56px;
          object-fit: contain;
          mix-blend-mode: screen;
        }

        .page-title {
          font-size: 18px;
          font-weight: 700;
          color: rgba(255,255,255,0.95);
          margin: 0;
        }

        /* Card */
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

        /* Filter pill */
        .filter-pill {
          align-self: flex-start;
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          color: #fff;
          cursor: pointer;
          transition: background .18s, transform .12s;
          border: 1px solid rgba(255,255,255,0.04);
          width: 110px;
          justify-content: center;
        }
        .filter-pill .filter-label { font-weight: 700; font-size: 13px; }
        .filter-controls { display: none; gap: 8px; align-items: center; margin-left: 8px; }

        /* show controls on hover/focus-within */
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
        .filter-input.small { min-width: 72px; }

        /* orders list */
        .orders {
          overflow: auto;
          padding-right: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 6px;
        }

        /* compact order */
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
          transition: transform .12s ease, box-shadow .12s ease;
          outline: none;
        }
        .order-compact:hover,
        .order-compact:focus {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(2,36,58,0.08);
        }

        /* compact card header */
        .compact-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .compact-info { display:flex; flex-direction:column; gap:4px; }
        .order-code { font-weight:700; color: #034066; font-size: 13px; }
        .order-time { color: rgba(2,36,58,0.55); font-size: 12px; }
        .compact-cost { font-weight:700; color: #034066; font-size: 14px; }
        .compact-preview { font-size: 13px; color: #1f3a4a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* expanded area */
        .expanded {
          max-height: 0;
          overflow: hidden;
          transition: max-height 260ms ease, opacity 180ms ease;
          opacity: 0;
        }

        .order-compact:hover .expanded,
        .order-compact:focus-within .expanded {
          max-height: 400px;
          opacity: 1;
        }

        .order-body div { font-size: 13px; color: #1f3a4a; padding: 2px 0; }
        .order-actions { display:flex; justify-content:center; margin-top:6px; }
        .btn.accept, .btn.small {
          background: linear-gradient(180deg, #4f7bff 0%, #3b5fe6 100%);
          color: #fff;
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: 700;
          border: none;
          box-shadow: 0 8px 20px rgba(79,123,255,0.14);
          cursor: pointer;
        }

        /* Bottom nav */
        .bottom-nav {
          width: 100%;
          max-width: 920px;
          display: flex;
          justify-content: space-around;
          gap: 12px;
          margin-top: 12px;
        }
        .nav-item {
          background: rgba(255,255,255,0.95);
          border-radius: 12px;
          border: none;
          padding: 10px 14px;
          width: 32%;
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: center;
          color: #02243a;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(2,36,58,0.08);
        }

        /* Accessibility helper */
        .visually-hidden {
          position: absolute !important;
          height: 1px; width: 1px;
          overflow: hidden;
          clip: rect(1px,1px,1px,1px);
          white-space: nowrap;
          border: 0;
          padding: 0;
          margin: -1px;
        }

        /* Responsive tweaks */
        @media (max-width: 720px) {
          .card { max-width: 96%; padding: 8px; max-height: calc(100vh - 170px); }
          .brand-logo { width: 48px; height: 48px; }
          .page-title { font-size: 16px; }
          .filter-input { min-width: 84px; font-size: 13px;}
          .order-compact { padding: 10px; }
        }
      `}</style>

      <div className="background">
        <header className="topbar">
          <div className="topbar-inner">
            <div className="brand">
                <Image src="/gift.png" alt="Logo" className="brand-logo" width={56} height={56} />
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
            {loading ? (
              <div className="empty-state">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="empty-state">No pending orders available.</div>
            ) : (
              filteredOrders.map(order => (
                <article
                  key={order.$id}
                  className="order-compact"
                  tabIndex={0}
                  onClick={() => setExpandedOrder(expandedOrder === order.$id ? null : (order.$id || null))}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setExpandedOrder(expandedOrder === order.$id ? null : (order.$id || null))
                    }
                  }}
                >
                  <div className="compact-head">
                    <div className="compact-info">
                      <div className="order-code">{order.orderCode || order.$id?.slice(0, 8)}</div>
                      <div className="order-time">
                        {order.$createdAt && new Date(order.$createdAt).toLocaleDateString()} • {order.$createdAt && new Date(order.$createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                      </div>
                    </div>
                    <div className="compact-cost">${order.price.toFixed(2)}</div>
                  </div>

                  <div className="compact-preview">
                    {order.restaurantLocation} → {order.deliveryLocation}
                  </div>

                  <div className="expanded" style={{
                    maxHeight: expandedOrder === order.$id ? '400px' : '0',
                    opacity: expandedOrder === order.$id ? '1' : '0'
                  }}>
                    <div className="order-body">
                      <div><strong>Customer:</strong> {order.fullName}</div>
                      <div><strong>Phone:</strong> {order.phone}</div>
                      {order.email && <div><strong>Email:</strong> {order.email}</div>}
                      <div><strong>Restaurant:</strong> {order.restaurantLocation} ({order.restaurantType})</div>
                      {order.orderCode && <div><strong>Order Code:</strong> {order.orderCode}</div>}
                      <div><strong>Delivery To:</strong> {order.deliveryLocation}</div>
                      {order.extraNotes && <div><strong>Notes:</strong> {order.extraNotes}</div>}
                      <div><strong>Price:</strong> ${order.price.toFixed(2)}</div>
                    </div>

                    <div className="order-actions">
                      <button
                        className="btn accept"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (order.$id) acceptOrder(order.$id)
                        }}
                      >
                        Confirm Delivery
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        </main>

        <nav className="bottom-nav" role="navigation" aria-label="Primary">
          <Link href="/delivery">
            <button className="nav-item" aria-label="Home">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11.5z" fill="#02243a"/></svg>
              <span>Home</span>
            </button>
          </Link>

          <Link href="/account">
            <button className="nav-item" aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" fill="#02243a"/></svg>
              <span>Account</span>
            </button>
          </Link>

          <Link href="/delivery/orders">
            <button className="nav-item" aria-label="Orders List">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12h14l4 4V6l-4 4H3z" fill="#02243a"/></svg>
              <span>Orders List</span>
            </button>
          </Link>
        </nav>
      </div>
    </>
  )
}