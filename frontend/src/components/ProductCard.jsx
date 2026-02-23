import { Link } from 'react-router-dom'
import { ShoppingBag, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    try {
      await addToCart(product.id, 1)
      toast.success(`${product.name} added to cart`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not add to cart')
    }
  }

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
      <article style={{
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        {/* Image */}
        <div style={{ position: 'relative', paddingTop: '75%', overflow: 'hidden', background: 'var(--sand)' }}>
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600'}
            alt={product.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
          {discount && (
            <span style={{
              position: 'absolute', top: 12, left: 12,
              background: 'var(--rust)', color: 'white',
              fontSize: 11, fontWeight: 700, padding: '3px 8px',
              borderRadius: '2px', letterSpacing: '0.03em',
            }}>−{discount}%</span>
          )}
          {product.stock === 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(26,22,18,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '16px 16px 12px' }}>
          {product.category && (
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--warm-gray)' }}>
              {product.category}
            </span>
          )}
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 400, margin: '4px 0 8px', color: 'var(--ink)', lineHeight: 1.3 }}>
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
              <Star size={12} fill="var(--rust)" color="var(--rust)" />
              <span style={{ fontSize: 12, color: 'var(--ink-light)', fontWeight: 500 }}>{product.rating}</span>
              <span style={{ fontSize: 12, color: 'var(--warm-gray)' }}>({product.reviews_count})</span>
            </div>
          )}

          {/* Price + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && (
                <span style={{ fontSize: 13, color: 'var(--warm-gray)', textDecoration: 'line-through' }}>
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>
            {product.stock > 0 && (
              <button
                onClick={handleAddToCart}
                style={{
                  background: 'var(--ink)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  padding: '7px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--rust)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}
              >
                <ShoppingBag size={13} /> Add
              </button>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
