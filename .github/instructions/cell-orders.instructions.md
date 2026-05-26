---
applyTo: "cell-orders/**"
---

# Cell: Orders — Regole Operative

**Porta**: 3002 | **DB**: `cell-orders/db/orders.db`

## Responsabilità
Carrello, checkout, ordini, stati. Nient'altro.

## Vincoli
- NON toccare `cell-catalog/` o `frontend/`
- NON creare endpoint per ricerca prodotti
- NON leggere `catalog.db`, NON chiamare le API di catalog
- Prezzi = centesimi interi (`price_snapshot` immutabile dopo checkout)
- Demo: `customer_id` = `"demo-user"` sempre

## Transizioni Stato
`pending → confirmed → shipped → delivered` | `pending|confirmed → cancelled`
`shipped` / `delivered` / `cancelled` non cancellabili.

## API
```
GET    /api/orders/cart
POST   /api/orders/cart/items
DELETE /api/orders/cart/items/:sku
POST   /api/orders/checkout
GET    /api/orders
GET    /api/orders/:id
PATCH  /api/orders/:id/status
```

## Tech
Express su porta 3002 | `better-sqlite3`, no ORM | Contratto: `contracts/orders-api.yaml`
