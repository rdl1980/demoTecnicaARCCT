import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ onCartClick, cartVersion }) {
  const location = useLocation();
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('/api/orders/cart')
      .then(r => r.json())
      .then(cart => {
        const total = (cart.items || []).reduce((s, i) => s + i.quantity, 0);
        setCount(total);
      })
      .catch(() => {});
  }, [cartVersion]);

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link to={to} style={{
        color: active ? 'var(--accent)' : 'var(--text)',
        textDecoration: 'none',
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 18,
        fontWeight: 600,
        letterSpacing: '0.05em',
        padding: '4px 0',
        borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
      }}>
        {label}
      </Link>
    );
  };

  return (
    <nav style={{
      background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 32,
      height: 56,
    }}>
      <span style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 22,
        fontWeight: 700,
        color: 'var(--accent)',
        letterSpacing: '0.08em',
      }}>
        AGRIPARTS
      </span>
      {navLink('/', 'Catalogo')}
      {navLink('/orders', 'Ordini')}
      <div style={{ marginLeft: 'auto' }}>
        <button className="btn-secondary" onClick={onCartClick} style={{ position: 'relative' }}>
          Carrello
          {count > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              background: 'var(--accent)', color: '#111',
              borderRadius: '50%', width: 18, height: 18,
              fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {count}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
