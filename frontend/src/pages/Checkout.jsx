import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { ordersAPI } from '../api'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    street: '', city: '', state: '', zip: '', country: 'India',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.street || !form.city || !form.zip) {
      toast.error('Please fill all required fields')
      return
    }
    setSubmitting(true)
    try {
      const shipping = `${form.street}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`
      await ordersAPI.create({
        shipping_address: shipping,
        items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
      })
      await clearCart()
      setSuccess(true)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Order failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) return (
    <div className="container" style={{ padding: '80px 24px', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ animation: 'fadeUp 0.5s ease' }}>
        <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 20px' }} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 12 }}>Order Placed!</h1>
        <p style={{ color: 'var(--warm-gray)', marginBottom: 32, lineHeight: 1.7 }}>
          Thank you for your order. We'll send you a confirmation once it ships.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => navigate('/orders')} className="btn btn-primary">View My Orders</button>
          <button onClick={() => navigate('/products')} className="btn btn-secondary">Continue Shopping</button>
        </div>
      </div>
    </div>
  )

  if (items.length === 0) { navigate('/cart'); return null }

  return (
    <div className="container" style={{ padding: '48px 24px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, marginBottom: 40 }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, alignItems: 'start' }}>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, padding: 32, marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={16} color="var(--rust)" /> Shipping Address
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label>Street Address *</label>
                <input className="input" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} placeholder="123 Main Street" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>City *</label>
                  <input className="input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Mumbai" required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input className="input" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="Maharashtra" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>PIN Code *</label>
                  <input className="input" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} placeholder="400001" required />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input className="input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-primary btn-lg btn-full">
            {submitting ? 'Placing Order…' : `Place Order — $${(total + (total >= 75 ? 0 : 9.99)).toFixed(2)}`}
          </button>
        </form>

        {/* Order summary */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, padding: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, marginBottom: 20 }}>Order Summary</h3>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
              <img src={item.product.image_url} alt={item.product.name} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 4 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{item.product.name}</p>
                <p style={{ fontSize: 12, color: 'var(--warm-gray)' }}>Qty: {item.quantity}</p>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
              <span style={{ color: 'var(--warm-gray)' }}>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
              <span style={{ color: 'var(--warm-gray)' }}>Shipping</span>
              <span style={{ color: 'var(--success)' }}>{total >= 75 ? 'Free' : '$9.99'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>${(total + (total >= 75 ? 0 : 9.99)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
