import React, { useState } from 'react';

function priceFmt(cents) {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

export default function ProductDetail({ product, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);
  if (!product) return null;
  const isOut = product.stock_level === 'out_of_stock';

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
    }} onClick={onClose}>
      <div className="card" style={{ maxWidth: 560, width: '90%', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 22, color: 'var(--accent)' }}>{product.name}</h2>
          <button className="btn-secondary" style={{ padding: '4px 10px' }} onClick={onClose}>✕</button>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 12 }}>
          SKU: {product.sku} · {product.brand} · {product.category}
        </div>
        {product.description && (
          <p style={{ marginBottom: 16, lineHeight: 1.6 }}>{product.description}</p>
        )}
        {product.compatibility?.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ fontSize: 14, marginBottom: 8, color: 'var(--text-muted)' }}>Compatibilità</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {product.compatibility.map(m => (
                <span key={m} style={{
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderRadius: 4, padding: '2px 8px', fontSize: 12,
                }}>{m}</span>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {product.discount_pct != null ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {priceFmt(product.price_cents)}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: 'var(--red)', borderRadius: 4, padding: '2px 7px' }}>
                    -{Math.round(product.discount_pct * 100)}%
                  </span>
                </div>
                <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {priceFmt(Math.round(product.price_cents * (1 - product.discount_pct)))}
                </span>
              </>
            ) : (
              <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)', fontFamily: "'Barlow Condensed', sans-serif" }}>
                {priceFmt(product.price_cents)}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
              <button
                disabled={isOut || qty <= 1}
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{ width: 36, height: 36, background: 'var(--bg3)', border: 'none', cursor: isOut || qty <= 1 ? 'not-allowed' : 'pointer', fontSize: 18, lineHeight: 1, color: 'var(--text)' }}
              >−</button>
              <input
                type="number"
                min={1}
                max={99}
                value={qty}
                disabled={isOut}
                onChange={e => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) setQty(Math.min(99, Math.max(1, v)));
                }}
                style={{ width: 48, height: 36, border: 'none', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', textAlign: 'center', background: 'var(--bg2)', color: 'var(--text)', fontSize: 15 }}
              />
              <button
                disabled={isOut || qty >= 99}
                onClick={() => setQty(q => Math.min(99, q + 1))}
                style={{ width: 36, height: 36, background: 'var(--bg3)', border: 'none', cursor: isOut || qty >= 99 ? 'not-allowed' : 'pointer', fontSize: 18, lineHeight: 1, color: 'var(--text)' }}
              >+</button>
            </div>
            <button
              className="btn-primary"
              disabled={isOut}
              onClick={() => { onAddToCart(product, qty); setQty(1); onClose(); }}
            >
              {isOut ? 'Esaurito' : '+ Aggiungi al carrello'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
