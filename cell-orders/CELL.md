# Cell: Orders — Gestione Ordini AgriParts

## Scopo
Gestisce carrello e ciclo di vita degli ordini: aggiunta al carrello,
checkout, storico ordini, cambio stato.
NON conosce i dettagli del catalogo (solo SKU e prezzo passati dalla SPA).

## Linguaggio Ubiquo
- **Cart**: raccolta temporanea di CartItem per customer_id
- **CartItem**: sku, quantity, unit_price_snapshot, product_name
- **Order**: carrello confermato e immutabile
- **OrderLine**: riga di un ordine confermato
- **OrderStatus**: pending | confirmed | shipped | delivered | cancelled
- **price_snapshot**: prezzo al momento dell'ordine, non cambia mai

## Regole di Business
1. Cart → Order solo tramite checkout
2. Dopo il checkout il Cart viene svuotato
3. price_snapshot copiato dalla SPA al checkout, immutabile
4. Order shipped o delivered non può essere cancellato
5. Transizioni: pending→confirmed→shipped→delivered / pending|confirmed→cancelled
6. La Cell NON valida stock — la SPA chiama catalog/stock-check prima del checkout
7. customer_id per la demo: sempre demo-user

## API Contract
Contratto completo: cell-orders/contracts/orders-api.yaml
Endpoint:
- GET    /api/orders/cart
- POST   /api/orders/cart/items
- DELETE /api/orders/cart/items/:sku
- POST   /api/orders/checkout
- GET    /api/orders
- GET    /api/orders/:id
- PATCH  /api/orders/:id/status

## Dipendenze da altre Cell
- Prezzi e nomi prodotto arrivano dalla SPA nel body
- NON chiama mai le API di cell-catalog
- NON importa nulla da cell-catalog

## Cosa NON fare
- Non creare endpoint di ricerca prodotti
- Non leggere cell-catalog/db/catalog.db
- Non chiamare le API di cell-catalog
- Non modificare Order in stato shipped/delivered/cancelled

## Database
File: cell-orders/db/orders.db
Tabelle: carts, cart_items, orders, order_lines

## Note tecniche
- Express su porta 3002
- better-sqlite3, no ORM
- Importi in centesimi interi
