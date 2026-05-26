import React, { useEffect, useState, useCallback } from 'react';
import ProductCard from './ProductCard';
import ProductDetail from './ProductDetail';

export default function CatalogPage({ onCartChange }) {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters]       = useState({ category: '', q: '', stock: '' });
  const [detail, setDetail]         = useState(null);
  const [detailFull, setDetailFull] = useState(null);
  const [loading, setLoading]       = useState(true);

  const loadProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.q)        params.set('q', filters.q);
    if (filters.stock)    params.set('stock', filters.stock);
    fetch(`/api/catalog/products?${params}`)
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    fetch('/api/catalog/categories')
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  function openDetail(product) {
    setDetail(product);
    fetch(`/api/catalog/products/${product.sku}`)
      .then(r => r.json())
      .then(setDetailFull)
      .catch(() => setDetailFull(product));
  }

  function addToCart(product) {
    fetch('/api/orders/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sku: product.sku,
        product_name: product.name,
        quantity: 1,
        unit_price_cents: product.price_cents,
        ...(product.discount_pct != null && { discount_pct: product.discount_pct }),
      }),
    }).then(() => onCartChange());
  }

  return (
    <div>
      <div className="page-header">
        <h1>Catalogo Prodotti</h1>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          placeholder="Cerca per nome, SKU, brand, compatibilità…"
          value={filters.q}
          onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
          style={{ flex: '1 1 240px', minWidth: 200 }}
        />
        <select
          value={filters.category}
          onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          style={{ minWidth: 160 }}
        >
          <option value="">Tutte le categorie</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <select
          value={filters.stock}
          onChange={e => setFilters(f => ({ ...f, stock: e.target.value }))}
          style={{ minWidth: 140 }}
        >
          <option value="">Tutti gli stock</option>
          <option value="in_stock">Disponibile</option>
          <option value="low_stock">Scorta bassa</option>
          <option value="out_of_stock">Esaurito</option>
        </select>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Caricamento…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {products.map(p => (
            <ProductCard
              key={p.sku}
              product={p}
              onAddToCart={addToCart}
              onDetail={openDetail}
            />
          ))}
          {products.length === 0 && (
            <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1' }}>Nessun prodotto trovato.</p>
          )}
        </div>
      )}

      {detail && (
        <ProductDetail
          product={detailFull || detail}
          onClose={() => { setDetail(null); setDetailFull(null); }}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
}
