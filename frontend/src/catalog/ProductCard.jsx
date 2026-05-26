import React, { useState } from 'react';

function priceFmt(cents) {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

function stockBadge(level) {
  if (level === 'in_stock')    return <span className="badge badge-green">Disponibile</span>;
  if (level === 'low_stock')   return <span className="badge badge-yellow">Scorta bassa</span>;
  return <span className="badge badge-red">Esaurito</span>;
}

export default function ProductCard({ product, onAddToCart, onDetail, outOfStockHighlight }) {
  const isOut = product.stock_level === 'out_of_stock';
  const [qty, setQty] = useState(1);

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        cursor: 'pointer',
        border: outOfStockHighlight && isOut ? '2px solid var(--red)' : undefined,
        transition: 'border-color 0.2s',
      }}
      onClick={() => onDetail(product)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'IBM Plex Sans', monospace" }}>
          {product.sku}
        </span>
        {stockBadge(product.stock_level)}
      </div>
      <h3 style={{ fontSize: 16, fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1.2 }}>
        {product.name}
      </h3>
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        {product.brand} · {product.category}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {product.discount_pct != null ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {priceFmt(product.price_cents)}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', background: 'var(--red)', borderRadius: 4, padding: '1px 5px' }}>
                  -{Math.round(product.discount_pct * 100)}%
                </span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', fontFamily: "'Barlow Condensed', sans-serif" }}>
                {priceFmt(Math.round(product.price_cents * (1 - product.discount_pct)))}
              </span>
            </>
          ) : (
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', fontFamily: "'Barlow Condensed', sans-serif" }}>
              {priceFmt(product.price_cents)}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <button
              disabled={isOut || qty <= 1}
              onClick={e => { e.stopPropagation(); setQty(q => Math.max(1, q - 1)); }}
              style={{ width: 26, height: 28, background: 'var(--bg3)', border: 'none', cursor: isOut || qty <= 1 ? 'not-allowed' : 'pointer', fontSize: 16, lineHeight: 1, color: 'var(--text)' }}
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
              style={{ width: 32, height: 28, border: 'none', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', textAlign: 'center', background: 'var(--bg2)', color: 'var(--text)', fontSize: 13 }}
            />
            <button
              disabled={isOut || qty >= 99}
              onClick={e => { e.stopPropagation(); setQty(q => Math.min(99, q + 1)); }}
              style={{ width: 26, height: 28, background: 'var(--bg3)', border: 'none', cursor: isOut || qty >= 99 ? 'not-allowed' : 'pointer', fontSize: 16, lineHeight: 1, color: 'var(--text)' }}
            >+</button>
          </div>
          <button
            className="btn-primary"
            disabled={isOut}
            onClick={e => { e.stopPropagation(); onAddToCart(product, qty); setQty(1); }}
          >
            + Aggiungi
          </button>
        </div>
      </div>
    </div>
  );
}
