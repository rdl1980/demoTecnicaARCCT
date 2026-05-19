import React, { useEffect, useState } from 'react';
import OrderDetail from './OrderDetail';

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

function priceFmt(cents) {
  return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

export default function OrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  function loadOrders() {
    setLoading(true);
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { loadOrders(); }, []);

  function openOrder(id) {
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(setSelected)
      .catch(() => {});
  }

  function handleStatusChange(orderId, newStatus) {
    fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(r => r.json())
      .then(updated => {
        setSelected(updated);
        loadOrders();
      })
      .catch(() => {});
  }

  return (
    <div>
      <div className="page-header">
        <h1>I tuoi ordini</h1>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Caricamento…</p>
      ) : orders.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>Nessun ordine ancora.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map(order => (
            <div key={order.id} className="card" style={{ cursor: 'pointer' }} onClick={() => openOrder(order.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700 }}>
                    Ordine #{order.id}
                  </span>
                  {statusBadge(order.status)}
                </div>
                <span style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18 }}>
                  {priceFmt(order.total_cents)}
                </span>
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                {order.items_count} articol{order.items_count !== 1 ? 'i' : 'o'} ·{' '}
                {new Date(order.created_at).toLocaleDateString('it-IT')}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <OrderDetail
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
