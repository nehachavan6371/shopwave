import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, ShoppingBag, ArrowLeft, Package, CheckCircle } from 'lucide-react'
import { productsAPI } from '../api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    productsAPI.get(id)
      .then(r => setProduct(r.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return }
    setAdding(true)
    try {
      await addToCart(product.id, qty)
      toast.success(`${product.name} added to cart!`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not add to cart')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return (
    <div className="container" style={{ padding: '48px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
        <div className="skeleton" style={{ height: 480, borderRadius: 8 }} />
        <div>
          <div className="skeleton" style={{ height: 40, width: '80%', marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 24, width: '40%', marginBottom: 32 }} />
          <div className="skeleton" style={{ height: 100 }} />
        </div>
      </div>
    </div>
  )
  if (!product) return null

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--warm-gray)', marginBottom: 32 }}>
        <ArrowLeft size={14} /> Back to Products
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
        {/* Image */}
        <div style={{ borderRadius: 12, overflow: 'hidden', background: 'var(--sand)' }}>
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800'}
            alt={product.name}
            style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
          />
        </div>

        {/* Details */}
        <div className="fade-up">
          {product.category && (
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--warm-gray)' }}>
              {product.category}
            </span>
          )}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, margin: '8px 0 16px', lineHeight: 1.2 }}>
            {product.name}
          </h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < Math.round(product.rating) ? 'var(--rust)' : 'transparent'} color="var(--rust)" />
              ))}
              <span style={{ fontSize: 13, color: 'var(--ink-light)', fontWeight: 500 }}>{product.rating}</span>
              <span style={{ fontSize: 13, color: 'var(--warm-gray)' }}>({product.reviews_count} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--ink)' }}>
              ${product.price.toFixed(2)}
            </span>
            {product.original_price && (
              <>
                <span style={{ fontSize: 18, color: 'var(--warm-gray)', textDecoration: 'line-through' }}>
                  ${product.original_price.toFixed(2)}
                </span>
                <span style={{ background: '#fde8e3', color: 'var(--rust)', fontSize: 13, fontWeight: 700, padding: '2px 8px', borderRadius: 2 }}>
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p style={{ fontSize: 15, color: 'var(--ink-light)', lineHeight: 1.8, marginBottom: 32 }}>
            {product.description}
          </p>

          {/* Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            {product.stock > 0 ? (
              <>
                <CheckCircle size={15} color="var(--success)" />
                <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 500 }}>
                  In stock ({product.stock} available)
                </span>
              </>
            ) : (
              <>
                <Package size={15} color="var(--warm-gray)" />
                <span style={{ fontSize: 13, color: 'var(--warm-gray)' }}>Out of stock</span>
              </>
            )}
          </div>

          {product.stock > 0 && (
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {/* Qty */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '10px 16px', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--ink)' }}>−</button>
                <span style={{ padding: '10px 16px', fontSize: 15, fontWeight: 500, minWidth: 40, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ padding: '10px 16px', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--ink)' }}>+</button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="btn btn-primary btn-lg"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <ShoppingBag size={16} />
                {adding ? 'Adding…' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
