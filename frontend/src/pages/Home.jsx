import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowRight, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import { productsAPI } from '../api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      productsAPI.list({ featured: true, limit: 4 }),
      productsAPI.categories(),
    ]).then(([pRes, cRes]) => {
      setFeatured(pRes.data)
      setCategories(cRes.data)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'var(--ink)',
        color: 'var(--white)',
        padding: '80px 0 72px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(ellipse at 70% 50%, rgba(192,73,43,0.15) 0%, transparent 60%)',
        }} />
        <div className="container" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div className="fade-up">
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--rust-light)', marginBottom: 16, display: 'block' }}>
              New Collection 2024
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 300, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}>
              Goods for
              <br /><em>considered</em>
              <br />living
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(245,240,232,0.7)', maxWidth: 360, lineHeight: 1.7, marginBottom: 36 }}>
              Curated products that balance form and function. Every item selected for quality, durability, and thoughtful design.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <Link to="/products" className="btn btn-rust btn-lg">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/products?featured=true" className="btn btn-lg" style={{ background: 'transparent', color: 'var(--white)', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                Featured
              </Link>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
              'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
              'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
            ].map((src, i) => (
              <div key={i} style={{
                borderRadius: 8,
                overflow: 'hidden',
                height: 160,
                opacity: 0,
                animation: `fadeUp 0.5s ease ${0.1 * i + 0.2}s forwards`,
              }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section style={{ background: 'var(--sand)', padding: '20px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 64 }}>
          {[
            [Truck, 'Free shipping over $75'],
            [Shield, 'Secure checkout'],
            [RotateCcw, '30-day returns'],
            [Star, '10,000+ reviews'],
          ].map(([Icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: 'var(--ink-light)' }}>
              <Icon size={15} color="var(--rust)" />
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section style={{ padding: '64px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400 }}>Browse Categories</h2>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => navigate(`/products?category=${cat}`)}
                  style={{
                    padding: '10px 24px',
                    background: 'var(--white)',
                    border: '1.5px solid var(--border)',
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--ink)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--ink)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured products */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400 }}>Featured Products</h2>
            <Link to="/products" style={{ fontSize: 14, fontWeight: 500, color: 'var(--rust)', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ borderRadius: 8, overflow: 'hidden' }}>
                  <div className="skeleton" style={{ height: 220, marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 16, marginBottom: 8, width: '60%' }} />
                  <div className="skeleton" style={{ height: 20, width: '40%' }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
