import { useState, useEffect } from 'react'
import { productsAPI, ordersAPI } from '../api'
import { Package, ShoppingBag, Plus, Edit2, Trash2, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export default function AdminDashboard() {
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState({
    name: '', description: '', price: '', original_price: '',
    stock: '', category: '', image_url: '', is_featured: false,
  })

  const loadData = async () => {
    setLoading(true)
    try {
      if (tab === 'products') {
        const { data } = await productsAPI.list({ limit: 100 })
        setProducts(data)
      } else {
        const { data } = await ordersAPI.allAdmin()
        setOrders(data)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [tab])

  const openCreate = () => {
    setEditProduct(null)
    setForm({ name: '', description: '', price: '', original_price: '', stock: '', category: '', image_url: '', is_featured: false })
    setShowForm(true)
  }

  const openEdit = (p) => {
    setEditProduct(p)
    setForm({ ...p, price: p.price, original_price: p.original_price || '', stock: p.stock })
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        stock: parseInt(form.stock),
      }
      if (editProduct) {
        await productsAPI.update(editProduct.id, payload)
        toast.success('Product updated')
      } else {
        await productsAPI.create(payload)
        toast.success('Product created')
      }
      setShowForm(false)
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Save failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await productsAPI.delete(id)
      toast.success('Product deleted')
      loadData()
    } catch { toast.error('Delete failed') }
  }

  const handleStatus = async (orderId, status) => {
    try {
      await ordersAPI.updateStatus(orderId, status)
      toast.success('Status updated')
      loadData()
    } catch { toast.error('Update failed') }
  }

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, marginBottom: 32 }}>Admin Dashboard</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 32, borderBottom: '2px solid var(--border)' }}>
        {[['products', Package, 'Products'], ['orders', ShoppingBag, 'Orders']].map(([key, Icon, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 24px',
              background: 'none', border: 'none',
              borderBottom: tab === key ? '2px solid var(--ink)' : '2px solid transparent',
              marginBottom: -2,
              fontFamily: 'var(--font-body)',
              fontWeight: tab === key ? 600 : 400,
              fontSize: 14,
              color: tab === key ? 'var(--ink)' : 'var(--warm-gray)',
              cursor: 'pointer',
            }}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <button onClick={openCreate} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={15} /> Add Product
            </button>
          </div>
          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--cream)', borderBottom: '1px solid var(--border)' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--warm-gray)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--warm-gray)' }}>Loading…</td></tr>
                ) : products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={p.image_url} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--warm-gray)' }}>{p.category}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 13, color: p.stock > 10 ? 'var(--success)' : p.stock > 0 ? 'var(--rust)' : 'red' }}>{p.stock}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-light)' }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rust)' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--cream)', borderBottom: '1px solid var(--border)' }}>
                {['Order', 'Date', 'Total', 'Status', 'Update'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--warm-gray)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--warm-gray)' }}>Loading…</td></tr>
              ) : orders.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 500 }}>#{o.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--warm-gray)' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600 }}>${o.total_amount.toFixed(2)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: '#eee', textTransform: 'capitalize' }}>{o.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      value={o.status}
                      onChange={e => handleStatus(o.id, e.target.value)}
                      style={{ fontSize: 12, padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 4, fontFamily: 'var(--font-body)', cursor: 'pointer' }}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'var(--white)', borderRadius: 8, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400 }}>
                {editProduct ? 'Edit Product' : 'New Product'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['name', 'Product Name', 'text', true], ['description', 'Description', 'text', false], ['category', 'Category', 'text', false], ['image_url', 'Image URL', 'url', false]].map(([key, label, type, req]) => (
                <div key={key} className="form-group">
                  <label>{label}</label>
                  <input className="input" type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={req} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input className="input" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Original Price</label>
                  <input className="input" type="number" step="0.01" value={form.original_price} onChange={e => setForm({ ...form, original_price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input className="input" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} />
                Featured product
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={handleSave} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <Check size={15} /> {editProduct ? 'Save Changes' : 'Create Product'}
              </button>
              <button onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
