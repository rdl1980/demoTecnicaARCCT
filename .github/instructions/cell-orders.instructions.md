---
applyTo: "cell-orders/**"
---

# Cell: Orders — Operating Rules

**Port**: 3002 | **DB**: `cell-orders/db/orders.db`

## Responsibilities
Cart, checkout, orders, status transitions. Nothing else.

## Constraints
- DO NOT touch `cell-catalog/` or `frontend/`
- DO NOT create product search endpoints
- DO NOT read `catalog.db`, DO NOT call catalog APIs
- Prices = integer cents (`price_snapshot` immutable after checkout)
- Demo: `customer_id` = `"demo-user"` always

## Status Transitions
`pending → confirmed → shipped → delivered` | `pending|confirmed → cancelled`
`shipped` / `delivered` / `cancelled` cannot be cancelled.

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
Express on port 3002 | `better-sqlite3`, no ORM | Contract: `contracts/orders-api.yaml`
