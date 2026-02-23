import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart()
  const navigate = useNavigate()

  const handleRemove = async (id, name) => {
    try {
      await removeItem(id)
      toast.success(`${name} removed`)
    } catch { toast.error('Error removing item') }
  }

  if (items.length === 0) return (
    <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
      <ShoppingBag size={56} color="var(--border)" style={{ margin: '0 auto 16px' }} />
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 8 }}>Your cart is empty</h2>
      <p style={{ color: 'var(--warm-gray)', marginBottom: 32 }}>Looks like you haven't added anything yet.</p>
      <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
    </div>
  )

  return (
    <div className="container" style={{ padding: '48px 24px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, marginBottom: 40 }}>Shopping Cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {items.map(item => (
            <div key={item.id} style={{
              display: 'grid', gridTemplateColumns: '80px 1fr auto',
              gap: 20, padding: '20px 0',
              borderBottom: '1px solid var(--border)',
              alignItems: 'center',
            }}>
              <Link to={`/products/${item.product_id}`}>
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6 }}
                />
              </Link>

              <div>
                <Link to={`/products/${item.product_id}`} style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 400, display: 'block', marginBottom: 4 }}>
                  {item.product.name}
                </Link>
                <p style={{ fontSize: 13, color: 'var(--warm-gray)', marginBottom: 10 }}>{item.product.category}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '4px 12px', background: 'none', border: 'none', fontSize: 16, cursor: 'pointer' }}>−</button>
                    <span style={{ padding: '4px 12px', fontSize: 13, fontWeight: 500 }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '4px 12px', background: 'none', border: 'none', fontSize: 16, cursor: 'pointer' }}>+</button>
                  </div>
                  <button onClick={() => handleRemove(item.id, item.product.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--warm-gray)', display: 'flex' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
                {item.quantity > 1 && (
                  <p style={{ fontSize: 12, color: 'var(--warm-gray)', marginTop: 2 }}>${item.product.price.toFixed(2)} each</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, padding: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 24 }}>Order Summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: 'var(--warm-gray)' }}>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: 'var(--warm-gray)' }}>Shipping</span>
              <span style={{ color: 'var(--success)' }}>{total >= 75 ? 'Free' : '$9.99'}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>
                ${(total + (total >= 75 ? 0 : 9.99)).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg btn-full"
            onClick={() => navigate('/checkout')}
          >
            Checkout <ArrowRight size={16} />
          </button>

          <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--warm-gray)' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
