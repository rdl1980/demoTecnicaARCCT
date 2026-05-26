---
applyTo: "cell-catalog/**"
---

# Cell: Catalog — Regole Operative

**Porta**: 3001 | **DB**: `cell-catalog/db/catalog.db`

## Responsabilità
Prodotti, categorie, brand, compatibilità, stock. Nient'altro.

## Vincoli
- NON toccare `cell-orders/` o `frontend/`
- NON creare endpoint per ordini, carrello, sconti, autenticazione
- NON leggere `orders.db`
- Prezzi = centesimi interi
- SKU formato: `CAT-XXXXX`

## Stock Logic
`low_stock` se qty < 5 | `out_of_stock` se qty = 0

## API
```
GET  /api/catalog/products
GET  /api/catalog/products/:sku
GET  /api/catalog/categories
GET  /api/catalog/products/:sku/stock
POST /api/catalog/products/stock-check
```

## Tech
Express su porta 3001 | `better-sqlite3`, no ORM | Contratto: `contracts/catalog-api.yaml`
