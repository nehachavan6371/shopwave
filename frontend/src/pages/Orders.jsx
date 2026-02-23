import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronDown, ChevronUp } from 'lucide-react'
import { ordersAPI } from '../api'

const STATUS_COLORS = {
  pending: '#e8a100',
  confirmed: 'var(--rust)',
  shipped: '#2563eb',
  delivered: 'var(--success)',
  cancelled: '#999',
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
      <div
        style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <Package size={18} color="var(--warm-gray)" />
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Order #{order.id}</span>
          <span style={{ fontSize: 13, color: 'var(--warm-gray)', marginLeft: 12 }}>
            {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>
        <span style={{
          padding: '3px 12px',
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600,
          background: STATUS_COLORS[order.status] + '20',
          color: STATUS_COLORS[order.status],
          textTransform: 'capitalize',
        }}>
          {order.status}
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, minWidth: 90, textAlign: 'right' }}>
          ${order.total_amount.toFixed(2)}
        </span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '20px 24px' }}>
          {order.shipping_address && (
            <p style={{ fontSize: 13, color: 'var(--warm-gray)', marginBottom: 16 }}>
              📦 Ships to: {order.shipping_address}
            </p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {order.items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <img src={item.product.image_url} alt={item.product.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                <div style={{ flex: 1 }}>
                  <Link to={`/products/${item.product_id}`} style={{ fontSize: 14, fontWeight: 500 }}>{item.product.name}</Link>
                  <p style={{ fontSize: 12, color: 'var(--warm-gray)' }}>Qty: {item.quantity} × ${item.unit_price.toFixed(2)}</p>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>${(item.quantity * item.unit_price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersAPI.list()
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container" style={{ padding: '48px 24px 80px', maxWidth: 800 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, marginBottom: 40 }}>My Orders</h1>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 64, borderRadius: 8 }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <Package size={48} color="var(--border)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 8 }}>No orders yet</h3>
          <p style={{ color: 'var(--warm-gray)', marginBottom: 24 }}>Start shopping to see your orders here.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        orders.map(order => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  )
}
