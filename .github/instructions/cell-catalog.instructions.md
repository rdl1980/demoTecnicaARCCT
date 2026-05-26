---
applyTo: "cell-catalog/**"
---

# Cell: Catalog — Operating Rules

**Port**: 3001 | **DB**: `cell-catalog/db/catalog.db`

## Responsibilities
Products, categories, brands, compatibility, stock. Nothing else.

## Constraints
- DO NOT touch `cell-orders/` or `frontend/`
- DO NOT create endpoints for orders, cart, discounts, or authentication
- DO NOT read `orders.db`
- Prices = integer cents
- SKU format: `CAT-XXXXX`

## Stock Logic
`low_stock` if qty < 5 | `out_of_stock` if qty = 0

## API
```
GET  /api/catalog/products
GET  /api/catalog/products/:sku
GET  /api/catalog/categories
GET  /api/catalog/products/:sku/stock
POST /api/catalog/products/stock-check
```

## Tech
Express on port 3001 | `better-sqlite3`, no ORM | Contract: `contracts/catalog-api.yaml`
