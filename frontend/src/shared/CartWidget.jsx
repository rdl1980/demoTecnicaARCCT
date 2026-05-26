import React, { useEffect, useState } from 'react';

function priceFmt(cents) {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

export default function CartWidget({ onClose, onCartChange, cartVersion }) {
  const [cart, setCart]             = useState({ items: [], total_cents: 0 });
  const [checking, setChecking]     = useState(false);
  const [error, setError]           = useState(null);
  const [unavailable, setUnavailable] = useState([]); // [{ sku, stock_qty, requested_qty }]

  function loadCart() {
    fetch('/api/orders/cart')
      .then(r => r.json())
      .then(setCart)
      .catch(() => {});
  }

  useEffect(() => { loadCart(); }, [cartVersion]);

  function removeItem(sku) {
    fetch(`/api/orders/cart/items/${sku}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(c => { setCart(c); onCartChange(); setUnavailable([]); setError(null); });
  }

  async function handleCheckout() {
    setChecking(true);
    setError(null);
    setUnavailable([]);

    try {
      const items = cart.items.map(i => ({ sku: i.sku, requested_qty: i.quantity }));
      const stockRes = await fetch('/api/catalog/products/stock-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const stockData = await stockRes.json();

      if (stockData.has_unavailable) {
        const insufficient = stockData.results.filter(r => !r.available);
        setUnavailable(insufficient);
        setError('Stock insufficiente per alcuni prodotti. Modifica le quantità per procedere.');
        setChecking(false);
        return;
      }

      const orderRes = await fetch('/api/orders/checkout', { method: 'POST' });
      if (!orderRes.ok) {
        const err = await orderRes.json();
        setError(err.error || 'Errore durante il checkout.');
        setChecking(false);
        return;
      }

      onCartChange();
      onClose();
    } catch {
      setError('Errore di rete. Riprova.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300 }} onClick={onClose} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 380,
        background: 'var(--bg2)', borderLeft: '1px solid var(--border)',
        zIndex: 301, display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.4)',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 20, color: 'var(--accent)' }}>Carrello</h2>
          <button className="btn-secondary" style={{ padding: '4px 10px' }} onClick={onClose}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {error && <div className="error-banner">{error}</div>}
          {cart.items.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Il carrello è vuoto.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cart.items.map(item => {
                const unavailInfo = unavailable.find(u => u.sku === item.sku);
                const isUnavail = !!unavailInfo;
                return (
                  <div key={item.sku} className="card" style={{
                    border: isUnavail ? '2px solid var(--red)' : undefined,
                    transition: 'border-color 0.2s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 600 }}>
                        {item.product_name}
                      </span>
                      <button className="btn-danger" style={{ padding: '2px 8px', fontSize: 11 }} onClick={() => removeItem(item.sku)}>
                        Rimuovi
                      </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                      <span>{item.sku} · qty {item.quantity}</span>
                      <div style={{ textAlign: 'right' }}>
                        {item.discount_pct != null && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                              € {((item.quantity * item.unit_price_cents) / 100).toFixed(2).replace('.', ',')}
                            </span>
                            <span style={{ background: 'var(--red)', color: '#fff', borderRadius: 4, padding: '1px 5px', fontSize: 10, fontWeight: 700 }}>
                              -{Math.round(item.discount_pct * 100)}%
                            </span>
                          </div>
                        )}
                        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                          € {((item.quantity * (item.final_price_cents ?? item.unit_price_cents)) / 100).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                    {isUnavail && (
                      <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 4 }}>
                        Stock insufficiente: richiesti {unavailInfo.requested_qty}, disponibili {unavailInfo.stock_qty}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ color: 'var(--text-muted)' }}>Totale</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)', fontFamily: "'Barlow Condensed', sans-serif" }}>
              {priceFmt(cart.total_cents)}
            </span>
          </div>
          <button
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: 16 }}
            disabled={cart.items.length === 0 || checking}
            onClick={handleCheckout}
          >
            {checking ? 'Verifica stock…' : 'Checkout'}
          </button>
        </div>
      </div>
    </>
  );
}
