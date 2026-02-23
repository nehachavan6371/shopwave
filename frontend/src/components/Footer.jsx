import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--ink)',
      color: 'var(--sand)',
      padding: '48px 0 32px',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 40 }}>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--white)' }}>
              Shop<span style={{ color: 'var(--rust-light)' }}>Wave</span>
            </span>
            <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.7, color: 'var(--warm-gray)', maxWidth: 260 }}>
              Curated goods for considered living. Quality over quantity, always.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, color: 'var(--warm-gray)' }}>Shop</p>
            {['Electronics', 'Clothing', 'Kitchen', 'Sports', 'Home'].map(c => (
              <Link key={c} to={`/products?category=${c}`} style={{ display: 'block', fontSize: 14, marginBottom: 8, color: 'var(--sand)', opacity: 0.8 }}>{c}</Link>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, color: 'var(--warm-gray)' }}>Account</p>
            {[['Login', '/login'], ['Register', '/register'], ['My Orders', '/orders'], ['Cart', '/cart']].map(([label, to]) => (
              <Link key={to} to={to} style={{ display: 'block', fontSize: 14, marginBottom: 8, color: 'var(--sand)', opacity: 0.8 }}>{label}</Link>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, color: 'var(--warm-gray)' }}>Info</p>
            {['About', 'Shipping', 'Returns', 'Contact'].map(item => (
              <p key={item} style={{ fontSize: 14, marginBottom: 8, color: 'var(--sand)', opacity: 0.8 }}>{item}</p>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--warm-gray)' }}>© 2024 ShopWave. All rights reserved.</p>
          <p style={{ fontSize: 13, color: 'var(--warm-gray)' }}>Built with React + FastAPI + PostgreSQL</p>
        </div>
      </div>
    </footer>
  )
}
