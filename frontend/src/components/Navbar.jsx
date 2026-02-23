import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingBag, User, LogOut, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/')
  }

  const navLinks = [
    { to: '/products', label: 'Shop' },
    { to: '/products?category=Electronics', label: 'Electronics' },
    { to: '/products?category=Clothing', label: 'Clothing' },
  ]

  return (
    <header style={{
      background: 'var(--white)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 32, height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Shop<span style={{ color: 'var(--rust)' }}>Wave</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: 28, flex: 1 }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: location.pathname === link.to ? 'var(--rust)' : 'var(--ink-light)',
                transition: 'color 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--rust)'}
              onMouseLeave={e => e.target.style.color = location.pathname === link.to ? 'var(--rust)' : 'var(--ink-light)'}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user ? (
            <>
              <span style={{ fontSize: 13, color: 'var(--warm-gray)' }}>Hi, {user.full_name.split(' ')[0]}</span>
              {user.is_admin && (
                <Link to="/admin" title="Admin">
                  <Settings size={18} color="var(--ink-light)" />
                </Link>
              )}
              <Link to="/orders" title="Orders">
                <User size={18} color="var(--ink-light)" />
              </Link>
              <button onClick={handleLogout} title="Logout" style={{ background: 'none', border: 'none', display: 'flex' }}>
                <LogOut size={18} color="var(--ink-light)" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-light)' }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}

          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <ShoppingBag size={20} color="var(--ink)" />
            {itemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -6,
                right: -8,
                background: 'var(--rust)',
                color: 'white',
                borderRadius: '999px',
                fontSize: 10,
                fontWeight: 700,
                minWidth: 18,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
              }}>
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
