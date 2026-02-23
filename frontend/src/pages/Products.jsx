import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { productsAPI } from '../api'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {}
      if (selectedCategory) params.category = selectedCategory
      if (search) params.search = search
      if (minPrice) params.min_price = minPrice
      if (maxPrice) params.max_price = maxPrice
      const { data } = await productsAPI.list(params)
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    productsAPI.categories().then(r => setCategories(r.data))
  }, [])

  useEffect(() => { fetchProducts() }, [selectedCategory])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts()
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
  }

  return (
    <div className="container" style={{ padding: '48px 24px' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, marginBottom: 8 }}>
          {selectedCategory || 'All Products'}
        </h1>
        <p style={{ color: 'var(--warm-gray)', fontSize: 14 }}>{products.length} products found</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 40 }}>
        {/* Sidebar filters */}
        <aside>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14 }}>
                <SlidersHorizontal size={15} /> Filters
              </span>
              <button onClick={clearFilters} style={{ background: 'none', border: 'none', fontSize: 12, color: 'var(--warm-gray)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <X size={12} /> Clear
              </button>
            </div>

            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: 12 }}>Category</p>
              {['', ...categories].map(cat => (
                <button
                  key={cat || 'all'}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '7px 10px',
                    background: selectedCategory === cat ? 'var(--ink)' : 'transparent',
                    color: selectedCategory === cat ? 'white' : 'var(--ink-light)',
                    border: 'none',
                    borderRadius: 4,
                    fontSize: 14,
                    cursor: 'pointer',
                    marginBottom: 2,
                    fontFamily: 'var(--font-body)',
                    transition: 'background 0.15s',
                  }}
                >
                  {cat || 'All Categories'}
                </button>
              ))}
            </div>

            <div>
              <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--warm-gray)', marginBottom: 12 }}>Price Range</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input className="input" placeholder="Min" type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ fontSize: 13 }} />
                <input className="input" placeholder="Max" type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ fontSize: 13 }} />
              </div>
              <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }} onClick={fetchProducts}>
                Apply
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div>
          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--warm-gray)' }} />
              <input
                className="input"
                style={{ paddingLeft: 38, width: '100%' }}
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ borderRadius: 8 }}>
                  <div className="skeleton" style={{ height: 200, marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 16, marginBottom: 8, width: '70%' }} />
                  <div className="skeleton" style={{ height: 20, width: '40%' }} />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--warm-gray)' }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🛍️</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 8 }}>No products found</p>
              <p style={{ fontSize: 14 }}>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
