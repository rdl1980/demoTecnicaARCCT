import React from 'react';

function statusBadge(status) {
  const map = {
    pending:   { cls: 'badge-grey',   label: 'In attesa' },
    confirmed: { cls: 'badge-blue',   label: 'Confermato' },
    shipped:   { cls: 'badge-orange', label: 'Spedito' },
    delivered: { cls: 'badge-green',  label: 'Consegnato' },
    cancelled: { cls: 'badge-red',    label: 'Annullato' },
  };
  const { cls, label } = map[status] || { cls: 'badge-grey', label: status };
  return <span className={`badge ${cls}`}>{label}</span>;
}

const TRANSITIONS = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped:   ['delivered'],
  delivered: [],
  cancelled: [],
};

function priceFmt(cents) {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

export default function OrderDetail({ order, onClose, onStatusChange }) {
  if (!order) return null;
  const next = TRANSITIONS[order.status] || [];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
    }} onClick={onClose}>
      <div className="card" style={{ maxWidth: 560, width: '90%', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <h2 style={{ fontSize: 22, color: 'var(--accent)' }}>Ordine #{order.id}</h2>
            {statusBadge(order.status)}
          </div>
          <button className="btn-secondary" style={{ padding: '4px 10px' }} onClick={onClose}>✕</button>
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
          {new Date(order.created_at).toLocaleString('it-IT')}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {(order.lines || []).map((line, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{line.product_name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {line.sku} · qty {line.quantity} · {priceFmt(line.unit_price_cents)} cad.
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                {line.discount_pct != null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: 12 }}>
                      {priceFmt(line.quantity * line.unit_price_cents)}
                    </span>
                    <span style={{ background: 'var(--red)', color: '#fff', borderRadius: 4, padding: '1px 5px', fontSize: 10, fontWeight: 700 }}>
                      -{Math.round(line.discount_pct * 100)}%
                    </span>
                  </div>
                )}
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                  {priceFmt(line.quantity * (line.final_price_cents ?? line.unit_price_cents))}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ color: 'var(--text-muted)' }}>Totale</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)', fontFamily: "'Barlow Condensed', sans-serif" }}>
            {priceFmt(order.total_cents)}
          </span>
        </div>

        {next.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {next.map(s => (
              <button key={s} className="btn-secondary" onClick={() => onStatusChange(order.id, s)}>
                → {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
