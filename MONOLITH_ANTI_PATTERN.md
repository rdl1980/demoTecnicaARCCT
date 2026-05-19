# ANTI-PATTERN — Questo file NON è usato nel progetto
# Mostra cosa succede senza Cell Architecture
# Stima token: ~487 token | Cell catalog-agent: ~280 token (-43%) | Cell orders-agent: ~260 token (-47%)

## Stack
Node.js + Express + SQLite + React + Vite

## Database
- catalog.db: products, categories, brands, product_compatibility
- orders.db: carts, cart_items, orders, order_lines
Connessione: better-sqlite3. File db in /db/

## Regole prodotti
- SKU formato CAT-XXXXX
- StockLevel: in_stock (qty>=5), low_stock (qty<5), out_of_stock (qty=0)
- Un prodotto appartiene a una sola categoria
- Ricerca full-text su nome, SKU, descrizione, brand, compatibility
- Prezzo in centesimi interi

## Regole ordini
- Cart → Order solo via checkout
- Dopo checkout il cart si svuota
- price_snapshot copiato al checkout, immutabile
- Order shipped/delivered non cancellabile
- Transizioni: pending→confirmed→shipped→delivered, pending/confirmed→cancelled
- customer_id fisso: demo-user

## API Catalog
GET /api/catalog/products, GET /api/catalog/products/:sku
GET /api/catalog/categories, GET /api/catalog/products/:sku/stock
POST /api/catalog/products/stock-check

## API Orders
GET /api/orders/cart, POST /api/orders/cart/items
DELETE /api/orders/cart/items/:sku, POST /api/orders/checkout
GET /api/orders, GET /api/orders/:id, PATCH /api/orders/:id/status

## Seed data
20 prodotti in 5 categorie. Brand: SAME, Deutz-Fahr, Fendt, John Deere, New Holland.
3 ordini seed: delivered, shipped, pending.

## Frontend
React Vite. Tema industriale giallo/arancio. Font Barlow Condensed + IBM Plex Sans.
Pre-checkout: chiama stock-check, blocca se has_unavailable=true.

## Note sviluppatore
Non toccare il db dell'altra parte. Tieni separati i componenti.
