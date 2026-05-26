import React from 'react';

function priceFmt(cents) {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

export default function ProductDetail({ product, onClose, onAddToCart }) {
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
          <button className="btn-primary" disabled={isOut} onClick={() => { onAddToCart(product); onClose(); }}>
            {isOut ? 'Esaurito' : '+ Aggiungi al carrello'}
          </button>
        </div>
      </div>
    </div>
  );
}
