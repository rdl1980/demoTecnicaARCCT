import React from 'react';

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
        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', fontFamily: "'Barlow Condensed', sans-serif" }}>
          {priceFmt(product.price_cents)}
        </span>
        <button
          className="btn-primary"
          disabled={isOut}
          onClick={e => { e.stopPropagation(); onAddToCart(product); }}
        >
          + Aggiungi
        </button>
      </div>
    </div>
  );
}
