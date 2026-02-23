import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (isAdmin) => {
    setForm(isAdmin ? { email: 'admin@shop.com', password: 'admin123' } : { email: 'user@shop.com', password: 'user123' })
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }} className="fade-up">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'var(--warm-gray)', fontSize: 14 }}>Sign in to your account</p>
        </div>

        {/* Demo credentials */}
        <div style={{ background: 'var(--sand)', borderRadius: 6, padding: 14, marginBottom: 24, display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={() => fillDemo(false)} style={{ fontSize: 12, fontWeight: 600, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 4, padding: '5px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Fill Demo User
          </button>
          <button onClick={() => fillDemo(true)} style={{ fontSize: 12, fontWeight: 600, background: 'var(--rust)', color: 'white', border: 'none', borderRadius: 4, padding: '5px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Fill Admin
          </button>
        </div>

        <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label>Email Address</label>
              <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg btn-full" style={{ marginTop: 4 }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--warm-gray)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--rust)', fontWeight: 500 }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}
